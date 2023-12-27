<script lang="ts">
import { tick, onMount } from 'svelte'
import type { GeminiChat } from 'GeminiService'
import { MarkdownRenderer, type ItemView, type App } from 'obsidian'
import GeminiIcon from './GeminiIcon.svelte'

export let gemini: GeminiChat
export let view: ItemView
export let app: App

let textarea: HTMLTextAreaElement

type Message = {
    role: string
    parts: string
    error?: string
}

onMount(() => {
    setTimeout(() => {
        textarea?.focus()
    }, 1000)
})

let container: HTMLElement

let history: Message[] = []

let generating: boolean = false

const textchange = () => {
    const height = textarea.scrollHeight
    textarea.style.height = `${height}px`
}

const addUserMsg = async (msg: string) => {
    const index = history.length
    history = [
        ...history,
        {
            role: 'user',
            parts: msg,
        },
    ]

    await tick()
    renderMd(index)
}

const renderMd = async (index: number) => {
    await tick()
    const els = container.getElementsByClassName('gemini-conv-text')
    if (els.length > 0) {
        console.log(history[index].parts)
        const el = els.item(index) as HTMLElement
        console.log(el)
        if (el) {
            el.empty()
            await MarkdownRenderer.render(
                app,
                history[index].parts,
                el,
                '',
                view,
            )
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
        }
    }
}

const send = async () => {
    if (generating) {
        return
    }

    generating = true

    if (textarea.value) {
        const msg = textarea.value
        textarea.value = ''
        await addUserMsg(msg)

        let index = history.length

        history = [
            ...history,
            {
                role: 'model',
                parts: '',
            },
        ]

        await addLoading(index)

        try {
            const result = await gemini.send(msg)
            let count = 0

            for await (const chunk of result.stream) {
                if (count == 0) {
                    history[index].parts = chunk.text()
                } else {
                    history[index].parts += chunk.text()
                }

                await renderMd(index)
                count++
            }
        } catch (e) {
            await renderError(index, e)
        } finally {
            generating = false
            removeLoading(index)
        }
    }
}

const addLoading = async (i: number) => {
    await tick()
    const els = container.getElementsByClassName('gemini-conv-name')
    if (els.length > 0) {
        const el = els.item(i) as HTMLElement
        if (el) {
            const div = document.createElement('span')
            div.addClass('gemini-ripple')
            el.append(div)
        }
    }
}

const removeLoading = (i: number) => {
    const els = container.getElementsByClassName('gemini-conv-name')
    if (els.length > 0) {
        const el = els.item(i) as HTMLElement
        if (el) {
            el.firstElementChild?.remove()
        }
    }
}

const renderError = async (i: number, e: any) => {
    if (!history[i]) {
        history = [
            ...history,
            {
                role: 'model',
                parts: '',
                error: e.toString(),
            },
        ]
    } else {
        history[i].error = e.toString()
    }

    await tick()

    const els = container.getElementsByClassName('gemini-conv-text')
    if (els.length > 0) {
        const el = els.item(i) as HTMLElement
        if (el) {
            el.empty()
            const div = document.createElement('div')
            div.setText(history[i].error || '')
            div.addClass('gemini-err-message')
            el.append(div)
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
        }
    }

    // resetConversation
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

<div class="gemini-chat" bind:this={container}>
    <div class="gemini-conversation">
        {#each history as conv}
            <div class="gemini-conv-item">
                <div class="gemini-conv-line">
                    <div class="gemini-conv-icon">
                        {#if conv.role == 'user'}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                viewBox="0 0 64 64"
                                style="stroke:var(--color-purple)"
                            >
                                <path
                                    d="M50.707,16.293l-13-13c-0.312-0.311-0.788-0.382-1.175-0.177l-17,9c-0.2,0.105-0.357,0.276-0.448,0.483l-7,16	c-0.105,0.24-0.111,0.514-0.018,0.76l10,26c0.114,0.295,0.36,0.52,0.666,0.604l17.974,5C40.795,60.988,40.885,61,40.974,61	c0.384,0,0.743-0.222,0.909-0.584l5.026-11c0.043-0.093,0.07-0.191,0.083-0.292l4-32C51.03,16.817,50.926,16.511,50.707,16.293z M39.307,58.498L24.071,54.26l2.543-27.973L39.307,58.498z M26.155,20.431l-4.709-7.064l0,0L36,5.661v4.925L26.155,20.431z M38,6.414l7.328,7.328L38,10.36V6.414z M14.081,29.024l6.102-13.947l4.789,7.184l-2.579,28.374L14.081,29.024z M45.026,48.724	l-3.985,8.721l-13.87-35.202L37.214,12.2l11.703,5.401l0,0L45.026,48.724z"
                                ></path>
                            </svg>
                        {:else}
                            <GeminiIcon width={null} height={null} />
                        {/if}
                    </div>
                    <div class="gemini-conv-content">
                        <div class="gemini-conv-name">
                            {#if conv.role == 'user'}
                                You
                            {:else}
                                Gemini
                            {/if}
                        </div>
                        <div class="markdown-rendered gemini-conv-text">
                            <!-- {conv.parts} -->
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
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

.gemini-conversation {
    flex: 1 1 0%;
    width: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
}

.gemini-conversation::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
}

.gemini-conv-item {
    width: 100%;
    padding: 1rem;
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

.gemini-conv-icon {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    margin-right: 10px;
}

.gemini-conv-icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 2px;
}

.gemini-conv-line {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    max-width: 50rem;
    width: 100%;
}

.gemini-conv-content {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    -webkit-user-select: text;
    user-select: text;
}

.gemini-conv-name {
    font-weight: 700;
    color: #7f7dd1;
}
</style>
