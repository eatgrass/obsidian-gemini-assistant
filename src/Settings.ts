import { PluginSettingTab, Setting } from 'obsidian'
import GeminiAssistantPlugin from 'main'
import { type Model } from 'GeminiService'
import type { Suggestion } from 'AssistantSuggestor'

export interface Settings {
    apiKey: string
    model: Model
    prompts: Suggestion[]
}
export const DEFAULT_SETTINGS: Settings = {
    apiKey: '',
    model: 'gemini-pro',
    prompts: [],
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

    public async updateSettings(newSettings: Partial<Settings>) {
        this.settings = { ...this.settings, ...newSettings }
        await this.plugin.saveData(this.settings)
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

        // for (let prompt of this.settings.prompts) {
        new Setting(containerEl)
            .setName('Hello')
            .addExtraButton((button) => {
				button.setIcon('edit')
				button.setTooltip('Edit')
			})
            .addExtraButton((button) => {
                button.setIcon('trash')
				button.setTooltip('Remove')
            })
        // }
    }

    public getSettings(): Settings {
        return this.settings
    }
}
