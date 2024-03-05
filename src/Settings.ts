import { PluginSettingTab, Setting } from 'obsidian'
import GeminiAssistantPlugin from 'main'
import { type Model } from 'GeminiService'
import GeminiModelSetting from 'GeminiModelSetting'

export enum Scope {
    DOCUMENT = 'DOCUMENT',
    SELECTION = 'SELECTION',
}

export interface GeminiPrompt extends GeminiChat {
    display: string
    scope: Scope
    prompt: string | any[]
}

export interface GeminiChat {
    config: GeminiConfig
    model: Model
    type: 'chat' | 'generative'
}

export type GeminiConfig = {
    stopSequences?: string[]
    outputTokenLimit: number
    maxOutputTokens: number
    temperature: number
    topP: number
    topK: number
    inputTokenLimit: number
}

export interface Settings {
    apiKey: string
    model: Model
    prompts: GeminiPrompt[]
    chat: GeminiChat
    saftyThreshold: string
}

export const DEFAULT_GEMINI_CONFIGS: Record<Model, GeminiConfig> = {
    'gemini-pro': {
        topK: 1,
        topP: 1,
        temperature: 0.9,
        outputTokenLimit: 2048,
        maxOutputTokens: 400,
        inputTokenLimit: 30720,
    },
    'gemini-pro-vision': {
        topK: 32,
        topP: 1,
        temperature: 0.4,
        outputTokenLimit: 4096,
        maxOutputTokens: 400,
        inputTokenLimit: 12288,
    },
}

export const DEFAULT_SETTINGS: Settings = {
    apiKey: '',
    model: 'gemini-pro',
    prompts: [
        {
            display: 'Ask Gemini (Selection)',
            scope: Scope.SELECTION,
            model: 'gemini-pro',
            config: DEFAULT_GEMINI_CONFIGS['gemini-pro'],
            prompt: '',
            type: 'generative',
        },
        {
            display: 'Ask Gemini (Document)',
            scope: Scope.DOCUMENT,
            model: 'gemini-pro',
            config: DEFAULT_GEMINI_CONFIGS['gemini-pro'],
            prompt: '',
            type: 'generative',
        },
    ],
    chat: {
        model: 'gemini-pro',
        config: DEFAULT_GEMINI_CONFIGS['gemini-pro'],
        type: 'chat',
    },
    saftyThreshold: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED',
}

export default class GeminiSettings extends PluginSettingTab {
    private settings: Settings
    private plugin: GeminiAssistantPlugin

    constructor(plugin: GeminiAssistantPlugin, settings: Settings) {
        super(plugin.app, plugin)
        this.plugin = plugin
        this.settings = settings
    }

    public async updateSettings(
        newSettings: Partial<Settings>,
        refresh: boolean = false,
    ) {
        this.settings = { ...this.settings, ...newSettings }
        await this.plugin.saveData(this.settings)
        if (refresh) {
            this.display()
        }
    }

    public display() {
        const { containerEl } = this
        containerEl.empty()

        new Setting(containerEl).setName('API Key').addText((text) => {
            text.setValue(this.settings.apiKey)
            text.onChange((apiKey) => {
                this.updateSettings({ apiKey })
                this.plugin.updateApiKey(apiKey)
            })
        })

        new Setting(containerEl)
            .setName('Chat Setting')
            .addExtraButton((button) => {
                button.setIcon('settings')
                button.setTooltip('Edit')
                button.onClick(() => {
                    new GeminiModelSetting(
                        this.plugin,
                        this.settings.chat,
                        (updated) => {
                            this.updateSettings({ chat: updated }, true)
                        },
                    ).open()
                })
            })

        new Setting(containerEl).setHeading().setName('Model')

        new Setting(containerEl)
            .setName('Harm Content Block Threshold')
            .addDropdown((dropdown) => {
                dropdown.addOptions({
                    HARM_BLOCK_THRESHOLD_UNSPECIFIED: 'Default',
                    BLOCK_LOW_AND_ABOVE: 'Low',
                    BLOCK_MEDIUM_AND_ABOVE: 'Medium',
                    BLOCK_ONLY_HIGH: 'High',
                    BLOCK_NONE: 'None',
                })
                dropdown.setValue(this.settings.saftyThreshold)

                dropdown.onChange((value) => {
                    this.updateSettings({ saftyThreshold: value })
                })
            })

        new Setting(containerEl)
            .setHeading()
            .setName('Prompts')
            .addExtraButton((button) => {
                button.setIcon('plus')
                button.setTooltip('Add prompt')
                button.onClick(() => {
                    let prompt: GeminiPrompt = {
                        display: 'Custom Prompt',
                        scope: Scope.SELECTION,
                        model: 'gemini-pro',
                        config: DEFAULT_GEMINI_CONFIGS['gemini-pro'],
                        prompt: '',
                        type: 'generative',
                    }
                    new GeminiModelSetting(this.plugin, prompt, (n) => {
                        this.updateSettings(
                            {
                                prompts: [
                                    ...this.settings.prompts,
                                    n as GeminiPrompt,
                                ],
                            },
                            true,
                        )
                    }).open()
                })
            })

        for (let i = 0; i < this.settings.prompts.length; i++) {
            new Setting(containerEl)
                .setName(this.settings.prompts[i].display)
                .addExtraButton((button) => {
                    button.setIcon('settings')
                    button.setTooltip('Edit')
                    button.onClick(() => {
                        new GeminiModelSetting(
                            this.plugin,
                            this.settings.prompts[i],
                            (updated) => {
                                let prompts = [...this.settings.prompts]
                                prompts[i] = updated as GeminiPrompt
                                this.plugin.updateSettings({ prompts }, true)
                            },
                        ).open()
                    })
                })
                .addExtraButton((button) => {
                    button.setIcon('trash')
                    button.setTooltip('Remove')
                    button.onClick(() => {
                        this.settings.prompts.splice(i, 1)
                        this.updateSettings(
                            { prompts: this.settings.prompts },
                            true,
                        )
                    })
                })
        }
    }

    public getSettings(): Settings {
        return this.settings
    }
}
