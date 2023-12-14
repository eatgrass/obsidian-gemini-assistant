import type GeminiAssistantPlugin from 'main'
import type { Editor } from 'obsidian'

const GENERATE_CONTENT_API: string =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export class ChatSession {
    private plugin: GeminiAssistantPlugin
    private key: string

    constructor(plugin: GeminiAssistantPlugin) {
        this.plugin = plugin
        this.key = plugin.getSettings().apiKey
    }

    public async chat(message: string) {
		if(!message) {
			return
		}

        if (!this.plugin.getSettings().apiKey) {
            return
        }

        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: message,
                        },
                    ],
                },
            ],
        }

        return fetch(GENERATE_CONTENT_API + `?key=${this.plugin.getSettings().apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
    }
}
