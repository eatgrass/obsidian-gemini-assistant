<script lang="ts">
import { tick, onMount } from 'svelte'
import type { GeminiChat } from 'GeminiService'
import { MarkdownRenderer, type ItemView, type App } from 'obsidian'
import GeminiIcon from './GeminiIcon.svelte'
import { nanoid } from 'nanoid'

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
                            {@const bid = nanoid()}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 512 512"
                            >
                                <radialGradient
                                    id="{bid}_bottom_left"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(-59 -225 150 -39 161.4 470)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".4"
                                    />
                                    <stop offset="1" stop-opacity=".1" />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_top-right"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(50 -379 280 37 360 374.2)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".6"
                                    />
                                    <stop
                                        offset="1"
                                        stop-color="#fff"
                                        stop-opacity=".1"
                                    />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_top-left"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(69 -319 218 47 175.4 307)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".8"
                                    />
                                    <stop
                                        offset="1"
                                        stop-color="#fff"
                                        stop-opacity=".4"
                                    />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_bottom-right"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(-96 -163 187 -111 335.3 512.2)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".3"
                                    />
                                    <stop offset="1" stop-opacity=".3" />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_top-edge"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(-36 166 -112 -24 310 128.2)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity="0"
                                    />
                                    <stop
                                        offset="1"
                                        stop-color="#fff"
                                        stop-opacity=".2"
                                    />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_left-edge"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(88 89 -190 187 111 220.2)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".2"
                                    />
                                    <stop
                                        offset="1"
                                        stop-color="#fff"
                                        stop-opacity=".4"
                                    />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_bottom-edge"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(9 130 -276 20 215 284)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".2"
                                    />
                                    <stop
                                        offset="1"
                                        stop-color="#fff"
                                        stop-opacity=".3"
                                    />
                                </radialGradient>
                                <radialGradient
                                    id="{bid}_middle-edge"
                                    cx="0"
                                    cy="0"
                                    gradientTransform="matrix(-198 -104 327 -623 400 399.2)"
                                    gradientUnits="userSpaceOnUse"
                                    r="1"
                                >
                                    <stop
                                        offset="0"
                                        stop-color="#fff"
                                        stop-opacity=".2"
                                    />
                                    <stop
                                        offset=".5"
                                        stop-color="#fff"
                                        stop-opacity=".2"
                                    />
                                    <stop
                                        offset="1"
                                        stop-color="#fff"
                                        stop-opacity=".3"
                                    />
                                </radialGradient>
                                <clipPath id="{bid}_clip">
                                    <path d="M.2.2h512v512H.2z" />
                                </clipPath>
                                <g clip-path="url(#{bid}_clip)">
                                    <path
                                        d="M382.3 475.6c-3.1 23.4-26 41.6-48.7 35.3-32.4-8.9-69.9-22.8-103.6-25.4l-51.7-4a34 34 0 0 1-22-10.2l-89-91.7a34 34 0 0 1-6.7-37.7s55-121 57.1-127.3c2-6.3 9.6-61.2 14-90.6 1.2-7.9 5-15 11-20.3L248 8.9a34.1 34.1 0 0 1 49.6 4.3L386 125.6a37 37 0 0 1 7.6 22.4c0 21.3 1.8 65 13.6 93.2 11.5 27.3 32.5 57 43.5 71.5a17.3 17.3 0 0 1 1.3 19.2 1494 1494 0 0 1-44.8 70.6c-15 22.3-21.9 49.9-25 73.1z"
                                        fill="#6c31e3"
                                    />
                                    <path
                                        d="M165.9 478.3c41.4-84 40.2-144.2 22.6-187-16.2-39.6-46.3-64.5-70-80-.6 2.3-1.3 4.4-2.2 6.5L60.6 342a34 34 0 0 0 6.6 37.7l89.1 91.7a34 34 0 0 0 9.6 7z"
                                        fill="url(#{bid}_bottom-left)"
                                    />
                                    <path
                                        d="M278.4 307.8c11.2 1.2 22.2 3.6 32.8 7.6 34 12.7 65 41.2 90.5 96.3 1.8-3.1 3.6-6.2 5.6-9.2a1536 1536 0 0 0 44.8-70.6 17 17 0 0 0-1.3-19.2c-11-14.6-32-44.2-43.5-71.5-11.8-28.2-13.5-72-13.6-93.2 0-8.1-2.6-16-7.6-22.4L297.6 13.2a34 34 0 0 0-1.5-1.7 96 96 0 0 1 2 54 198.3 198.3 0 0 1-17.6 41.3l-7.2 14.2a171 171 0 0 0-19.4 71c-1.2 29.4 4.8 66.4 24.5 115.8z"
                                        fill="url(#{bid}_top-right)"
                                    />
                                    <path
                                        d="M278.4 307.8c-19.7-49.4-25.8-86.4-24.5-115.9a171 171 0 0 1 19.4-71c2.3-4.8 4.8-9.5 7.2-14.1 7.1-13.9 14-27 17.6-41.4a96 96 0 0 0-2-54A34.1 34.1 0 0 0 248 9l-105.4 94.8a34.1 34.1 0 0 0-10.9 20.3l-12.8 85-.5 2.3c23.8 15.5 54 40.4 70.1 80a147 147 0 0 1 7.8 24.8c28-6.8 55.7-11 82.1-8.3z"
                                        fill="url(#{bid}_top-left)"
                                    />
                                    <path
                                        d="M333.6 511c22.7 6.2 45.6-12 48.7-35.4a187 187 0 0 1 19.4-63.9c-25.6-55-56.5-83.6-90.4-96.3-36-13.4-75.2-9-115 .7 8.9 40.4 3.6 93.3-30.4 162.2 4 1.8 8.1 3 12.5 3.3 0 0 24.4 2 53.6 4.1 29 2 72.4 17.1 101.6 25.2z"
                                        fill="url(#{bid}_bottom-right)"
                                    />
                                    <g clip-rule="evenodd" fill-rule="evenodd">
                                        <path
                                            d="M254.1 190c-1.3 29.2 2.4 62.8 22.1 112.1l-6.2-.5c-17.7-51.5-21.5-78-20.2-107.6a174.7 174.7 0 0 1 20.4-72c2.4-4.9 8-14.1 10.5-18.8 7.1-13.7 11.9-21 16-33.6 5.7-17.5 4.5-25.9 3.8-34.1 4.6 29.9-12.7 56-25.7 82.4a177.1 177.1 0 0 0-20.7 72z"
                                            fill="url(#{bid}_top-edge)"
                                        />
                                        <path
                                            d="M194.3 293.4c2.4 5.4 4.6 9.8 6 16.5L195 311c-2.1-7.8-3.8-13.4-6.8-20-17.8-42-46.3-63.6-69.7-79.5 28.2 15.2 57.2 39 75.7 81.9z"
                                            fill="url(#{bid}_left-edge)"
                                        />
                                        <path
                                            d="M200.6 315.1c9.8 46-1.2 104.2-33.6 160.9 27.1-56.2 40.2-110.1 29.3-160z"
                                            fill="url(#{bid}_bottom-edge)"
                                        />
                                        <path
                                            d="M312.5 311c53.1 19.9 73.6 63.6 88.9 100-19-38.1-45.2-80.3-90.8-96-34.8-11.8-64.1-10.4-114.3 1l-1.1-5c53.2-12.1 81-13.5 117.3 0z"
                                            fill="url(#{bid}_middle-edge)"
                                        />
                                    </g>
                                </g>
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
