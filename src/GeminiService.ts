import GeminiAssistantPlugin from 'main'
import { GoogleGenerativeAI } from 'generative-ai.mjs'
import type { Prompt } from 'Settings'

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

    public async generate(option: Prompt) {
        if (!option.prompt || option.prompt.length == 0) {
            return
        }
        const model = this.genAI.getGenerativeModel({ model: option.model })

        model.generationConfig = {
            stopSequences: option.config.stopSequences,
            maxOutputTokens: option.config.maxOutputTokens,
            temperature: option.config.temperature,
            topP: option.config.topP,
            topK: option.config.topK,
        }
        return await model.generateContentStream(option.prompt)
    }

    public async countToken(prompt: any) {
        if (!prompt || prompt.length == 0) {
            return 0
        }

        const model = this.genAI.getGenerativeModel({ model: this.model })
        const { totalTokens } = await model.countTokens(prompt)
        return totalTokens
    }
}

export class GeminiChat {
    private model: any
    private session

    constructor(plugin: GeminiAssistantPlugin, model: any) {
        this.model = model
        this.session = this.model.startChat()
    }

    public async send(msg: string) {
        if (!msg) {
            return
        }

        const result = await this.session.sendMessageStream(msg)
        console.log(this.session)
        return result
    }
}

export type Chat = typeof GeminiChat
