import Gemini from 'GeminiService'
import type GeminiAssistantPlugin from 'main'
import { Editor, MarkdownView, SuggestModal } from 'obsidian'
import { EditorView } from '@codemirror/view'
import { GeminiExtension } from 'GeminiExtension'

enum PromptType {
    DOCUMENT,
    SELECTION,
}

type Suggestion = {
    prompt: string
    display: string
    type: PromptType
}

export default class AssistantSuggestor extends SuggestModal<Suggestion> {
    private editor: Editor

    private query: any = ''

    private view: EditorView

    private gemini?: GeminiExtension

    private suggestions: Suggestion[] = [
        {
            prompt: '',
            display: 'Ask Gemini',
            type: PromptType.SELECTION,
        },
        {
            prompt: '',
            display: 'Ask Gemini (document)',
            type: PromptType.DOCUMENT,
        },
    ]

    constructor(
        plugin: GeminiAssistantPlugin,
        editor: Editor,
        view: MarkdownView,
    ) {
        super(plugin.app)
        this.editor = editor
        this.inputEl.placeholder = 'Prompt...'
        this.gemini = plugin.gemini
        // @ts-expect-error, not typed
        this.view = view.editor.cm
        this.open()
    }

    getSuggestions(query: string): Suggestion[] | Promise<Suggestion[]> {
        this.query = query
        const suggestions = [...this.suggestions]
        if (this.editor.somethingSelected()) {
            suggestions[0].display = suggestions[0].display + ' (selection)'
        }

        return suggestions
    }

    renderSuggestion(suggestion: Suggestion, el: HTMLElement) {
        const span = el.createSpan()
        span.setText(suggestion.display)
        el.append(span)
    }

    async onChooseSuggestion(
        item: Suggestion,
        evt: MouseEvent | KeyboardEvent,
    ) {
        const prompt = []
        if (this.query) {
            prompt.push(this.query)
        }
        if (item.prompt) {
            prompt.push(item.prompt)
        }

        if (item.type == PromptType.DOCUMENT) {
            const doc = this.editor.getValue()
            if (doc) {
                prompt.push(doc)
            }
        }

        if (item.type == PromptType.SELECTION) {
            const selection = this.editor.getSelection()
            if (selection) {
                prompt.push(selection)
            }
        }

        this.gemini?.generate(this.view, prompt)
        this.query = ''
    }
}
