import GeminiAssistantPlugin from 'main'
import { GoogleGenerativeAI } from 'generative-ai.mjs'

export type Model = 'gemini-pro' | 'gemini-pro-vision'

export default class Gemini {
    private genAI: GoogleGenerativeAI
    private model: Model
    private plugin: GeminiAssistantPlugin

    constructor(plugin: GeminiAssistantPlugin, model?: Model) {
        this.model = model || plugin.getSettings().model
        this.plugin = plugin
        this.genAI = new GoogleGenerativeAI(plugin.getSettings().apiKey)
    }

    public startChat(model?: Model): GeminiChat {
        return new GeminiChat(
            this.plugin,
            this.genAI.getGenerativeModel({ model: this.model }),
        )
    }

    public async generate(prompt: any) {
        if (!prompt) {
            return
        }
        const model = this.genAI.getGenerativeModel({ model: this.model })
        model.generationConfig = {
            maxOutputTokens: this.plugin.getSettings().maxOutputTokens,
        }
        return await model.generateContentStream(prompt)
    }

    public async countToken(prompt: any) {
        const model = this.genAI.getGenerativeModel({ model: this.model })
        const { totalTokens } = await model.countTokens(prompt)
        return totalTokens
    }
}

class GeminiChat {
    private model: any
    private session

    constructor(plugin: GeminiAssistantPlugin, model: any) {
        this.model = model
        this.session = this.model.startChat({
            generateConfig: {
                maxOutputTokens: plugin.getSettings().maxOutputTokens,
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
