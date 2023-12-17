import {
    StateField,
    StateEffect,
} from '@codemirror/state'

import {
    EditorView,
    Decoration,
    type DecorationSet,
    WidgetType,
} from '@codemirror/view'
import Gemini from 'GeminiService'

import GeminiWidgetComponent from 'components/GeminiWidgetComponent.svelte'
import type GeminiAssistantPlugin from 'main'

export const addGemini = StateEffect.define<number>({
    map: (line, change) => {
        return change.mapPos(line)
    },
})

export const appendGemini = StateEffect.define<string>({
    map: (content) => content,
})

export const createState = (plugin: GeminiAssistantPlugin) => {
    return StateField.define<DecorationSet>({
        create() {
            return Decoration.none
        },
        update(widgets, tr) {
            widgets = widgets.map(tr.changes)
            for (let e of tr.effects) {
                if (e.is(addGemini)) {
                    console.log('dsf')
                    widgets = widgets.update({
                        add: [
                            {
                                from: 1,
                                to: 1,
                                value: Decoration.widget({
                                    widget: new GeminiWidget(plugin, 'Hello'),
                                    side: -1,
                                    block: true,
                                }),
                            },
                        ],
                    })
                }

                if (e.is(appendGemini)) {
                    widgets.update({})
                }
            }
            return widgets
        },
        provide: (field) => EditorView.decorations.from(field),
    })
}

class GeminiWidget extends WidgetType {
    private elContainer: HTMLElement = document.createElement('div')

    private plugin: GeminiAssistantPlugin

    private container = document.createElement('div')

    private prompt: string

    private gemini: Gemini

    constructor(plugin: GeminiAssistantPlugin, prompt: string) {
        super()
        this.prompt = prompt
        this.plugin = plugin
        this.gemini = new Gemini(plugin)
		this.generate()
		console.log("generate")
    }

    async generate() {
		console.log("generate")
        const result = await this.gemini.generate(this.prompt)
		console.log(result)
        if (result) {
            for await (const chunk of result.stream as any) {
                let text = chunk.text()
                let old = this.elContainer.getText()
                this.elContainer.setText(old + text)
            }
        }
    }

    toDOM(view: EditorView): HTMLElement {
        return this.elContainer
    }

    ignoreEvent(event: Event): boolean {
        return true
    }

    eq(widget: GeminiWidget): boolean {
        return widget.prompt == this.prompt
    }
}
