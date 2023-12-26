import { ItemView, WorkspaceLeaf } from 'obsidian'
import ChatComponent from 'components/ChatComponent.svelte'
import type GeminiAssistantPlugin from 'main'

export const VIEW_TYPE_GEMINI_CHAT = 'gemini-chat-view'

export class ChatView extends ItemView {
    private plugin: GeminiAssistantPlugin
    private component?: ChatComponent

    constructor(plugin: GeminiAssistantPlugin, leaf: WorkspaceLeaf) {
        super(leaf)
        this.plugin = plugin
        this.icon = 'message-circle'
    }

    getViewType(): string {
        return VIEW_TYPE_GEMINI_CHAT
    }

    getDisplayText(): string {
        return 'Gemini Chat'
    }

    async onOpen() {
        this.contentEl.style.overflowY = 'hidden'
        this.component = new ChatComponent({
            target: this.contentEl,
            props: {
                gemini: this.plugin.gemini?.gemini.startChat(),
                view: this,
                app: this.plugin.app,
            },
        })
    }

    async onClose() {
        this.component?.$destroy()
    }
}
