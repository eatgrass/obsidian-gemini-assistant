import GeminiAssistantPlugin from 'main'
import { ButtonComponent, Editor, Modal, TextComponent } from 'obsidian'
import { ChatSession } from 'GeminiChat'

export default class PromoptModal extends Modal {
    private inputComponent?: TextComponent
    private input: string
    private readonly placeholder: string
    private editor: Editor
    private session: ChatSession

    constructor(plugin: GeminiAssistantPlugin, editor: Editor) {
        super(plugin.app)
        this.session = new ChatSession(plugin)
        this.editor = editor
        this.placeholder = 'Input prompt..'
        this.input = ''
        this.display()
        this.open()
    }

    protected createInputField(
        container: HTMLElement,
        placeholder?: string,
        value?: string,
    ) {
        const textComponent = new TextComponent(container)

        textComponent.inputEl.style.width = '100%'
        textComponent
            .setPlaceholder(placeholder ?? '')
            .setValue(value ?? '')
            .onChange((value) => (this.input = value))
            .inputEl.addEventListener('keydown', () => {})

        return textComponent
    }
    private display() {
        this.containerEl.addClass('gemini-prompt-diaglog')
        this.contentEl.empty()
        this.titleEl.textContent = 'Chat'
        const mainContentContainer: HTMLDivElement = this.contentEl.createDiv()
        this.inputComponent = this.createInputField(
            mainContentContainer,
            this.placeholder,
            this.input,
        )
        this.createButtonBar(mainContentContainer)
    }

    private createButton(
        container: HTMLElement,
        text: string,
        callback: (evt: MouseEvent) => unknown,
    ) {
        const btn = new ButtonComponent(container)
        btn.setButtonText(text).onClick(callback)
        return btn
    }

    private createButtonBar(mainContentContainer: HTMLDivElement) {
        const buttonBarContainer: HTMLDivElement =
            mainContentContainer.createDiv()
        this.createButton(buttonBarContainer, 'Send', () => {
            this.runChat(this.input)
            this.close()
        }).setCta().buttonEl.style.marginRight = '0'
        this.createButton(buttonBarContainer, 'Cancel', () => {
            this.close()
        })

        buttonBarContainer.style.display = 'flex'
        buttonBarContainer.style.flexDirection = 'row-reverse'
        buttonBarContainer.style.justifyContent = 'flex-start'
        buttonBarContainer.style.marginTop = '1rem'
        buttonBarContainer.style.gap = '0.5rem'
    }

    async runChat(input: string) {
        if (!input) {
            return
        }

        const line = this.editor.lastLine()
        const origin = this.editor.getLine(line)
        this.editor.setLine(line, `${origin}\n\n > Generating...`)

        this.session
            .chat(input)
            .then((response) => {
                return response?.json()
            })
            .then((data) => {
                let count = line + 2
                this.editor.setLine(count, `> **Gemini:** \n>\n`)
                data.candidates[0].content.parts[0].text
                    .split(/r?\n/)
                    .forEach((line: string, i: number) => {
                        console.log(line)
                        this.editor.setLine(count + i + 2, `> ${line}\n`)
                    })
            })
            .catch((error) => {
                this.editor.setLine(line + 2, `>[!fail] ${error}`)
            })
    }
}
