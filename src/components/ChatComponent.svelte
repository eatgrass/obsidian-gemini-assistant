<script lang="ts">
import { tick } from 'svelte'
import type { GeminiChat } from 'GeminiService'
import { MarkdownRenderer, type ItemView, type App } from 'obsidian'
export let gemini: GeminiChat
export let view: ItemView
export let app: App

let textarea: HTMLTextAreaElement

type Message = {
    role: string
    parts: string
}

let history: Message[] = []

let current: number = 0
let generating: boolean = false

const textchange = () => {
    const height = textarea.scrollHeight
    textarea.style.height = `${height}px`
}

const addUserMsg = (msg: string) => {
    const index = history.length
    history = [
        ...history,
        {
            role: 'user',
            parts: msg,
        },
    ]

    renderMd(index)
}

const renderMd = async (index: number) => {
    await tick()
    const els = document.getElementsByClassName('gemini-conv-text')
    if (els.length > 0) {
        const el = els.item(index) as HTMLElement
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
        addUserMsg(msg)
        const result = await gemini.send(msg)
        let count = 0
        let index = history.length

        for await (const chunk of result.stream) {
            if (count == 0) {
                history = [
                    ...history,
                    {
                        role: 'model',
                        parts: chunk.text(),
                    },
                ]
            } else {
                history[index].parts += chunk.text()
                await renderMd(index)
            }
            count++
        }
        generating = false
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
                                viewBox="0 0 48 48"
                            >
                                <polygon
                                    fill="#5c6bc0"
                                    points="9.464,21.643 14.964,9.071 28.321,3.155 37.5,11.736 34.25,37.185 31.096,45.118 17.321,42.071"
                                ></polygon><polygon
                                    fill="#e8eaf6"
                                    points="38.536,12.214 28.321,7.5 28.321,2"
                                ></polygon><polygon
                                    fill="#c5cae9"
                                    points="28.321,7.5 19.679,16.143 31.443,46 35.393,37.357 38.536,12.214"
                                ></polygon><polygon
                                    fill="#9fa8da"
                                    points="28.321,7.5 19.679,16.143 14.964,9.071 28.321,2"
                                ></polygon><polygon
                                    fill="#7986cb"
                                    points="17.321,42.071 19.679,16.143 31.443,46"
                                ></polygon>
                            </svg>
                        {:else}
                            <svg
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1080 1080"
                                ><path
                                    d="M515.09 725.824l-43.084 98.679c-16.562 37.931-69.052 37.931-85.613 0l-43.085-98.679c-38.342-87.818-107.355-157.72-193.44-195.932l-118.59-52.641c-37.704-16.736-37.704-71.586 0-88.322l114.886-50.997c88.299-39.195 158.55-111.688 196.237-202.501l43.643-105.162c16.195-39.025 70.115-39.025 86.311 0l43.643 105.163c37.687 90.812 107.937 163.305 196.236 202.5l114.887 50.997c37.704 16.736 37.704 71.586 0 88.322L708.53 529.892c-86.084 38.212-155.097 108.114-193.44 195.932z"
                                    fill="url(#prefix__paint0_radial_2525_777)"
                                /><path
                                    d="M915.485 1036.98l-12.118 27.77c-8.868 20.33-37.018 20.33-45.886 0l-12.117-27.77c-21.599-49.515-60.502-88.938-109.046-110.505l-37.331-16.586c-20.185-8.968-20.185-38.311 0-47.279l35.244-15.659c49.792-22.122 89.392-63.004 110.62-114.201l12.443-30.009c8.672-20.915 37.588-20.915 46.26 0l12.443 30.009c21.228 51.197 60.829 92.079 110.623 114.201l35.24 15.659c20.19 8.968 20.19 38.311 0 47.279l-37.33 16.586c-48.543 21.567-87.447 60.99-109.045 110.505z"
                                    fill="url(#prefix__paint1_radial_2525_777)"
                                /><defs
                                    ><radialGradient
                                        id="prefix__paint0_radial_2525_777"
                                        cx="0"
                                        cy="0"
                                        r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="rotate(78.858 46.989 644.69) scale(665.5 665.824)"
                                        ><stop stop-color="#1BA1E3" /><stop
                                            offset="0"
                                            stop-color="#1BA1E3"
                                        /><stop
                                            offset=".3"
                                            stop-color="#5489D6"
                                        /><stop
                                            offset=".546"
                                            stop-color="#9B72CB"
                                        /><stop
                                            offset=".825"
                                            stop-color="#D96570"
                                        /><stop
                                            offset="1"
                                            stop-color="#F49C46"
                                        /></radialGradient
                                    ><radialGradient
                                        id="prefix__paint1_radial_2525_777"
                                        cx="0"
                                        cy="0"
                                        r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="rotate(78.858 46.989 644.69) scale(665.5 665.824)"
                                        ><stop stop-color="#1BA1E3" /><stop
                                            offset="0"
                                            stop-color="#1BA1E3"
                                        /><stop
                                            offset=".3"
                                            stop-color="#5489D6"
                                        /><stop
                                            offset=".546"
                                            stop-color="#9B72CB"
                                        /><stop
                                            offset=".825"
                                            stop-color="#D96570"
                                        /><stop
                                            offset="1"
                                            stop-color="#F49C46"
                                        /></radialGradient
                                    ></defs
                                ></svg
                            >
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
}

.gemini-conv-name {
    font-weight: 700;
    color: #7f7dd1;
}
</style>
