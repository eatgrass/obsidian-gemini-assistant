import { Scope, type GeminiPrompt, type GeminiChat } from 'Settings'
import GeminiAssistantPlugin from 'main'
import { Modal, Setting } from 'obsidian'

export default class GeminiModelSetting extends Modal {
    private prompt: GeminiPrompt | GeminiChat
    private callback: (prompt: GeminiPrompt | GeminiChat) => void

    constructor(
        plugin: GeminiAssistantPlugin,
        prompt: GeminiPrompt | GeminiChat,
        callback: (prompt: GeminiPrompt | GeminiChat) => void,
    ) {
        super(plugin.app)
        this.prompt = { ...prompt }
        this.callback = callback
    }

    async onOpen() {
        this.contentEl.empty()

        this.titleEl.setText('Model Setting')

        if (this.prompt.type == 'generative') {
            let p = this.prompt as GeminiPrompt
            new Setting(this.contentEl).setName('Name').addText((text) => {
                text.setValue(p.display || '')
                text.inputEl.style.width = '400px'
                text.onChange((text) => {
                    p.display = text
                })
            })

            new Setting(this.contentEl)
                .setName('Scope')
                .addDropdown((dropdown) => {
                    dropdown.addOption(Scope.SELECTION, 'Selection')
                    dropdown.addOption(Scope.DOCUMENT, 'Document')
                    dropdown.setValue(p.scope)
                    dropdown.onChange((value) => {
                        p.scope = value as Scope
                    })
                })
        }

        new Setting(this.contentEl)
            .setName('Max output tokens')
            .addSlider((slider) => {
                slider.setLimits(1, this.prompt.config.outputTokenLimit, 1)
                slider.setDynamicTooltip()
                slider.setValue(this.prompt.config.maxOutputTokens)
                slider.onChange((value) => {
                    this.prompt.config.maxOutputTokens = value
                })
            })

        new Setting(this.contentEl)
            .setName('Temperature')
            .addSlider((slider) => {
                slider.setLimits(0, 1, 0.1)
                slider.setDynamicTooltip()
                slider.setValue(this.prompt.config.temperature)
                slider.onChange((value) => {
                    this.prompt.config.temperature = value
                })
            })

        new Setting(this.contentEl).setName('Top P').addSlider((slider) => {
            slider.setLimits(0, 1, 0.05)
            slider.setDynamicTooltip()
            slider.setValue(this.prompt.config.topP)
            slider.onChange((value) => {
                this.prompt.config.topP = value
            })
        })

        new Setting(this.contentEl).setName('Top K').addText((text) => {
            text.setValue(this.prompt.config.topK.toString())

            text.onChange((value) => {
                if (value.match(/^[1-9]\d*$/)) {
                    this.prompt.config.topK = parseInt(value)
                } else {
                    text.setValue(this.prompt.config.topK.toString())
                }
            })
        })

        new Setting(this.contentEl).setName('Prompt').addTextArea((text) => {
            text.setValue(this.prompt.prompt as string)
            text.inputEl.style.width = '400px'
            text.inputEl.style.resize = 'none'
            text.onChange((text) => {
                this.prompt.prompt = text
            })
        })

        new Setting(this.contentEl)
            .addButton((button) => {
                button.setButtonText('Close')
                button.onClick(() => {
                    this.close()
                })
            })
            .addButton((button) => {
                button.setButtonText('Save')
                button.buttonEl.style.backgroundColor =
                    'var(--interactive-accent)'
                button.onClick(() => {
                    // const prompts = this.plugin.getSettings().prompts

                    this.callback(this.prompt)
                    // if (this.index !== undefined) {
                    //     prompts[this.index] = this.prompt
                    // } else {
                    //     prompts.push(this.prompt)
                    // }
                    // this.plugin.updateSettings({ prompts }, true)
                    this.close()
                })
            })
    }
}
