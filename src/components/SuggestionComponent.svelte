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

<div class="gemini-option">
    <span>
        <span>
            <svg
                width="12px"
                height="12px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8.03339 3.65784C8.37932 2.78072 9.62068 2.78072 9.96661 3.65785L11.0386 6.37599C11.1442 6.64378 11.3562 6.85576 11.624 6.96137L14.3422 8.03339C15.2193 8.37932 15.2193 9.62068 14.3422 9.96661L11.624 11.0386C11.3562 11.1442 11.1442 11.3562 11.0386 11.624L9.96661 14.3422C9.62067 15.2193 8.37932 15.2193 8.03339 14.3422L6.96137 11.624C6.85575 11.3562 6.64378 11.1442 6.37599 11.0386L3.65784 9.96661C2.78072 9.62067 2.78072 8.37932 3.65785 8.03339L6.37599 6.96137C6.64378 6.85575 6.85576 6.64378 6.96137 6.37599L8.03339 3.65784Z"
                />
                <path
                    d="M16.4885 13.3481C16.6715 12.884 17.3285 12.884 17.5115 13.3481L18.3121 15.3781C18.368 15.5198 18.4802 15.632 18.6219 15.6879L20.6519 16.4885C21.116 16.6715 21.116 17.3285 20.6519 17.5115L18.6219 18.3121C18.4802 18.368 18.368 18.4802 18.3121 18.6219L17.5115 20.6519C17.3285 21.116 16.6715 21.116 16.4885 20.6519L15.6879 18.6219C15.632 18.4802 15.5198 18.368 15.3781 18.3121L13.3481 17.5115C12.884 17.3285 12.884 16.6715 13.3481 16.4885L15.3781 15.6879C15.5198 15.632 15.632 15.5198 15.6879 15.3781L16.4885 13.3481Z"
                />
            </svg>
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
.gemini-option svg {
    stroke: var(--text-normal);
    stroke-width: 2px;
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
