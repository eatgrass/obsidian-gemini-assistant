import GeminiChatSettings, { DEFAULT_SETTINGS, type Settings } from 'Settings'
import { Plugin, Editor, MarkdownView, type MarkdownFileInfo } from 'obsidian'
import AssistantSuggestor from 'AssistantSuggestor'
import { createState, addGemini, appendGemini } from 'GeminiExtension'
import { EditorView } from '@codemirror/view'
import { type Extension } from '@codemirror/state'

export default class GeminiAssistantPlugin extends Plugin {
    private cmExtension: Extension[] = []

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

        this.addCommand({
            id: 'gemini-append',
            name: 'Append',
            editorCallback: (
                editor: Editor,
                ctx: MarkdownView | MarkdownFileInfo,
            ) => {
                if (ctx instanceof MarkdownView) {
                    // @ts-expect-error, not typed
                    let view = ctx.editor.cm as EditorView
                    view.dispatch({
                        effects: [appendGemini.of('dsfs')],
                    })
                }
            },
        })
        this.addCommand({
            id: 'gemini-test',
            name: 'Test',
            editorCallback: (
                editor: Editor,
                ctx: MarkdownView | MarkdownFileInfo,
            ) => {
                if (ctx instanceof MarkdownView) {
                    // @ts-expect-error, not typed
                    let view = ctx.editor.cm as EditorView
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

    public updateEditorExtensions() {
        // Don't create a new array, keep the same reference
        this.cmExtension.length = 0
        // editor extension for inline queries: enabled regardless of settings (enableInlineDataview/enableInlineDataviewJS)
        this.cmExtension.push(createState(this))
        this.app.workspace.updateOptions()
    }
}
