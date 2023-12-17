import { StateField, StateEffect, Annotation } from '@codemirror/state'

import {
    EditorView,
    Decoration,
    type DecorationSet,
    WidgetType,
} from '@codemirror/view'
import Gemini from 'GeminiService'

import GeminiWidgetComponent from 'components/GeminiWidgetComponent.svelte'
import type GeminiAssistantPlugin from 'main'
import { MarkdownRenderChild } from 'obsidian'
import { MarkdownRenderer } from 'obsidian'

export const annotation = Annotation.define<string>()

export const addGemini = StateEffect.define<{ pos: number; prompt: any }>({
    map: (value, change) => ({ pos: change.mapPos(value.pos + 2), prompt }),
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
                    widgets = widgets.update({
                        add: [
                            {
                                from: e.value.pos,
                                to: e.value.pos,
                                value: Decoration.widget({
                                    widget: new GeminiWidget(
                                        plugin,
                                        e.value.prompt,
                                    ),
                                    side: 1,
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

    private prompt: string

    private gemini: Gemini

    private content = ''

    constructor(plugin: GeminiAssistantPlugin, prompt: string) {
        super()
        this.prompt = prompt
        this.plugin = plugin
        this.gemini = new Gemini(plugin)
        // this.elContainer.addClass('gemini-widget')
        this.generate()
    }

    async generate() {
        const result = await this.gemini.generate(this.prompt)
        if (result) {
            for await (const chunk of result.stream as any) {
                this.elContainer.setText((this.content += chunk.text()))
            }
            const md = this.elContainer.createDiv()
            await MarkdownRenderer.render(
                this.plugin.app,
                this.content,
                md,
                '',
                new MarkdownRenderChild(md),
            )
            this.elContainer.setText('')
            this.elContainer.append(md)
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
