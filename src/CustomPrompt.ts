import { DEFAULT_GEMINI_CONFIGS, PromptType, type Prompt } from 'Settings'
import GeminiAssistantPlugin from 'main'
import { Modal, Setting } from 'obsidian'

export default class CustomPrompt extends Modal {
    private prompt: Prompt
    private plugin: GeminiAssistantPlugin
    private index?: number

    constructor(plugin: GeminiAssistantPlugin, index?: number) {
        super(plugin.app)
        this.plugin = plugin
        this.index = index
        this.prompt =
            index !== undefined
                ? plugin.getSettings().prompts[index]
                : {
                      display: 'Custom prompt',
                      type: PromptType.SELECTION,
                      model: 'gemini-pro',
                      config: DEFAULT_GEMINI_CONFIGS['gemini-pro'],
                      prompt: '',
                  }

		console.log(plugin.getSettings())

        if (this.prompt) {
            this.titleEl.setText(this.prompt.display)
        }
    }

    async onOpen() {
        this.contentEl.empty()
        this.titleEl.setText(this.prompt.display)

        new Setting(this.contentEl).setName('Name').addText((text) => {
            text.setValue(this.prompt?.display || '')
            text.inputEl.style.width = '400px'
            text.onChange((text) => {
                this.prompt.display = text
                this.titleEl.setText(text)
            })
        })

        new Setting(this.contentEl).setName('Scope').addDropdown((dropdown) => {
            dropdown.addOption(PromptType.SELECTION, 'Selection')
            dropdown.addOption(PromptType.DOCUMENT, 'Document')
            dropdown.setValue(this.prompt.type)
            dropdown.onChange((value) => {
                this.prompt.type = value as PromptType
            })
        })

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
                    const prompts = this.plugin.getSettings().prompts
                    if (this.index !== undefined) {
                        prompts[this.index] = this.prompt
                    } else {
                        prompts.push(this.prompt)
                    }
                    this.plugin.updateSettings({ prompts }, true)
                    this.close()
                })
            })
    }
}
