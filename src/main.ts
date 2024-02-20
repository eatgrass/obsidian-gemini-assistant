import GeminiChatSettings, { DEFAULT_SETTINGS, type Settings } from 'Settings'
import {
    Plugin,
    Editor,
    MarkdownView,
    type MarkdownFileInfo,
    WorkspaceLeaf,
} from 'obsidian'
import AssistantSuggestor from 'AssistantSuggestor'
import { GeminiExtension } from 'GeminiExtension'
import { type Extension } from '@codemirror/state'
import { VIEW_TYPE_GEMINI_CHAT, ChatView } from 'ChatView'

export default class GeminiAssistantPlugin extends Plugin {
    private cmExtension: Extension[] = []

    public gemini?: GeminiExtension

    private settings?: GeminiChatSettings

    public getSettings(): Settings {
        return this.settings?.getSettings() || DEFAULT_SETTINGS
    }

    public async updateSettings(
        newSettings: Partial<Settings>,
        refresh: boolean = false,
    ) {
        await this.settings?.updateSettings(newSettings, refresh)
    }

    async onload() {
        const settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) }
        this.settings = new GeminiChatSettings(this, settings)
        this.addSettingTab(this.settings)
        this.cmExtension = []
        this.registerEditorExtension(this.cmExtension)
        this.updateEditorExtensions()
        this.registerView(
            VIEW_TYPE_GEMINI_CHAT,
            (leaf) => new ChatView(this, leaf),
        )
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

        this.addRibbonIcon('message-circle', 'New Gemini chat', () => {
            this.newChatView()
        })

        this.addCommand({
            id: 'gemini-chat',
            name: 'New Gemini chat',
            callback: () => {
                this.newChatView()
            },
        })
    }

    public updateApiKey(key: string) {
        this.gemini?.updateApiKey(key)
    }

    async newChatView() {
        let { workspace } = this.app

        let leaf = workspace.getLeaf()
        await leaf.setViewState({
            type: VIEW_TYPE_GEMINI_CHAT,
            active: true,
        })

        workspace.revealLeaf(leaf)
    }

    async activateChatView() {
        let { workspace } = this.app

        let leaf: WorkspaceLeaf | null = null
        let leaves = workspace.getLeavesOfType(VIEW_TYPE_GEMINI_CHAT)

        if (leaves.length > 0) {
            leaf = leaves[0]
        } else {
            leaf = workspace.getRightLeaf(false)
            await leaf.setViewState({
                type: VIEW_TYPE_GEMINI_CHAT,
                active: true,
            })
        }

        workspace.revealLeaf(leaf)
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
