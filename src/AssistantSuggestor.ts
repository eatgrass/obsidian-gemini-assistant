import Gemini from 'GeminiService'
import type GeminiAssistantPlugin from 'main'
import { Editor, MarkdownView, SuggestModal } from 'obsidian'
import { EditorView } from '@codemirror/view'
import { addGemini, annotation } from 'GeminiExtension'

enum Command {
    'ASK_SELECTION',
    'ASK_DOC',
}

type Suggestion = {
    command: Command
    display: string
}

export default class AssistantSuggestor extends SuggestModal<Suggestion> {
    private editor: Editor

    private prompt: any = ''

    private view: EditorView

    private gemini: Gemini

    private suggestions: Suggestion[] = [
        {
            command: Command.ASK_SELECTION,
            display: 'Ask Gemini',
        },
        {
            command: Command.ASK_DOC,
            display: 'Ask Gemini (document)',
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
        this.gemini = new Gemini(plugin)
        // @ts-expect-error, not typed
        this.view = view.editor.cm
        this.open()
    }

    getSuggestions(prompt: string): Suggestion[] | Promise<Suggestion[]> {
        this.prompt = prompt

        const suggestions = [...this.suggestions]
        if (this.editor.somethingSelected()) {
            suggestions[0].display = suggestions[0].display + ' (selection)'
            this.prompt = [prompt, this.editor.getSelection()]
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
        // const stream = await this.session.send(this.prompt)
        // const result = await this.gemini.generate(this.prompt)

        const cursor = this.editor.getCursor()
        const line = this.view.state.doc.line(cursor.line + 1)

        // new line below current cursor position
        this.view.dispatch({
            changes: [
                {
                    from: line.to,
                    insert: '\n\n',
                },
            ],
            // selection: { anchor: line.to + 2 },
            effects: [addGemini.of({ pos: line.to, prompt: this.prompt })],
			annotations: annotation.of("gemini")
        })

        this.prompt = ''
    }
}
