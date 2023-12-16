import GeminiChatSettings, { DEFAULT_SETTINGS, type Settings } from 'Settings'
import { Plugin, Editor, MarkdownView, type MarkdownFileInfo } from 'obsidian'
import Gemini from 'GeminiService'
import AssistantSuggestor from 'AssistantSuggestor'

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
            editorCallback: (
                editor: Editor,
                ctx: MarkdownView | MarkdownFileInfo,
            ) => {
                if (ctx instanceof MarkdownView) {
                    new AssistantSuggestor(this, editor, ctx)
                }
            },
        })

        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu, editor, view) => {
                menu.addItem((item) => {
                    item.setTitle('Test').onClick(async () => {
                        editor.replaceRange('Hello', editor.getCursor())
                    })
                })
            }),
        )
    }
}
