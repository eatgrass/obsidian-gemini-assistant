<script lang="ts">
import type GeminiService from 'GeminiService'
import type { Prompt } from 'Settings'
import GeminiIcon from './GeminiIcon.svelte'

//32720
//12288

export let option: Prompt
export let gemini: GeminiService

const prompt = option.prompt
const token = gemini.countToken(prompt)
</script>

<div style="display:flex; justify-content: space-between;">
    <span>
        <span>
            <GeminiIcon width={12} height={12} />
        </span>
        {option.display}
    </span>
    {#await token}
        <span></span>
    {:then count}
        <span
            class={count > option.config.inputTokenLimit
                ? 'token-exceed'
                : 'token-normal'}
        >
            {count}
        </span>
    {:catch}
        <span></span>
    {/await}
</div>

<style>
.token-normal {
    font-size: 0.6rem;
    color: var(--text-muted);
    align-self: flex-end;
}
.token-exceed {
    font-size: 0.6rem;
    color: var(--text-error);
    align-self: flex-end;
}
</style>
