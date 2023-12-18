import { PromptType, type Suggestion } from 'AssistantSuggestor'
import GeminiAssistantPlugin from 'main'
import { Modal, Setting } from 'obsidian'

export default class CustomPrompt extends Modal {
    private suggestion: Suggestion
    private plugin: GeminiAssistantPlugin
    private index?: number

    constructor(plugin: GeminiAssistantPlugin, index?: number) {
        super(plugin.app)
        this.plugin = plugin
        this.index = index
        this.suggestion =
            index !== undefined
                ? plugin.getSettings().prompts[index]
                : {
                      display: 'Custom prompt',
                      type: PromptType.SELECTION,
                      prompt: '',
                  }

        if (this.suggestion) {
            this.titleEl.setText(this.suggestion.display)
        }
    }

    async onOpen() {
        this.contentEl.empty()
        this.titleEl.setText(this.suggestion.display)

        new Setting(this.contentEl).setName('Name').addText((text) => {
            text.setValue(this.suggestion?.display || '')
            text.inputEl.style.width = '400px'
            text.onChange((text) => {
                this.suggestion.display = text
                this.titleEl.setText(text)
            })
        })

        new Setting(this.contentEl).setName('Scope').addDropdown((dropdown) => {
            dropdown.addOption(PromptType.SELECTION, 'Selection')
            dropdown.addOption(PromptType.DOCUMENT, 'Document')
            dropdown.setValue(this.suggestion.type)
            dropdown.onChange((value) => {
                this.suggestion.type = value as PromptType
            })
        })

        new Setting(this.contentEl).setName('Prompt').addTextArea((text) => {
            text.setValue(this.suggestion.prompt)
            text.inputEl.style.width = '400px'
            text.inputEl.style.resize = 'none'
            text.onChange((text) => {
                this.suggestion.prompt = text
            })
        })

        new Setting(this.contentEl)
            .addButton((button) => {
                button.setButtonText('Close')
                button.onClick(() => {
                    this.close()
                })
            })
            .addButton((button) => {
                button.setButtonText('Save')
                button.buttonEl.style.backgroundColor =
                    'var(--interactive-accent)'
                button.onClick(() => {
                    const prompts = this.plugin.getSettings().prompts
                    if (this.index !== undefined) {
                        prompts[this.index] = this.suggestion
                    } else {
                        prompts.push(this.suggestion)
                    }
                    this.plugin.updateSettings({ prompts }, true)
                    this.close()
                })
            })
    }
}
