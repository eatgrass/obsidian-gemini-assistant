import type GeminiAssistantPlugin from 'main'
import { GoogleGenerativeAI } from 'generative-ai.mjs'

export type Model = 'gemini-pro' | 'gemini-pro-vision'

export default class Gemini {
    private genAI: GoogleGenerativeAI
    private model

    constructor(plugin: GeminiAssistantPlugin, model?: Model) {
        const m = model || plugin.getSettings().model
        this.genAI = new GoogleGenerativeAI(plugin.getSettings().apiKey)
        this.model = this.genAI.getGenerativeModel({ model: m })
    }

    public startChat(model?: Model): GeminiChat {
        return new GeminiChat(
            model ? this.genAI.getGenerativeModel({ model }) : this.model,
        )
    }

    public async generate(prompt: any) {
        if (!prompt) {
            return
        }
        return await this.model.generateContentStream(prompt)
    }
}

class GeminiChat {
    private model
    private session

    constructor(model: any) {
        this.model = model
        this.session = this.model.startChat({
            generateConfig: {
                maxOutputTokens: 1024,
            },
        })
    }

    public async send(msg: string) {
        if (!msg) {
            return
        }

        const result = await this.session.sendMessageStream(msg)

        return async (callback: (c: string) => Promise<void>) => {
            for await (const chunk of result.stream as any) {
                await callback(chunk.text())
            }
        }
    }
}

export type Chat = typeof GeminiChat
