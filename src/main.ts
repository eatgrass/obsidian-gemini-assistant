import GeminiChatSettings, { DEFAULT_SETTINGS, type Settings } from 'Settings'
import { Plugin, Editor, MarkdownView, type MarkdownFileInfo } from 'obsidian'
import AssistantSuggestor from 'AssistantSuggestor'
import { GeminiExtension } from 'GeminiExtension'
import { type Extension } from '@codemirror/state'

export default class GeminiAssistantPlugin extends Plugin {
    private cmExtension: Extension[] = []

    public gemini?: GeminiExtension

    private settings?: GeminiChatSettings

    public getSettings(): Settings {
        return this.settings?.getSettings() || DEFAULT_SETTINGS
    }

    async onload() {
        const settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) }
        this.settings = new GeminiChatSettings(this, settings)
        this.addSettingTab(this.settings)
        this.cmExtension = []
        this.registerEditorExtension(this.cmExtension)
        this.updateEditorExtensions()

        this.addCommand({
            id: 'gemini-assistant',
            name: 'Open assistant',
            editorCallback: (
                editor: Editor,
                ctx: MarkdownView | MarkdownFileInfo,
            ) => {
                if (ctx instanceof MarkdownView) {
                    new AssistantSuggestor(this, editor, ctx)
                }
            },
        })
    }

    public updateEditorExtensions() {
        this.gemini = new GeminiExtension(this)

        // Don't create a new array, keep the same reference
        this.cmExtension.length = 0
        // editor extension for inline queries: enabled regardless of settings (enableInlineDataview/enableInlineDataviewJS)
        this.cmExtension.push(this.gemini.getExtension())
        this.app.workspace.updateOptions()
    }
}
