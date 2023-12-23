<script lang="ts">
import type { Chat, GeminiChat } from 'GeminiService'
import { text } from 'stream/consumers'

export let gemini: GeminiChat
let textarea: HTMLTextAreaElement

type Message = {
    role: string
    parts: string
}

const history: Message[] = []

const textchange = () => {
    const height = textarea.scrollHeight
    textarea.style.height = `${height}px`
}

const addUserMsg = (msg: string) => {
    history.push({
        role: 'user',
        parts: msg,
    })
}

const send = async () => {
    if (textarea.value) {
        const msg = textarea.value
        textarea.value = ''
        addUserMsg(msg)
        const result = await gemini.send(msg)
        let text = ''
        for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            console.log(chunkText)
            text += chunkText
        }
        result.stream
    }
}

const enter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        if (e.shiftKey || e.altKey) {
            return
        } else {
            send()
            e.preventDefault()
        }
    }
}
</script>

<div class="gemini-chat">
    <div class="gemini-model"></div>
    <div class="gemini-prompt">
        <div class="gemini-prompt-wrapper">
            <textarea
                placeholder="Chat with Gemini.."
                rows="1"
                on:input={textchange}
                on:keypress={enter}
                bind:this={textarea}
            ></textarea>
            <span class="gemini-btn-send">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-corner-down-left"
                    ><polyline points="9 10 4 15 9 20" /><path
                        d="M20 4v7a4 4 0 0 1-4 4H4"
                    /></svg
                >
            </span>
        </div>
    </div>
</div>

<style>
.gemini-chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.gemini-model {
    flex: 1 1 0%;
    width: 100%;
}

.gemini-prompt {
    margin-bottom: 10px;
}

.gemini-prompt-wrapper {
    width: 100%;
    border-width: 1px;
    border-radius: 1rem;
    border-color: var(--text-faint);
    border-style: solid;
    border-width: 1px;
    display: flex;
    padding: 0px 10px;
}

.gemini-prompt textarea {
    max-height: 200px;
    width: 100%;
    overflow-y: hidden;
    line-height: 1.3rem;
    border: none;
    resize: none;
    outline: none;
}

.gemini-prompt textarea:active {
    border: none;
    outline: none;
    box-shadow: none;
}

.gemini-prompt textarea:focus {
    border: none;
    outline: none;
    box-shadow: none;
}

.gemini-btn-send {
    position: absolute;
    vertical-align: middle;
    right: 2rem;
    bottom: 1.7rem;
}
.gemini-btn-send svg {
    stroke: var(--text-faint);
}
</style>
