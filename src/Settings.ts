import { PluginSettingTab, Setting } from 'obsidian'
import GeminiAssistantPlugin from 'main'

export interface Settings {
    apiKey: string
}
export const DEFAULT_SETTINGS: Settings = {
    apiKey: '',
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
    }

    public getSettings(): Settings {
        return this.settings
    }
}
