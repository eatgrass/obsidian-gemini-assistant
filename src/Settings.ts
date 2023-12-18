import { PluginSettingTab, Setting } from 'obsidian'
import GeminiAssistantPlugin from 'main'
import { type Model } from 'GeminiService'
import type { Suggestion } from 'AssistantSuggestor'
import CustomPrompt from 'CustomPrompt'

export interface Settings {
    apiKey: string
    model: Model
    prompts: Suggestion[]
    maxOutputTokens: number
}
export const DEFAULT_SETTINGS: Settings = {
    apiKey: '',
    model: 'gemini-pro',
    prompts: [],
    maxOutputTokens: 400,
}

const MODELS: Record<Model, { description: string }> = {
    'gemini-pro': {
        description: 'text generate',
    },
    'gemini-pro-vision': {
        description: 'multi modal',
    },
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

        new Setting(containerEl).setName('API key').addText((text) => {
            text.setValue(this.settings.apiKey)
            text.onChange((apiKey) => {
                this.updateSettings({ apiKey })
            })
        })

        // TODO suppoert vision modal
        // new Setting(containerEl).setName('Model').addDropdown((select) => {
        //     Object.entries(MODELS).forEach(([key, _]) => {
        //         select.addOptions({
        //             [key]: key,
        //         })
        //     })
        //     select.setValue(this.settings.model)
        //     select.onChange((value) => {
        //         this.updateSettings({ model: value as Model })
        //     })
        // })
        //
        new Setting(containerEl)
            .setName('Max output tokens')
            .setDesc(
                'Specifies the maximum number of tokens that can be generated in the response. A token is approximately four characters. 100 tokens correspond to roughly 60-80 words.',
            )
            .addText((text) => {
                text.setValue(this.settings.maxOutputTokens.toString())
                text.onChange((value) => {
                    if (value.match(/^[1-9]\d*$/)) {
                        this.updateSettings({
                            maxOutputTokens: parseInt(value),
                        })
                    } else {
                        text.setValue(this.settings.maxOutputTokens.toString())
                    }
                })
            })

        new Setting(containerEl).setName('Prompts').addExtraButton((button) => {
            button.setIcon('plus')
            button.setTooltip('Add prompt')
            button.onClick(() => {
                new CustomPrompt(this.plugin).open()
            })
        })

        for (let i = 0; i < this.settings.prompts.length; i++) {
            new Setting(containerEl)
                .setName(this.settings.prompts[i].display)
                .addExtraButton((button) => {
                    button.setIcon('edit')
                    button.setTooltip('Edit')
                    button.onClick(() => {
                        new CustomPrompt(this.plugin, i).open()
                    })
                })
                .addExtraButton((button) => {
                    button.setIcon('trash')
                    button.setTooltip('Remove')
                    button.onClick(() => {
                        console.log(this.settings.prompts)
                        this.settings.prompts.splice(i, 1)
                        console.log(this.settings.prompts)
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
