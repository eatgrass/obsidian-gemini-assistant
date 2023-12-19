import type GeminiAssistantPlugin from 'main'
import { Editor, MarkdownView, SuggestModal } from 'obsidian'
import { EditorView } from '@codemirror/view'
import { GeminiExtension } from 'GeminiExtension'
import SuggestionComponent from './components/SuggestionComponent.svelte'
import { PromptType, type Prompt as PromptOption } from 'Settings'

export default class AssistantSuggestor extends SuggestModal<PromptOption> {
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

    getSuggestions(query: string): PromptOption[] | Promise<PromptOption[]> {
        this.query = query

        return this.plugin.getSettings().prompts.map((option) => {
            const prompt = this.getPrompt(option)
            return {
                ...option,
                prompt,
            }
        })
    }

    renderSuggestion(option: PromptOption, el: HTMLElement) {
        new SuggestionComponent({
            target: el,
            props: {
                option,
                gemini: this.gemini?.gemini,
            },
        })
    }

    async onChooseSuggestion(
        option: PromptOption,
        evt: MouseEvent | KeyboardEvent,
    ) {
        this.gemini?.generate(this.view, option)
        this.query = ''
    }

    private getPrompt(option: PromptOption) {
        const prompt = []
        if (this.query) {
            prompt.push(this.query)
        }
        if (option.prompt) {
            prompt.push(option.prompt)
        }

        if (option.type == PromptType.DOCUMENT) {
            const doc = this.editor.getValue()
            if (doc) {
                prompt.push(doc)
            }
        }

        if (option.type == PromptType.SELECTION) {
            const selection = this.editor.getSelection()
            if (selection) {
                prompt.push(selection)
            }
        }
        return prompt
    }
}
