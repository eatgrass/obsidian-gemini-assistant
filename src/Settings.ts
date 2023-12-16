import { PluginSettingTab, Setting } from 'obsidian'
import GeminiAssistantPlugin from 'main'
import { type Model } from 'GeminiService'

export interface Settings {
    apiKey: string
    model: Model
}
export const DEFAULT_SETTINGS: Settings = {
    apiKey: '',
    model: 'gemini-pro',
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

        new Setting(containerEl).setName('Model').addDropdown((select) => {
            Object.entries(MODELS).forEach(([key, _]) => {
                select.addOptions({
                    [key]: key,
                })
            })
            select.setValue(this.settings.model)
            select.onChange((value) => {
                this.updateSettings({ model: value as Model })
            })
        })
    }

    public getSettings(): Settings {
        return this.settings
    }
}
