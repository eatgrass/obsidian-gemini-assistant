import GeminiAssistantPlugin from 'main'
import { GoogleGenerativeAI } from 'generative-ai.mjs'

import type { GeminiPrompt } from 'Settings'
export type Model = 'gemini-pro' | 'gemini-pro-vision'

export default class Gemini {
    private genAI: GoogleGenerativeAI
    private model: Model
    private plugin: GeminiAssistantPlugin
    private apiKey: string

    constructor(plugin: GeminiAssistantPlugin, model?: Model) {
        this.model = model || plugin.getSettings().model
        this.plugin = plugin
        this.apiKey = plugin.getSettings().apiKey
        this.genAI = new GoogleGenerativeAI(this.apiKey)
    }

    public updateApiKey(key: string) {
        this.apiKey = key
        this.genAI = new GoogleGenerativeAI(this.apiKey)
    }

    public startChat(model?: Model): GeminiChat {
        return new GeminiChat(
            this.plugin,
            this.genAI.getGenerativeModel({ model: this.model }),
        )
    }

    public async generate(option: GeminiPrompt) {
        if (!option.prompt || option.prompt.length == 0) {
            return
        }

        const model = this.genAI.getGenerativeModel({ model: option.model })
        const threshold = this.plugin.getSettings().safetyThreshold

        model.generationConfig = {
            stopSequences: option.config.stopSequences,
            maxOutputTokens: option.config.maxOutputTokens,
            temperature: option.config.temperature,
            topP: option.config.topP,
            topK: option.config.topK,
        }

        model.safetySettings = [
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold,
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold,
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold,
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold,
            },
        ]

        // model.safetySettings = {
        // 	(HarmCategory as any).HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        // 	(HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        // }
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
        const threshold = plugin.getSettings().safetyThreshold
        this.model = model
        const safetySettings = [
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold,
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold,
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold,
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold,
            },
        ]
        this.session = this.model.startChat({
            history: [],
            safetySettings,
        })
    }

    public async send(msg: string) {
        if (!msg) {
            return
        }

        const result = await this.session.sendMessageStream(msg)
        return result
    }
}

export type Chat = typeof GeminiChat
