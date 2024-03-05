/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@google/generative-ai@0.2.1/dist/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var t,e,n,s,i,o;!function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"}(t||(t={})),function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"}(e||(e={})),function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"}(n||(n={})),function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"}(s||(s={})),function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.OTHER="OTHER"}(i||(i={})),function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"}(o||(o={}));
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class r extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class a extends r{constructor(t,e){super(t),this.response=e}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c="0.2.1",d="genai-js";var u;!function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"}(u||(u={}));class h{constructor(t,e,n,s){this.model=t,this.task=e,this.apiKey=n,this.stream=s}toString(){let t=`https://generativelanguage.googleapis.com/v1/${this.model}:${this.task}`;return this.stream&&(t+="?alt=sse"),t}}async function E(t,e,n){let s;try{if(s=await fetch(t.toString(),Object.assign(Object.assign({},function(t){const e={};if((null==t?void 0:t.timeout)>=0){const n=new AbortController,s=n.signal;setTimeout((()=>n.abort()),t.timeout),e.signal=s}return e}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n)),{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-client":`${d}/${c}`,"x-goog-api-key":t.apiKey},body:e})),!s.ok){let t="";try{const e=await s.json();t=e.error.message,e.error.details&&(t+=` ${JSON.stringify(e.error.details)}`)}catch(t){}throw new Error(`[${s.status} ${s.statusText}] ${t}`)}}catch(e){const n=new r(`Error fetching from ${t.toString()}: ${e.message}`);throw n.stack=e.stack,n}return s}function l(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),_(t.candidates[0]))throw new a(`${p(t)}`,t);return function(t){var e,n,s,i;return(null===(i=null===(s=null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)||void 0===s?void 0:s[0])||void 0===i?void 0:i.text)?t.candidates[0].content.parts[0].text:""}(t)}if(t.promptFeedback)throw new a(`Text not available. ${p(t)}`,t);return""},t}const f=[i.RECITATION,i.SAFETY];function _(t){return!!t.finishReason&&f.includes(t.finishReason)}function p(t){var e,n,s;let i="";if(t.candidates&&0!==t.candidates.length||!t.promptFeedback){if(null===(s=t.candidates)||void 0===s?void 0:s[0]){const e=t.candidates[0];_(e)&&(i+=`Candidate was blocked due to ${e.finishReason}`,e.finishMessage&&(i+=`: ${e.finishMessage}`))}}else i+="Response was blocked",(null===(e=t.promptFeedback)||void 0===e?void 0:e.blockReason)&&(i+=` due to ${t.promptFeedback.blockReason}`),(null===(n=t.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(i+=`: ${t.promptFeedback.blockReasonMessage}`);return i}function g(t){return this instanceof g?(this.v=t,this):new g(t)}function O(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s,i=n.apply(t,e||[]),o=[];return s={},r("next"),r("throw"),r("return"),s[Symbol.asyncIterator]=function(){return this},s;function r(t){i[t]&&(s[t]=function(e){return new Promise((function(n,s){o.push([t,e,n,s])>1||a(t,e)}))})}function a(t,e){try{(n=i[t](e)).value instanceof g?Promise.resolve(n.value.v).then(c,d):u(o[0][2],n)}catch(t){u(o[0][3],t)}var n}function c(t){a("next",t)}function d(t){a("throw",t)}function u(t,e){t(e),o.shift(),o.length&&a(o[0][0],o[0][1])}}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const T=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function S(t){const e=function(t){const e=t.getReader();return new ReadableStream({start(t){let n="";return s();function s(){return e.read().then((({value:e,done:i})=>{if(i)return n.trim()?void t.error(new r("Failed to parse stream")):void t.close();n+=e;let o,a=n.match(T);for(;a;){try{o=JSON.parse(a[1])}catch(e){return void t.error(new r(`Error parsing JSON response: "${a[1]}"`))}t.enqueue(o),n=n.substring(a[0].length),a=n.match(T)}return s()}))}}})}(t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))),[n,s]=e.tee();return{stream:m(n),response:y(s)}}async function y(t){const e=[],n=t.getReader();for(;;){const{done:t,value:s}=await n.read();if(t)return l(C(e));e.push(s)}}function m(t){return O(this,arguments,(function*(){const e=t.getReader();for(;;){const{value:t,done:n}=yield g(e.read());if(n)break;yield yield g(l(t))}}))}function C(t){const e=t[t.length-1],n={promptFeedback:null==e?void 0:e.promptFeedback};for(const e of t)if(e.candidates)for(const t of e.candidates){const e=t.index;if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:t.index}),n.candidates[e].citationMetadata=t.citationMetadata,n.candidates[e].finishReason=t.finishReason,n.candidates[e].finishMessage=t.finishMessage,n.candidates[e].safetyRatings=t.safetyRatings,t.content&&t.content.parts){n.candidates[e].content||(n.candidates[e].content={role:t.content.role||"user",parts:[{text:""}]});for(const s of t.content.parts)s.text&&(n.candidates[e].content.parts[0].text+=s.text)}}return n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function A(t,e,n,s){const i=new h(e,u.STREAM_GENERATE_CONTENT,t,!0);return S(await E(i,JSON.stringify(n),s))}async function N(t,e,n,s){const i=new h(e,u.GENERATE_CONTENT,t,!1),o=await E(i,JSON.stringify(n),s);return{response:l(await o.json())}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R(t,e){let n=[];if("string"==typeof t)n=[{text:t}];else for(const e of t)"string"==typeof e?n.push({text:e}):n.push(e);return{role:e,parts:n}}function I(t){if(t.contents)return t;return{contents:[R(t,"user")]}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const v="SILENT_ERROR";class M{constructor(t,e,n,s){this.model=e,this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,(null==n?void 0:n.history)&&(this._history=n.history.map((t=>{if(!t.role)throw new Error("Missing role for history item: "+JSON.stringify(t));return R(t.parts,t.role)})))}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){var e,n;await this._sendPromise;const s=R(t,"user"),i={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,contents:[...this._history,s]};let o;return this._sendPromise=this._sendPromise.then((()=>N(this._apiKey,this.model,i,this.requestOptions))).then((t=>{var e;if(t.response.candidates&&t.response.candidates.length>0){this._history.push(s);const n=Object.assign({parts:[],role:"model"},null===(e=t.response.candidates)||void 0===e?void 0:e[0].content);this._history.push(n)}else{const e=p(t.response);e&&console.warn(`sendMessage() was unsuccessful. ${e}. Inspect response object for details.`)}o=t})),await this._sendPromise,o}async sendMessageStream(t){var e,n;await this._sendPromise;const s=R(t,"user"),i={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,contents:[...this._history,s]},o=A(this._apiKey,this.model,i,this.requestOptions);return this._sendPromise=this._sendPromise.then((()=>o)).catch((t=>{throw new Error(v)})).then((t=>t.response)).then((t=>{if(t.candidates&&t.candidates.length>0){this._history.push(s);const e=Object.assign({},t.candidates[0].content);e.role||(e.role="model"),this._history.push(e)}else{const e=p(t);e&&console.warn(`sendMessageStream() was unsuccessful. ${e}. Inspect response object for details.`)}})).catch((t=>{t.message!==v&&console.error(t)})),o}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class w{constructor(t,e,n){this.apiKey=t,e.model.includes("/")?this.model=e.model:this.model=`models/${e.model}`,this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.requestOptions=n||{}}async generateContent(t){const e=I(t);return N(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings},e),this.requestOptions)}async generateContentStream(t){const e=I(t);return A(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings},e),this.requestOptions)}startChat(t){return new M(this.apiKey,this.model,t,this.requestOptions)}async countTokens(t){const e=I(t);return async function(t,e,n,s){const i=new h(e,u.COUNT_TOKENS,t,!1);return(await E(i,JSON.stringify(Object.assign(Object.assign({},n),{model:e})),s)).json()}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this.apiKey,this.model,e)}async embedContent(t){const e=function(t){if("string"==typeof t||Array.isArray(t))return{content:R(t,"user")};return t}(t);return async function(t,e,n,s){const i=new h(e,u.EMBED_CONTENT,t,!1);return(await E(i,JSON.stringify(n),s)).json()}(this.apiKey,this.model,e)}async batchEmbedContents(t){return async function(t,e,n,s){const i=new h(e,u.BATCH_EMBED_CONTENTS,t,!1),o=n.requests.map((t=>Object.assign(Object.assign({},t),{model:e})));return(await E(i,JSON.stringify({requests:o}),s)).json()}(this.apiKey,this.model,t,this.requestOptions)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(t){this.apiKey=t}getGenerativeModel(t,e){if(!t.model)throw new r("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new w(this.apiKey,t,e)}}export{s as BlockReason,M as ChatSession,i as FinishReason,w as GenerativeModel,b as GoogleGenerativeAI,e as HarmBlockThreshold,t as HarmCategory,n as HarmProbability,o as TaskType};export default null;
//# sourceMappingURL=/sm/4fc5a825439cf52bc8aeb99205ef7c7894988289237bf3b1e8c7b9559c8ec320.map
