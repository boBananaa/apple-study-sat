import {DESMOS_PRACTICE} from './desmos-content.js?v=10';

const exercises=new Map(DESMOS_PRACTICE.map(p=>[p.tipId,p]));
const plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanText=(v,max)=>typeof v==='string'?v.slice(0,max):'';
const freshDraft=()=>({setup:'',answer:'',setupCommitted:false,hintUsed:false,explanationSeen:false});
export function practiceNumber(value){
 const text=String(value??'').trim().replace(/−/g,'-');
 const decimal='[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
 if(new RegExp('^'+decimal+'$').test(text))return Number(text);
 if(new RegExp('^'+decimal+'\\s*/\\s*'+decimal+'$').test(text)){
  const [a,b]=text.split('/').map(Number);return b!==0?a/b:NaN;
 }
 return NaN;
}
export function checkDesmosPractice(tipId,answer){
 const p=exercises.get(tipId);if(!p)return false;
 if(p.kind==='choice')return String(answer).trim().toUpperCase()===p.answer;
 const n=practiceNumber(answer),expected=practiceNumber(p.answer);
 return Number.isFinite(n)&&Math.abs(n-expected)<=1e-9*Math.max(1,Math.abs(expected));
}
export function getDesmosPracticeRecord(state,tipId){
 if(!exercises.has(tipId))throw Error('Unknown Desmos practice method.');
 state.studio ||= {};state.studio.desmosPractice ||= {};
 return state.studio.desmosPractice[tipId] ||= {version:1,tipId,firstAttempt:null,attempts:[],draft:freshDraft()};
}
export function submitDesmosPractice(state,tipId,now=new Date().toISOString()){
 const record=getDesmosPracticeRecord(state,tipId),p=exercises.get(tipId),d=record.draft;
 if(!d.setupCommitted||!d.setup.trim())throw Error('Write and save your setup before checking an answer.');
 if(!d.answer.trim())throw Error('Enter an answer first.');
 if(p.kind==='choice'?!/^[A-D]$/.test(d.answer):!Number.isFinite(practiceNumber(d.answer)))throw Error(p.kind==='choice'?'Choose an answer.':'Enter a number or a fraction, without units.');
 // A submitted attempt stays closed until the learner explicitly starts a retry.
 if(d.submitted)return record.attempts.at(-1)||record.firstAttempt;
 const attempt={id:p.id,tipId,source:'Original Desmos practice',setup:d.setup.trim().slice(0,4000),answer:d.answer.trim().slice(0,100),correct:checkDesmosPractice(tipId,d.answer),hintsUsed:d.hintUsed?1:0,referenceHelp:true,explanationSeen:d.explanationSeen===true,setupAssessment:'not_automatically_graded',submittedAt:now};
 if(!record.firstAttempt)record.firstAttempt=structuredClone(attempt);
 record.attempts=[...record.attempts,attempt].slice(-20);
 d.submitted=true;d.explanationSeen=true;
 return attempt;
}
export function retryDesmosPractice(state,tipId){
 const record=getDesmosPracticeRecord(state,tipId);
 if(!record.firstAttempt)return false;
 record.draft={...freshDraft(),explanationSeen:true};return true;
}

// Backups contain only known original methods, never official question records.
export function validateDesmosPractice(value){
 if(value==null)return {};
 if(!plain(value))throw Error('Invalid Desmos practice history.');
 const out={};
 for(const [tipId,row] of Object.entries(value)){
  if(!exercises.has(tipId))continue;
  if(!plain(row)||!Array.isArray(row.attempts)||row.attempts.length>20)throw Error('Invalid Desmos practice attempts.');
  const attempt=a=>{
   if(!plain(a)||typeof a.correct!=='boolean'||typeof a.submittedAt!=='string'||!Number.isFinite(Date.parse(a.submittedAt))||typeof a.setup!=='string'||!a.setup.trim()||typeof a.answer!=='string'||!a.answer.trim()||a.answer.length>100||a.setup.length>4000||![0,1].includes(a.hintsUsed))throw Error('Invalid Desmos practice attempt.');
   const exercise=exercises.get(tipId);if(exercise.kind==='choice'?!/^[A-D]$/.test(a.answer):!Number.isFinite(practiceNumber(a.answer)))throw Error('Invalid Desmos practice answer.');
   return {id:exercise.id,tipId,source:'Original Desmos practice',setup:cleanText(a.setup,4000),answer:cleanText(a.answer,100),correct:checkDesmosPractice(tipId,a.answer),hintsUsed:a.hintsUsed,referenceHelp:true,explanationSeen:a.explanationSeen===true,setupAssessment:'not_automatically_graded',submittedAt:a.submittedAt};
  };
  const firstAttempt=row.firstAttempt?attempt(row.firstAttempt):null,attempts=row.attempts.map(attempt),d=plain(row.draft)?row.draft:{};
  if(!firstAttempt&&attempts.length)throw Error('Desmos practice history is missing its first attempt.');
  const draft={setup:cleanText(d.setup,4000),answer:cleanText(d.answer,100),setupCommitted:d.setupCommitted===true&&!!cleanText(d.setup,4000).trim(),hintUsed:d.hintUsed===true,explanationSeen:!!firstAttempt||d.explanationSeen===true,submitted:!!firstAttempt&&d.submitted===true};
  out[tipId]={version:1,tipId,firstAttempt,attempts,draft};
 }
 return out;
}
export function mergeDesmosPractice(existing,incoming){
 const old=validateDesmosPractice(existing),next=validateDesmosPractice(incoming),out=structuredClone(old);
 for(const [id,row] of Object.entries(next)){
  if(!out[id]){out[id]=structuredClone(row);continue;}
  const current=out[id],seen=new Set(),attempts=[...current.attempts,...row.attempts].filter(a=>{
   const key=JSON.stringify([a.submittedAt,a.setup,a.answer]);if(seen.has(key))return false;seen.add(key);return true;
  }).sort((a,b)=>Date.parse(a.submittedAt)-Date.parse(b.submittedAt)).slice(-20);
  // Import never replaces a locally preserved first attempt or active draft.
  current.firstAttempt ||= row.firstAttempt?structuredClone(row.firstAttempt):null;
  current.attempts=attempts;
  current.draft.hintUsed ||= row.draft.hintUsed;
  current.draft.explanationSeen ||= !!current.firstAttempt||row.draft.explanationSeen;
 }
 return out;
}

export function createDesmosPractice({getState,save=()=>{}}){
 function markup(tipId){
  const p=exercises.get(tipId);if(!p)return '';
  const row=getDesmosPracticeRecord(getState(),tipId),d=row.draft,last=d.submitted?(row.attempts.at(-1)||row.firstAttempt):null;
  const choice=p.options?`<ol class="desmos-practice-choices" type="A">${p.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol>`:'';
  const answer=p.options?`<select id="dp-answer-${tipId}" data-practice-field="answer" aria-label="Your answer"><option value="">Choose an answer</option>${p.options.map((o,i)=>{const letter=String.fromCharCode(65+i);return `<option value="${letter}" ${d.answer===letter?'selected':''}>${letter}. ${esc(o)}</option>`;}).join('')}</select>`:`<input id="dp-answer-${tipId}" data-practice-field="answer" type="text" inputmode="text" autocomplete="off" maxlength="100" placeholder="Number or fraction" value="${esc(d.answer)}">`;
  return `<section class="desmos-practice" data-practice-tip="${tipId}" aria-labelledby="dp-title-${tipId}"><h3 id="dp-title-${tipId}">Original Desmos practice</h3><p class="small muted">Newly authored application · Not an official SAT question. This guided practice is saved separately from official skill mastery.</p><p class="desmos-practice-prompt">${esc(p.prompt)}</p>${choice}${last?`<div class="desmos-practice-feedback" role="status"><strong>${last.correct?'Answer correct.':'Answer needs correction.'}</strong> Correct answer: ${esc(p.answer)}${p.options?' — '+esc(p.options[p.answer.charCodeAt(0)-65]):''}.<p>${esc(p.explanation)}</p><h4>One valid setup</h4><pre><code>${p.lines.map(esc).join('\n')}</code></pre><p><strong>Recognition rule:</strong> ${esc(p.rule)}</p><p class="small muted">Your setup was saved, not automatically graded. Compare its expressions, restrictions, and requested quantity with the worked setup.</p><details><summary>Your saved setup</summary><p class="desmos-saved-setup">${esc(last.setup)}</p></details><p class="small muted">${last.hintsUsed?'Hint used. ':''}${last.explanationSeen?'Explanation had already been seen. ':''}Method notes were available. First answer: ${row.firstAttempt.correct?'correct':'incorrect'}${row.firstAttempt.hintsUsed?' with a hint':''}; preserved across retries.</p><button class="secondary" data-action="desmos-practice-retry">Try again after review</button></div>`:`<label for="dp-setup-${tipId}"><strong>1. Plan your setup</strong><span class="small muted">${esc(p.setupPrompt)}</span></label><textarea id="dp-setup-${tipId}" data-practice-field="setup" rows="3" maxlength="4000" placeholder="I will enter… and read…">${esc(d.setup)}</textarea><div class="desmos-practice-actions"><button class="secondary" data-action="desmos-practice-setup">${d.setupCommitted?'Setup saved':'Save setup and continue'}</button><button class="secondary" data-action="desmos-practice-hint" ${d.hintUsed?'disabled':''}>${d.hintUsed?'Hint shown':'Small hint'}</button></div>${d.hintUsed?`<p class="desmos-practice-hint" role="status">${esc(p.hint)}</p>`:''}${d.setupCommitted?`<label for="dp-answer-${tipId}"><strong>2. Calculate and answer</strong></label>${answer}<button data-action="desmos-practice-check">Check answer</button><p class="small muted">Checking saves this attempt and opens the explanation.${d.explanationSeen?' You have already seen this exercise’s explanation.':''}</p>`:'<p class="small muted">Save your setup to unlock the answer field.</p>'}`}<p class="desmos-practice-error" role="alert"></p></section>`;
 }
 function redraw(id){const el=document.querySelector(`[data-practice-tip="${id}"]`);if(el)el.outerHTML=markup(id);}
 function click(action,target){
  if(!action?.startsWith('desmos-practice-'))return false;
  const container=target.closest('[data-practice-tip]'),id=container?.dataset.practiceTip;if(!exercises.has(id))return false;
  const row=getDesmosPracticeRecord(getState(),id),d=row.draft;
  try{
   if(action==='desmos-practice-setup'){if(!d.setup.trim())throw Error('Write the expressions and requested quantity before continuing.');d.setupCommitted=true;}
   else if(action==='desmos-practice-hint')d.hintUsed=true;
   else if(action==='desmos-practice-check')submitDesmosPractice(getState(),id);
   else if(action==='desmos-practice-retry')retryDesmosPractice(getState(),id);
   else return false;
   save();redraw(id);
   if(action==='desmos-practice-setup')document.getElementById('dp-answer-'+id)?.focus();
   if(action==='desmos-practice-check'){const result=document.querySelector(`[data-practice-tip="${id}"] .desmos-practice-feedback`);result?.setAttribute('tabindex','-1');result?.focus();}
  }catch(error){const message=container.querySelector('.desmos-practice-error');if(message)message.textContent=error.message;}
  return true;
 }
 function input(event){
  const field=event.target.dataset?.practiceField;if(!['setup','answer'].includes(field))return false;
  const id=event.target.closest('[data-practice-tip]')?.dataset.practiceTip;if(!exercises.has(id))return false;
  const d=getDesmosPracticeRecord(getState(),id).draft;if(d.submitted)return true;
  d[field]=event.target.value.slice(0,field==='setup'?4000:100);save();return true;
 }
 return {markup,click,input};
}
