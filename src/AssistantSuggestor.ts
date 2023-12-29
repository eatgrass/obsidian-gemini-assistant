import type GeminiAssistantPlugin from 'main'
import { Editor, MarkdownView, SuggestModal } from 'obsidian'
import { EditorView } from '@codemirror/view'
import { GeminiExtension } from 'GeminiExtension'
import SuggestionComponent from './components/SuggestionComponent.svelte'
import { Scope, type GeminiPrompt } from 'Settings'
import type Gemini from 'GeminiService'

export default class AssistantSuggestor extends SuggestModal<GeminiPrompt> {
    private editor: Editor

    private query: any = ''

    private view: EditorView

    private gemini?: GeminiExtension

    private plugin: GeminiAssistantPlugin

    constructor(
        plugin: GeminiAssistantPlugin,
        editor: Editor,
        view: MarkdownView,
    ) {
        super(plugin.app)
        this.plugin = plugin
        this.editor = editor
        this.inputEl.placeholder = 'Prompt...'
        this.gemini = plugin.gemini
        // @ts-expect-error, not typed
        this.view = view.editor.cm
        this.open()
    }

    getSuggestions(query: string): GeminiPrompt[] | Promise<GeminiPrompt[]> {
        this.query = query

        return this.plugin.getSettings().prompts.map((option) => {
            const prompt = this.getPrompt(option)
            return {
                ...option,
                prompt,
            }
        })
    }

    renderSuggestion(option: GeminiPrompt, el: HTMLElement) {
        new SuggestionComponent({
            target: el,
            props: {
                option,
                gemini: this.gemini?.gemini,
            },
        })
    }

    async onChooseSuggestion(
        option: GeminiPrompt,
        evt: MouseEvent | KeyboardEvent,
    ) {
        this.gemini?.generate(this.view, option)
        this.query = ''
    }

    private getPrompt(option: GeminiPrompt) {
        const prompt = []
        if (this.query) {
            prompt.push(this.query)
        }
        if (option.prompt) {
            prompt.push(option.prompt)
        }

        if (option.scope == Scope.DOCUMENT) {
            const doc = this.editor.getValue()
            if (doc) {
                prompt.push(doc)
            }
        }

        if (option.scope == Scope.SELECTION) {
            const selection = this.editor.getSelection()
            if (selection) {
                prompt.push(selection)
            }
        }
        return prompt
    }
}
