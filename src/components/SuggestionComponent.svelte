<script lang="ts">
import { type Suggestion } from '../AssistantSuggestor'
import type GeminiService from 'GeminiService'

//32720
//12288

export let item: Suggestion
export let gemini: GeminiService

const prompt = item._prompt
const token = gemini.countToken(prompt)
</script>

<div style="display:flex; justify-content: space-between;">
    <span>
        <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="12"
                height="12"
                viewBox="0 0 64 64"
            >
                <linearGradient
                    id="Pl9x765sEya2T~V8LKMRTa_48166_gr1"
                    x1="32"
                    x2="32"
                    y1="4.75"
                    y2="60.568"
                    gradientUnits="userSpaceOnUse"
                    spreadMethod="reflect"
                    ><stop offset="0" stop-color="#1a6dff"></stop><stop
                        offset="1"
                        stop-color="#c822ff"
                    ></stop></linearGradient
                ><path
                    fill="url(#Pl9x765sEya2T~V8LKMRTa_48166_gr1)"
                    d="M32.51,58c-10.073,0-19.149-5.485-23.687-14.315C6.976,40.075,6,36.035,6,32 s0.976-8.075,2.823-11.684C13.361,11.485,22.437,6,32.51,6c6.756,0,12.891,2.342,17.743,6.772l0.781,0.713l-8.756,8.58l-0.699-0.655 c-2.423-2.27-5.559-3.469-9.068-3.469c-6.017,0-11.373,3.868-13.328,9.626c-0.496,1.457-0.747,2.945-0.747,4.425 c0,1.477,0.251,2.964,0.747,4.42c1.952,5.75,7.308,9.613,13.328,9.613c3.048,0,5.845-0.779,8.09-2.253 c2.058-1.351,3.6-3.412,4.352-5.772H31V26h26.396l0.128,0.851C57.81,28.74,58,30.397,58,32.341c0,7.856-2.818,14.727-7.937,19.345 C45.498,55.816,39.428,58,32.51,58z M32.51,8c-9.32,0-17.715,5.069-21.907,13.229C8.876,24.604,8,28.228,8,32 s0.876,7.396,2.604,10.771C14.795,50.931,23.19,56,32.51,56c6.414,0,12.02-2.005,16.212-5.798C53.416,45.967,56,39.624,56,32.341 c0-1.527-0.127-2.88-0.329-4.341H33v8h14.456l-0.235,1.193c-0.666,3.377-2.678,6.384-5.522,8.251 c-2.571,1.688-5.748,2.581-9.188,2.581c-6.876,0-12.994-4.408-15.221-10.97c-0.566-1.663-0.853-3.367-0.853-5.063 c0-1.699,0.287-3.404,0.853-5.068c2.23-6.568,8.347-10.982,15.221-10.982c3.689,0,7.027,1.164,9.714,3.376l5.883-5.765 C43.763,9.916,38.394,8,32.51,8z"
                ></path><linearGradient
                    id="Pl9x765sEya2T~V8LKMRTb_48166_gr2"
                    x1="32"
                    x2="32"
                    y1="10.75"
                    y2="55.408"
                    gradientUnits="userSpaceOnUse"
                    spreadMethod="reflect"
                    ><stop offset="0" stop-color="#6dc7ff"></stop><stop
                        offset="1"
                        stop-color="#e6abff"
                    ></stop></linearGradient
                ><path
                    fill="url(#Pl9x765sEya2T~V8LKMRTb_48166_gr2)"
                    d="M32,53c-11.58,0-21-9.421-21-21s9.42-21,21-21c3.924,0,7.75,1.089,11.067,3.149l-1.056,1.699 C39.012,13.985,35.55,13,32,13c-10.477,0-19,8.523-19,19s8.523,19,19,19c10.141,0,18.452-7.986,18.974-18H36v-2h17v1 C53,43.579,43.58,53,32,53z"
                ></path>
            </svg>
        </span>
        {item.display}
    </span>
    {#await token}
        <span>...</span>
    {:then count}
        <span>{count} tokens</span>
    {:catch}
        <span></span>
    {/await}
</div>
