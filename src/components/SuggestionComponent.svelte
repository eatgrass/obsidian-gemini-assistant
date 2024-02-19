<script lang="ts">
import type GeminiService from 'GeminiService'
import type { Prompt } from 'Settings'
import GeminiIcon from './GeminiIcon.svelte'

export let option: Prompt
export let gemini: GeminiService

const prompt = option.prompt
const token = gemini.countToken(prompt)
</script>

<div class="gemini-option">
    <span>
        <span>
            <GeminiIcon width="12px" height="12px" />
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
.gemini-option {
    display: flex;
    justify-content: space-between;
}

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
