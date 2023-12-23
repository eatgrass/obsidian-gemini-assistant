import { ItemView, WorkspaceLeaf } from 'obsidian'
import ChatComponent from 'components/ChatComponent.svelte'
import type GeminiAssistantPlugin from 'main'

export const VIEW_TYPE_GEMINI_CHAT = 'gemini-chat-view'

export class ChatView extends ItemView {


	private plugin: GeminiAssistantPlugin

    constructor(plugin: GeminiAssistantPlugin, leaf: WorkspaceLeaf) {
        super(leaf)
		this.plugin = plugin
        this.icon = 'timer'
    }

    getViewType(): string {
        return VIEW_TYPE_GEMINI_CHAT
    }

    getDisplayText(): string {
        return 'Gemini Chat'
    }

    async onOpen() {
        new ChatComponent({
            target: this.contentEl,
            props: {
				gemini: this.plugin.gemini?.gemini.startChat()
			},
        })
    }

    async onClose() {}
}
