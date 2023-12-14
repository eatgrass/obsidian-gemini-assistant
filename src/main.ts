import GeminiChatSettings, { DEFAULT_SETTINGS, type Settings } from 'Settings'
import { Plugin, Editor } from 'obsidian'
import PromptModal from 'PromptModal'
import { ChatSession } from 'GeminiChat'

export default class GeminiAssistantPlugin extends Plugin {
    private settings?: GeminiChatSettings

    public getSettings(): Settings {
        return this.settings?.getSettings() || DEFAULT_SETTINGS
    }

    async onload() {
        const settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) }
        this.settings = new GeminiChatSettings(this, settings)
        this.addSettingTab(this.settings)

        this.addCommand({
            id: 'gemini-chat',
            name: 'Chat',
            editorCallback: (editor: Editor) => {
                new PromptModal(this, editor)
            },
        })

        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu, editor, view) => {
                menu.addItem((item) => {
                    item.setTitle('Chat selection')
                        .setIcon('comment')
                        .onClick(async () => {
                            const content = editor.getSelection()

                            if (!content) {
                                return
                            }

                            const session = new ChatSession(this)
                            const line = editor.lastLine()

                            const origin = editor.getLine(line)
                            editor.setLine(
                                line,
                                `${origin}\n\n > Generating...`,
                            )
                            session
                                .chat(content)
                                .then((response) => response?.json())
                                .then((data) => {
                                    let count = line + 2
                                    editor.setLine(count, `> **Gemini:** \n>\n`)
                                    data.candidates[0].content.parts[0].text
                                        .split(/r?\n/)
                                        .forEach((line: string, i: number) => {
                                            console.log(line)
                                            editor.setLine(
                                                count + i + 2,
                                                `> ${line}\n`,
                                            )
                                        })
                                })
                                .catch((error) => {
                                    editor.setLine(
                                        line + 2,
                                        `>[!fail] ${error}`,
                                    )
                                })
                        })
                })
            }),
        )
    }
}
