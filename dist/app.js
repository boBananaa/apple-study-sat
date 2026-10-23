import {createPathController} from './path-controller.js?v=9';
import {CONFIDENCE,initializeLearning,markExposure,scheduleRetention,newCorrection,retryCorrection,confidenceSummary,retentionSummary,freshRetentionQuestions,finishRetention,validateLearningRecords,mergeLearningSessions} from './learning-logic.js?v=9';
import {confidenceMarkup,correctionMarkup,retentionMarkup,calibrationMarkup} from './learning-ui.js?v=9';
import {addDesmosAssistance,desmosAssistanceCount} from './desmos-matching.js?v=9';
import {createStudio} from './studio.js?v=9';
import {initializeStudio,examTaken,importStudio,mergeStudio,recordReview} from './studio-logic.js?v=9';
import {seedDiagnostics,normalizeDiagnostic,normalizeRoutine} from './planner.js?v=9';
import {createPlanner} from './planner-ui.js?v=9';
import {gradeAnswer,checkSetup,stableSession,usedIds,advanceSession} from './logic.js?v=9';

const KEY='sat-studio-v1';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={plan:'<path d="M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h3M8 17h7"/>',practice:'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h4"/>',bank:'<path d="M3 4h7v7H3zM14 4h7v7h-7zM3 15h7v7H3zM14 15h7v7h-7z"/>',progress:'<path d="M4 20h17M7 16v-5M12 16V6M17 16V2"/>',coach:'<path d="M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3zM9 21h6M9 17h6"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]}</svg>`;
const guided={};
const skillTips={
  'Equivalent Expressions':{intro:'Look for a common factor, a familiar identity, or a change in form. Decide what would make the expressions easy to compare.',hints:['Which operation would simplify the structure: factoring, expanding, or combining like terms?','A convenient input can eliminate choices. Use algebra to verify the remaining expression.'],rule:'Compare structure before expanding everything. Any rewriting must preserve the original value and restrictions.'},
  'Area and Volume':{intro:'Sketch the shape and label the given measurements. Keep linear, square, and cubic units distinct.',hints:['Does the question ask for a length, an area, or a volume?','Check whether a given measurement is a radius or a diameter, then choose the relevant formula.'],rule:'Write the formula with labeled dimensions before substituting. A scale factor k changes area by k² and volume by k³.'},
  'Systems of Linear Equations':{intro:'Define your variables with units. Write one equation for each independent relationship.',hints:['What two quantities are unknown, and what two facts connect them?','Separate a total count from a weighted total, such as total cost or capacity.'],rule:'Each equation must compare quantities with the same units. After solving, check which coordinate or expression is requested.'},
  'Linear Functions':{intro:'Identify the rate of change and the starting value. Decide what each coordinate represents.',hints:['What changes when the input increases by one?','For an x-intercept set y = 0; for a y-intercept set x = 0.'],rule:'In y = mx + b, m is output units per input unit and b is the output when the input is zero.'},
  'Percentages':{intro:'Identify the base amount: the number the percentage is taken of.',hints:['What amount represents 100% in this step?','For an increase use 1 + rate; for a decrease use 1 − rate. Apply successive multipliers in order.'],rule:'Translate the percentage into a decimal multiplier and keep track of whether the base amount changes.'},
  'Ratios, Rates, Proportions, and Units':{intro:'Write units beside every number. Arrange conversion factors so unwanted units cancel.',hints:['What units must the final answer have?','Write the rate as a fraction and check which quantity belongs in the denominator.'],rule:'Follow the units through every operation. A unit rate is an amount per one unit of another quantity.'},
  'Nonlinear Equations and Systems':{intro:'Notice powers, roots, or absolute values before choosing algebra or a graph. Keep the original equation for checking.',hints:['Can the equation be factored or isolated before using a longer method?','If an operation can introduce extra solutions, substitute candidates into the original equation.'],rule:'Desmos intersections can identify candidates. Check restrictions, extraneous solutions, and the exact quantity requested.'},
  'Nonlinear Functions':{intro:'Identify what the input and output mean. Check whether the question asks for an intercept, a maximum, or a rate of growth.',hints:['Which part of the function determines the feature the question asks for?','In exponential models, the initial amount and the growth multiplier play different roles.'],rule:'Choose a representation that exposes the requested feature: factored form for zeros, vertex form for a vertex, or a graph for intersections.'},
  'Central Ideas and Details':{intro:'Separate the main claim from the examples supporting it. Predict the answer in your own words before comparing choices.',hints:['What is the passage mainly trying to tell you?','Choose a statement supported by the whole relevant text. Avoid a choice that overstates its claim.'],rule:'Match the scope and strength of the text. A true detail is not always the central idea.'},
  'Inferences':{intro:'Find what the text supports even if it does not state it directly. Keep the inference as small as the evidence allows.',hints:['Which facts in the passage constrain what the answer can say?','Eliminate a choice that needs an extra assumption or outside knowledge.'],rule:'An inference must follow from the supplied evidence. Preserve qualifiers such as may, some, and often.'},
  'Command of Evidence':{intro:'Identify the exact claim being tested, then find evidence that changes how strongly that claim is supported.',hints:['What specific relationship would support or weaken the claim?','For a graph or table, check the axes, units, comparison groups, and direction of the result.'],rule:'Match evidence to the precise claim, not merely the general topic. Check every meaningful qualifier.'},
  'Words in Context':{intro:'Make a plain-language prediction from the context, then verify the definition of the answer choice.',hints:['What simple word would make the sentence fit its surrounding clues?','Check contrast or cause-and-effect signals, and preserve the strength of the intended meaning.'],rule:'Predict first. Then define the plausible choices; a related word with the wrong meaning or degree is still wrong.'},
  'Transitions':{intro:'Describe the relationship between the ideas before looking for a transition.',hints:['Does the second idea add, contrast, explain, exemplify, or follow as a result?','An example must illustrate the exact claim before it. Sharing a topic is not enough.'],rule:'Compress the two ideas into a relationship. Choose the transition that expresses that relationship precisely.'},
  'Text Structure and Purpose':{intro:'Describe what the passage or underlined part does with a neutral verb and object.',hints:['Does this part introduce, illustrate, challenge, qualify, or explain a claim?','Check the purpose verb and every qualifier in each answer.'],rule:'One unsupported purpose verb or description can invalidate an otherwise plausible choice.'},
  'Cross-Text Connections':{intro:'Summarize each author’s claim separately, then compare the exact point the question asks about.',hints:['What position does each text take on the specific issue?','Check that the answer accurately represents both texts, not just one.'],rule:'Anchor the comparison in both passages. Shared subject matter alone does not establish agreement.'},
  'Boundaries':{intro:'Locate the subject and main verb in each clause before choosing punctuation.',hints:['Can the material on each side stand as a complete sentence?','Check whether the punctuation joins two independent clauses, introduces an explanation, or encloses extra information.'],rule:'Classify the clauses first. A comma alone cannot join two independent clauses; a colon normally follows a complete clause.'},
  'Form, Structure, and Sense':{intro:'Identify the grammatical job of the missing piece. Check agreement, verb form, and what any modifier describes.',hints:['What word controls the agreement or form of the blank?','Ignore interrupting phrases, then read the core sentence to check its grammar and meaning.'],rule:'Match the actual subject and verb, keep parallel forms parallel, and place modifiers next to what they describe.'},
  'Rhetorical Synthesis':{intro:'Read the stated writing goal first. Use only notes that help accomplish that goal.',hints:['Does the goal ask for a comparison, an introduction, an example, or a generalization?','A choice can contain accurate facts and still fail to accomplish the requested goal.'],rule:'The goal determines which notes matter. Verify that the answer does the requested rhetorical job.'}
};
const generic={intro:'Read the final question first. Name the unknown, attach units, and choose a relationship before calculating.',hints:['What exact quantity should your final answer represent?','Which given fact connects that quantity to something you already know?'],rule:'Write a model, solve it, and substitute or check units before submitting.'};
let data,bank,state,view,filter={search:'',skill:'all',difficulty:'all',page:0},toastTimer,storageOK=true;
const planner=createPlanner({getState:()=>state,getData:()=>data,getProfile:()=>profile(),save,render,toast,openProfile,history:()=>planningHistory(),start(day){
  state.section=day.section;
  if(day.existingId){state.activeId=day.existingId;save();location.hash='practice';render();window.scrollTo({top:0});return;}
  newSession(day.questionIds,'routine',day.timed,{planDate:day.date,planSkills:day.skills,planMinutes:day.minutes,planReviewMinutes:day.reviewMinutes,planBreakMinutes:day.breakMinutes});
}});
const studio=createStudio({returnToPath:()=>path.returnLink(),retentionPanel:()=>retentionMarkup(learningRetention()),calibrationPanel:()=>calibrationMarkup({...confidenceSummary(state.sessions,state.section),total:sectionSessions().filter(s=>s.type!=='assessment').flatMap(s=>s.records).length}),expose:id=>{if(markExposure(state.studio,id))save();},getState:()=>state,getData:()=>data,getProfile:()=>profile(),save,render,toast,history:()=>priorHistory(),currentQuestion:()=>current(),grade:gradeAnswer,canHard:()=>readyHard(),questionText:id=>guided[id]?.text?.replace(/<[^>]*>/g,' ')||'',onDesmosTip:(questionId,tipId)=>{if(view!=='practice'||current()?.id!==questionId||recordForQuestion())return false;const added=addDesmosAssistance(draft(),tipId);if(added)save();return added;},startPractice:(ids,type)=>newSession(ids,type)});
const path=createPathController({getState:()=>state,getData:()=>data,getProfile:()=>profile(),save,render,toast,history:()=>priorHistory(),studio,startRetention:startRetentionCheck,startPractice:newSession});
const reading=()=>state.section==='Reading and Writing';
const sectionSessions=()=>state.sessions.filter(s=>s.section===state.section);
const records=()=>sectionSessions().flatMap(s=>s.records);
const active=()=>state.sessions.find(s=>s.id===state.activeId&&s.type!=='assessment');
const priorHistory=()=>[...new Map([...data.history,...(state.importedHistory||[])].map(r=>[r.questionId,r])).values()];
const used=()=>examTaken(state,priorHistory());
const planningHistory=()=>[...priorHistory(),...[...used()].map(questionId=>({questionId}))];
const learningRetention=()=>retentionSummary(state.studio,data.questions,used(),state.section);
function startRetentionCheck(key){
 const entry=initializeLearning(state.studio).retention[key];if(!entry||entry.section!==state.section)return;
 const summary=learningRetention().items.find(x=>x.id===key);
 if(summary?.status!=='due')return toast('This check needs three fresh questions and must be due before it can start.');
 const ids=freshRetentionQuestions(state.studio,data.questions,used(),entry).map(q=>q.id);
 if(ids.length<3)return toast('Add more questions for this skill. Delayed checks never reuse earlier questions.');
 return newSession(ids,'retention',false,{retentionKey:key,retentionDue:entry.due});
}
const readyHard=()=>sectionSessions().some(stableSession);
const readyTimed=()=>sectionSessions().filter(stableSession).length>=2;
const pct=(c,n)=>n?Math.round(100*c/n)+'%':'—';


function profile(){return state?.profile||data.goal||{};}
function profileDate(){const date=profile().testDate;return date?new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):'Add a test date';}
function openProfile(){
 const p=profile();
 $('#modal').innerHTML=`<div class="dialog-header"><h2>Your study profile</h2><button class="secondary" data-action="close-modal" type="button">Close</button></div><p class="muted">Your profile is saved in this browser. Import a profile or tutoring history file to bring in your own information.</p><form id="profile-form"><div class="profile-fields"><label>Reading and Writing score<input name="readingWriting" type="number" min="200" max="800" step="10" value="${p.readingWriting||''}" placeholder="Optional"></label><label>Math score<input name="math" type="number" min="200" max="800" step="10" value="${p.math||''}" placeholder="Optional"></label><label>Overall target<input name="total" type="number" min="400" max="1600" step="10" value="${p.total||''}" placeholder="Optional"></label><label>Next SAT date<input name="testDate" type="date" value="${esc(p.testDate||'')}"></label></div><button class="primary" type="submit">Save profile</button><label class="secondary import-label" style="margin-left:8px">Import profile JSON<input id="profile-import" type="file" accept="application/json,.json"></label></form>`;
 $('#modal').showModal();
}
function saveProfile(form){
 const fields=new FormData(form),math=fields.get('math')?Number(fields.get('math')):null,readingWriting=fields.get('readingWriting')?Number(fields.get('readingWriting')):null;
 state.profile={math,readingWriting,baseline:math&&readingWriting?math+readingWriting:null,total:fields.get('total')?Number(fields.get('total')):null,testDate:fields.get('testDate')||null};
 save();$('#modal').close();render();toast('Study profile saved in this browser.');
}
async function importProfile(file){
 if(!file)return;
 try{
  if(file.size>5000000)throw Error('Choose a profile smaller than 5 MB.');
  const incoming=JSON.parse(await file.text()),goal=incoming.goal||incoming;
  const base=goal.reported_baseline||goal.prepared_baseline||(goal.baseline&&typeof goal.baseline==='object'?goal.baseline:goal);
  const value=(v,min,max)=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw Error('A score or target is outside the SAT score range.');return n;};
  const math=value(base.math,200,800),rw=value(base.reading_and_writing??base.readingWriting,200,800),target=value(goal.target?.total??goal.total,400,1600);
  const date=goal.test_date||goal.testDate||null;
  if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Use YYYY-MM-DD for the test date.');
  state.profile={math,readingWriting:rw,baseline:math&&rw?math+rw:null,total:target,testDate:date};
  const imported=[];
  for(const session of [incoming.diagnostic,...(incoming.targeted_sessions||[])].filter(Boolean)){
   for(const r of session.responses||[]){const q=bank.get(r.question_id);if(q)imported.push({questionId:q.id,section:q.section,skill:q.skill,correct:!!r.correct,assistance:r.assisted?'hinted':'unknown',answer:r.selected_answer,source:'Imported tutoring history'});}
  }
  state.importedHistory=[...(state.importedHistory||[]),...imported];save();$('#modal').close();render();toast('Profile imported'+(imported.length?' with '+imported.length+' earlier attempts.':'.'));
 }catch(error){toast(error.message||'This profile file could not be read.');}
}

function stopwatchElapsed(){const w=state?.stopwatch||{elapsed:0,runningSince:null};return w.elapsed+(w.runningSince?Math.max(0,Date.now()-w.runningSince):0);}
function formatWatch(ms){const total=Math.floor(ms/1000),seconds=String(total%60).padStart(2,'0'),minutes=Math.floor(total/60);return minutes>=60?Math.floor(minutes/60)+':'+String(minutes%60).padStart(2,'0')+':'+seconds:String(minutes).padStart(2,'0')+':'+seconds;}
function stopwatchMarkup(){return `<section class="stopwatch" aria-label="Stopwatch"><span class="watch-caption">Stopwatch</span><output id="stopwatch-time" aria-label="Elapsed stopwatch time">${formatWatch(stopwatchElapsed())}</output><button class="watch-toggle" data-action="watch-toggle">${state.stopwatch.runningSince?'Pause':'Start'}</button><button class="watch-reset" data-action="watch-reset" aria-label="Reset stopwatch">Reset</button></section>`;}
function switchSection(section){
  state.section=section==='Reading and Writing'?'Reading and Writing':'Math';
  filter={search:'',skill:'all',difficulty:'all',page:0};
  const matching=state.sessions.filter(s=>s.section===state.section&&s.type!=='assessment');
  const chosen=matching.find(s=>!s.completed)||matching.at(-1);
  if(chosen){state.activeId=chosen.id;save();render();}
  else {state.activeId=null;save();if(view==='practice')newSession(reading()?data.readingFoundationIds:data.foundationIds,'foundation');else render();}
}

function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;}}
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').style.display='block';toastTimer=setTimeout(()=>$('#toast').style.display='none',4200);}
function newSession(ids,type='custom',timed=false,meta={}){
  const available=ids.filter(id=>bank.has(id)&&!used().has(id));
  if(!available.length){toast(data.questions.some(q=>q.section===state.section)?'No fresh questions are available. Finish a paused set or load more questions.':'Load a question library to start question practice. Lessons and vocabulary are available now.');if(!data.questions.some(q=>q.section===state.section)){location.hash='practice';render();}return;}
  const session={id:crypto.randomUUID(),section:state.section,type,questionIds:available,index:0,records:[],drafts:{},timed,completed:false,createdAt:new Date().toISOString()};
  Object.assign(session,meta);state.sessions.push(session);state.activeId=session.id;save();location.hash='practice';render();window.scrollTo({top:0});return session;
}
function startFoundation(){
 const ids=(reading()?data.readingFoundationIds:data.foundationIds).filter(id=>bank.has(id)&&!used().has(id));
 const skills=new Set(ids.map(id=>bank.get(id).skill));
 const extra=data.questions.filter(q=>q.section===state.section&&q.difficulty==='Medium'&&!used().has(q.id)&&!ids.includes(q.id)).sort((a,b)=>Number(skills.has(a.skill))-Number(skills.has(b.skill)));
 for(const q of extra){if(ids.length>=5)break;ids.push(q.id);skills.add(q.skill);}
 return newSession(ids.slice(0,5),'foundation');
}
function current(){const s=active();return s&&!s.completed?bank.get(s.questionIds[s.index]):null;}
function draft(){const s=active(),q=current();if(!q)return{};if(!s.drafts[q.id])s.drafts[q.id]={setup:'',answer:'',quantity:false,hints:0,confidence:'',activeSeconds:0,startedAt:Date.now()};return s.drafts[q.id];}
function recordForQuestion(){const q=current();return active()?.records.find(r=>r.questionId===q?.id);}
function shell(content){
 const groups=[
  {id:'home',name:'Home',icon:'coach',pages:['home','learn']},
  {id:'practice-hub',name:'Practice',icon:'practice',pages:['practice-hub','practice','bank','review','lessons','tests','vocab','challenge','desmos']},
  {id:'analysis',name:'Analysis',icon:'progress',pages:['analysis','analytics','progress','achievements']},
  {id:'settings',name:'Settings',icon:'plan',pages:['settings','plan']}
 ];
 const group=groups.find(g=>g.pages.includes(view))||groups[0];
 const labels={practice:'Current session',bank:'Question bank',review:'Review',lessons:'Lessons',tests:'Assessments',vocab:'Vocabulary',challenge:'Desmos week',desmos:'Desmos guides',progress:'History',achievements:'Milestones'};
 const tab=labels[view];
 return `<div class="app-shell streamlined view-${view}"><aside class="rail"><div class="brand"><div class="brand-mark" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 10C10 5 3 10 5 18c1 5 4 10 8 9 2-1 4-1 6 0 4 1 7-4 8-9 2-8-5-13-11-8Z"/><path d="M16 10c0-4-2-6-4-7m4 4c5 0 8-2 8-5-5 0-8 2-8 5Z"/></svg></div><div><span class="brand-name">Apple Study: SAT</span><small>Your personal study room</small></div></div><nav aria-label="Main navigation">${groups.map(g=>`<a href="#${g.id}" class="nav-link ${group.id===g.id?'active':''}" ${group.id===g.id?'aria-current="page"':''}>${icon(g.icon)}${g.name}</a>`).join('')}</nav></aside><main class="workspace"><div class="topbar"><span class="breadcrumb">${esc(group.name)}${tab?' / '+esc(tab):''}</span><div class="top-actions">${group.id==='practice-hub'||group.id==='analysis'?`<label class="section-picker"><span class="sr-only">SAT section</span><select id="section-picker"><option value="Math" ${!reading()?'selected':''}>Math</option><option value="Reading and Writing" ${reading()?'selected':''}>Reading &amp; Writing</option></select></label>`:''}${group.id==='practice-hub'&&view!=='practice-hub'?'<a class="text-button" href="#practice-hub">Back to Practice</a>':''}</div></div>${group.id==='analysis'?'<nav class="section-tabs" aria-label="Analysis views"><a href="#analysis">Overview</a><a href="#progress">History</a><a href="#achievements">Milestones</a></nav>':''}${state.studio.focus?'<div class="focus-banner"><span>Focus session</span><button class="secondary" data-action="focus-toggle">Exit focus</button></div>':''}${!storageOK?'<p class="storage-warning">Progress cannot be saved in this browser. Export before closing.</p>':''}${content}<details class="footer-note"><summary>Sources &amp; saved progress</summary><p>Official questions have PDF citations. Lessons and vocabulary are original study material. Progress stays in this browser; use Settings to export a backup.</p></details></main></div>${stopwatchMarkup()}`;
}
function header(title,subtitle,action=''){return `<div class="page-title"><div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;}
function source(q){return `<details class="source"><summary>Official source · ${esc(q.file)} · page ${q.page}</summary><dl><dt>File</dt><dd>${esc(q.file)}</dd><dt>Page</dt><dd>${q.page}</dd><dt>Question</dt><dd>${esc(q.number)}</dd><dt>ID</dt><dd>${esc(q.id)}</dd></dl><p style="margin-top:8px">Verified against your PDF collection.</p></details>`;}
function renderPractice(){
  const s=active();
  if(s&&!s.completed){
    const takenElsewhere=new Set([...priorHistory().map(r=>r.questionId),...state.sessions.filter(other=>other.id!==s.id).flatMap(other=>other.records.map(r=>r.questionId))]);
    let changed=false;
    while(s.index<s.questionIds.length&&takenElsewhere.has(s.questionIds[s.index])&&!s.records.some(r=>r.questionId===s.questionIds[s.index])){s.questionIds.splice(s.index,1);changed=true;}
    if(s.index>=s.questionIds.length){s.completed=true;changed=true;}
    if(changed)save();
  }
  if(!data.questions.some(q=>q.section===state.section))return header('Make this your practice room.','Add your study profile, then load a question library using the repository importer.')+`<div class="summary-panel"><h2>Start with your own information.</h2><p>Your scores, goal, and test date can be entered here or imported from a JSON profile. They stay in this browser.</p><div class="summary-actions"><button class="primary" data-action="profile">Set up your profile</button><a class="secondary" href="setup.html">Load a question library</a></div></div>`;
  if(!s)return header('Ready when you are.','Begin with five medium questions and clear reasoning for each answer.')+`<div class="empty question-sheet"><h2>A foundation for your next step.</h2><p>Untimed. One question at a time. Hints when you need them.</p><button class="primary" data-action="foundation">Start foundation check</button></div>`;
  if(s.completed)return summary(s);
  const q=current(),g=guided[q.id],d=draft(),result=recordForQuestion(),tips=g||skillTips[q.skill]||generic;
  if(markExposure(state.studio,q.id))save();
  const number=s.index+1,foundation=s.type==='foundation';
  return path.returnLink()+'<div class="practice-session-head"><h1>Practice</h1>'+studio.tools(q)+'</div>'+(s.type==='retention'?'<p class="retention-session-note">Delayed check: 3 fresh questions, untimed. Target: 3 independently correct answers with valid reasoning. Hints count as assistance; guessed answers do not pass this check.</p>':'')+(s.type==='routine'?`<div class="routine-context"><strong>Routine session · ${esc((s.planSkills||[]).join(', '))}</strong><p>${s.planMinutes} minutes planned, including ${s.planReviewMinutes} minutes to review missed and hinted answers${s.planBreakMinutes?' and a '+s.planBreakMinutes+'-minute break':''}. Finish this set to update your future plan.</p><a href="#plan">View study plan</a></div>`:'')+`<section class="set-overview" aria-label="Current set"><div class="overview-name"><strong>${s.type==='retention'?'Delayed skill check':foundation?(reading()?'Reading and Writing check':'Math foundation check'):s.questionIds.length===1?'Focused practice':'Focused '+esc(state.section)+' set'}</strong><div class="set-path" aria-label="Question ${number} of ${s.questionIds.length}">${s.questionIds.map((id,i)=>{const r=s.records.find(r=>r.questionId===id);return `<span class="set-step ${i===s.index?'current':r?(r.correct?'done':'wrong'):''}"></span>`;}).join('')}</div></div><div><small>Questions</small><strong>${number} of ${s.questionIds.length}</strong></div><div><small>Pace</small><strong>${s.timed?'Timed':'Untimed'}</strong></div><div><small>Est. time</small><strong>${foundation?'12–18 min':Math.ceil(s.questionIds.length*2)+'–'+s.questionIds.length*3+' min'}</strong></div><div><small>Target accuracy</small><strong>${s.type==='retention'?'3 of 3 independent':foundation?Math.ceil(.8*s.questionIds.length)+' of '+s.questionIds.length+' unassisted':'80% or better'}</strong></div><p class="set-skills"><strong>Skills:</strong> ${[...new Set(s.questionIds.map(id=>bank.get(id)?.skill).filter(Boolean))].map(esc).join(', ')}</p></section><div class="practice-layout"><article class="question-sheet"><div class="question-header"><div><small>Question ${number}</small><strong>${esc(g?.exact||q.skill)}</strong></div><span class="pill ${q.difficulty.toLowerCase()}">${esc(q.difficulty)}</span></div><div class="question-body">${g?`<div class="question-text">${g.text}</div>`:`<img class="bank-image" src="${q.image}" alt="Official ${esc(q.skill)} question ${esc(q.number)}, ID ${q.id}"><button class="expand-image" data-action="image">Open a larger view</button>`}${!result?`<button class="text-button inline-hint" data-action="hint" type="button">Need a small hint?</button><form id="answer-form"><div class="form-part"><label class="step-label" for="setup"><span>1</span>${reading()?'Write your reasoning':'Write your setup'}</label><textarea id="setup" name="setup" placeholder="${reading()?'Your prediction, evidence, or grammar rule…':'Your equation or expression…'}" required>${esc(d.setup)}</textarea><p class="field-note">${esc(g?.setupHelp||(reading()?'State the evidence or rule that supports your choice. Your reasoning will be saved for review.':'Include your variable definitions or units. This setup will be saved for review.'))}</p></div><div class="form-part"><div class="step-label"><span>2</span><span style="width:auto;height:auto;background:none;color:inherit;font:inherit">Choose your answer</span></div>${renderAnswer(q,g,d)}</div><label class="quantity-check"><input type="checkbox" name="quantity" ${d.quantity?'checked':''} required><span>${reading()?'I checked that my choice answers the exact question and fits the text.':'I checked that my answer gives the quantity requested.'}</span></label>${confidenceMarkup(d.confidence,{required:true})}<p class="field-note">Confidence and active study time are saved with your first answer. Hints remain available.</p><p id="form-error" class="form-error" role="alert"></p><div class="form-actions"><button class="primary" type="submit">Check my answer</button><span class="timer">${s.timed?'<span id="timer">0:00</span> / '+(q.difficulty==='Hard'?'2:00':'1:30'):'Untimed practice. Stopwatch optional.'}</span></div></form>`:`<p class="small muted">${reading()?'Your reasoning':'Your setup'}: ${esc(result.setup||'Solution revealed before a setup was entered.')}</p>`}</div>${result?feedback(q,g,result):''}${source(q)}</article><details class="practice-help" ${d.hints?'open':''}><summary>Hints &amp; guidance</summary><div class="coach"><div class="coach-symbol">${icon('coach')}Your coach</div><h3>${esc(g?.coach||(reading()?'Find the evidence, then choose.':'Start with the relationship.'))}</h3><p>${esc(tips.intro)}</p>${!result?`${Array.from({length:d.hints},(_,i)=>`<div class="hint"><small>Hint ${i+1}</small>${esc(tips.hints[i])}</div>`).join('')}<button class="secondary" data-action="hint" ${d.hints>=tips.hints.length?'disabled':''}>${d.hints?'Get another hint':'Get a small hint'}</button>${d.hints?'<button class="text-button" data-action="reveal">Reveal the solution</button>':''}<p class="small">Hints are tracked separately from independent answers.</p>`:`<div class="method-rule"><strong class="small">Recognition rule</strong><p>${esc(!result.correct&&!result.revealed&&!['complete','revealed'].includes(result.correction?.stage)?'Try the small hint in the correction panel first.':g?.rule||tips.rule)}</p></div>`}</div><div class="coach-bottom"><strong>What this set checks</strong><p>${foundation?(reading()?'Main ideas, inferences, evidence, transitions, and words in context.':'Fixed and variable costs, part-whole equations, intercepts, successive percentage decreases, and the final quantity.'):esc(q.skill)+'. Your reasoning and answer are saved separately.'}</p>${!reading()?'<a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer">Open Desmos calculator ↗</a>':'<p>Read every meaningful word in the answer choice before selecting it.</p>'}</div></details></div>`;
}
function renderAnswer(q,g,d){
  const mc=/^[A-D]$/.test(q.answer);
  if(mc)return `<fieldset style="border:0;padding:0;margin:0"><legend class="small muted" style="margin-bottom:9px">Select one answer.</legend><div class="choices">${['A','B','C','D'].map((letter,i)=>`<label class="choice"><input type="radio" name="answer" value="${letter}" ${d.answer===letter?'checked':''} required><span class="letter">${letter}</span><span>${esc(g?.choices?.[i]||'Choice '+letter+' above')}</span></label>`).join('')}</div></fieldset>`;
  return `<label for="numeric-answer" class="small muted">A number, decimal, or fraction</label><input id="numeric-answer" name="answer" type="text" inputmode="text" autocomplete="off" placeholder="Enter your answer" value="${esc(d.answer)}" required style="margin-top:8px">`;
}
function feedback(q,g,r){
  const tips=g||skillTips[q.skill]||generic;
  if((!r.correct||r.setupCorrect===false)&&!r.revealed){
   r.correction ||= newCorrection(r);
   return correctionMarkup({question:q,record:r,correction:r.correction,hint:tips.hints?.[0]||generic.hints[0],error:r.correction.error||'',solutionHtml:correctionSolution(q,g,tips,r),continueLabel:active().index===active().questionIds.length-1?'Finish this set':'Next question'});
  }
  const title=r.revealed?'Solution revealed':r.correct?'Correct.':'Let’s fix this one.';
  const assistance=r.revealed?'Revealed':r.hintsUsed?'With a hint':'Unassisted answer';
  const model=g?`<p class="method-title">A valid setup</p><p class="equation" style="text-align:left;font-size:19px">${esc(g.model)}</p><p>${esc(g.method)}</p><p><strong>Trap to watch:</strong> ${esc(g.trap)}</p><p><strong>Desmos:</strong> ${esc(g.desmos)}</p>`:`<p>Correct answer: <strong>${esc(q.answer)}</strong>.</p><p>${esc(tips.rule)}</p>${q.key?`${q.key.rationale?'<details class="official-rationale"><summary>Read the official explanation</summary><p>'+esc(q.key.rationale)+'</p></details>':''}<p><a class="secondary" href="${esc(q.key.url)}" target="_blank" rel="noopener noreferrer">Read the official worked solution ↗</a></p><p class="small muted">${esc(q.key.file)}, page ${q.key.page}; ID ${q.id} verified in that answer key.</p>`:'<p class="small muted">A detailed worked solution is not available for this item in the linked answer-key files. Your setup is saved for tutor review.</p>'}`;
  return `<section class="feedback ${!r.correct?'incorrect':''}" aria-live="polite"><div class="result-title"><h3>${title}</h3><span class="result-badge ${r.hintsUsed?'hinted':''}">${assistance}</span></div>${g?`<p>Answer: <strong>${esc(q.answer)}</strong>. ${r.revealed?'This is recorded as revealed, rather than independently solved.':r.setupCorrect?'Your setup also checks out.':'Your setup needs another look, even if the answer is correct.'}</p>`:''}${model}${!g&&!r.revealed?`<div class="review-setup"><p><strong>${reading()?'Check your reasoning against the explanation.':'Check your setup against the solution.'}</strong></p><p class="small muted">This is your self-check; it is not an automatic assessment.</p>${r.setupCorrect===null?'<button class="secondary" data-action="setup-yes">My approach matched</button><button class="text-button" data-action="setup-no">Needs work / unsure</button>':`<p class="small">${r.setupCorrect?'You marked the reasoning or setup as correct.':'Reasoning or setup marked for review.'}</p>`}</div>`:''}<button class="primary" data-action="next" ${!g&&r.setupCorrect===null&&!r.revealed?'disabled':''}>${active().index===active().questionIds.length-1?'Finish this set':'Next question'}</button></section>`;
}

function correctionSolution(q,g,tips,r){
 if(!['complete','revealed'].includes(r.correction?.stage))return '';
 const attempt=r.correction.attempts.at(-1);
 return `<p>Answer: <strong>${esc(q.answer)}</strong>.</p>${g?`<p><strong>A valid setup:</strong> ${esc(g.model)}</p><p>${esc(g.method)}</p><p><strong>Trap:</strong> ${esc(g.trap)}</p><p><strong>Desmos:</strong> ${esc(g.desmos)}</p>`:`<p><strong>Recognition rule:</strong> ${esc(tips.rule)}</p>${q.key?.rationale?'<p>'+esc(q.key.rationale)+'</p>':''}${q.key?`<p><a href="${esc(q.key.url)}" target="_blank" rel="noopener noreferrer">Read the official worked solution</a> · ${esc(q.key.file)}, page ${q.key.page}, ID ${esc(q.id)}</p>`:'<p>No detailed worked solution is supplied for this item. Use the skill lesson to compare the method; your explanation is not automatically graded.</p>'}`}${attempt?`<p class="small muted">Your corrected answer matched the key. Check your reasoning against the supplied explanation; matching the answer alone does not verify the approach.</p>`:''}`;
}
function saveCorrectionDraft(form){const r=recordForQuestion();if(!r?.correction)return;const f=new FormData(form);r.correction.draft=Object.fromEntries(['correctedSetup','retryAnswer','recognitionRule','errorType','methodChoice'].map(k=>[k,String(f.get(k)||'').slice(0,k==='retryAnswer'?100:4000)]));save();}
function submitCorrection(form){
 const r=recordForQuestion(),q=current();if(!r?.correction||!q)return;
 saveCorrectionDraft(form);const f=new FormData(form);
 try{const attempt=retryCorrection(r,q,{setup:f.get('correctedSetup'),answer:f.get('retryAnswer'),rule:f.get('recognitionRule'),errorType:f.get('errorType'),method:f.get('methodChoice')});if(attempt.correct)recordReview(state.studio,q.id,{correct:true,setup:attempt.setup,rule:attempt.rule,errorType:attempt.errorType,hinted:true});save();render();document.querySelector('.learning-correction')?.scrollIntoView({block:'nearest'});}catch(error){toast(error.message);}
}

function summary(s){
  const correct=s.records.filter(r=>r.correct).length,independent=s.records.filter(r=>r.correct&&!r.hintsUsed&&!r.revealed).length,valid=s.records.filter(r=>r.setupCorrect===true).length;
  const stable=stableSession(s);
  const retentionResult=s.type==='retention'?initializeLearning(state.studio).retention[s.retentionKey]?.checks.find(c=>c.sessionId===s.id):null;
  return (s.type==='retention'?`<section class="learning-retention"><h2>${retentionResult?.passed?'You passed this delayed check.':'This skill needs another look.'}</h2><p>${retentionResult?.passed?'Three fresh answers were independently correct with valid approaches. Another check is scheduled in seven days.':'A miss, hint, reveal, guess, or unverified approach keeps this check from passing. Review the method; another fresh check is scheduled tomorrow.'} This is practice evidence, not a predicted SAT score.</p></section>`:'')+header('A useful check-in.','Accuracy and setup quality tell us what to practice next.')+`<section class="summary-panel"><span class="pill">${s.type==='foundation'?'Foundation check':'Practice set'} complete</span><h2 style="margin-top:14px">${s.type==='retention'?'Your first-answer record':stable?'Ready for a harder step.':'Keep building a reliable setup.'}</h2><div class="summary-score">${correct}<span style="font-size:24px;color:#81958d;letter-spacing:0"> / ${s.records.length}</span></div><p>${independent} correct without hints. ${valid} setups or reasoning marked correct.</p><p>${s.type==='retention'?'Delayed checks are kept separate from the five-question readiness threshold. Corrections remain assisted, and the first answers above determine this check.':stable?'This meets the 80% threshold with valid setups or reasoning and no help on those answers. Hard questions are now available in this section. Pace targets unlock after two sets meet this threshold; the stopwatch is always available.':'We’ll keep practice untimed and use medium questions. Review the setup errors below before moving to harder work.'}</p><div class="table-wrap" style="margin-top:24px"><table><thead><tr><th>Skill</th><th>Answer</th><th>Setup</th></tr></thead><tbody>${s.records.map(r=>`<tr><td>${esc(r.exactSkill)}${r.confidence?'<small>Confidence: '+esc(r.confidence)+'</small>':''}${r.correction?.stage==='complete'?'<small>Correction completed with help</small>':''}</td><td>${r.revealed?'Revealed':r.correct?(r.hintsUsed?'Correct with hint':'Unassisted correct'):'Incorrect'}</td><td>${r.setupCorrect===true?'Correct':r.setupCorrect===false?'Review':'Not checked'}</td></tr>`).join('')}</tbody></table></div><div class="summary-actions"><a href="#home" class="primary">Continue daily path</a><a href="#bank" class="secondary">Choose fresh practice</a><a href="#progress" class="secondary">See skill progress</a><button class="secondary" data-action="export">Export this progress</button></div></section>`;
}
function filteredBank(){const taken=used(),needle=filter.search.toLowerCase();return data.questions.filter(q=>q.section===state.section&&!taken.has(q.id)&&(filter.skill==='all'||q.skill===filter.skill)&&(filter.difficulty==='all'||q.difficulty===filter.difficulty)&&(!needle||[q.id,q.file,q.skill,q.domain,q.number].join(' ').toLowerCase().includes(needle)));}
function renderBank(){
  const list=filteredBank(),pageSize=12;filter.page=Math.max(0,Math.min(filter.page,Math.ceil(list.length/pageSize)-1));
  const shown=list.slice(filter.page*pageSize,(filter.page+1)*pageSize),skills=[...new Set(data.questions.filter(q=>q.section===state.section).map(q=>q.skill))].sort();
  return header('Your official question bank.','Fresh '+esc(state.section)+' questions from your PDFs. Recorded attempts are automatically excluded.')+`<div class="bank-tools"><label><span class="small muted">Search</span><input type="search" id="bank-search" placeholder="Skill, question ID, or file…" value="${esc(filter.search)}"></label><label><span class="small muted">Skill</span><select id="skill-filter"><option value="all">All skills in this section</option>${skills.map(s=>`<option ${filter.skill===s?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label><span class="small muted">Difficulty</span><select id="difficulty-filter"><option value="all">All difficulties</option>${['Easy','Medium','Hard'].map(d=>`<option value="${d}" ${filter.difficulty===d?'selected':''} ${d==='Hard'&&!readyHard()?'disabled':''}>${d}${d==='Hard'&&!readyHard()?' · locked':''}</option>`).join('')}</select></label></div><div class="bank-controls"><div><strong>${list.length.toLocaleString()} unused questions</strong><p>${data.questions.filter(q=>q.section===state.section).length.toLocaleString()} in this section · ${data.questionCount.toLocaleString()} across both sections. Attempted questions excluded.</p></div><button class="primary" data-action="build-set">Build a 5-question set</button></div><label class="quantity-check"><input type="checkbox" id="timed-mode" ${readyTimed()?'':'disabled'}><span>${readyTimed()?'Use a soft timer for the next set':'Pace targets unlock after two sets with at least 80% correct without hints and valid setups or reasoning. The stopwatch is always available.'}</span></label>${!readyHard()?'<p class="history-note">Hard questions unlock after a completed set of at least five questions meets that same accuracy and setup target. Start with the foundation check.</p>':''}<div class="table-wrap"><table><thead><tr><th>Skill and source</th><th>Difficulty</th><th></th></tr></thead><tbody>${shown.map(q=>`<tr><td><strong>${esc(q.skill)}</strong><small>${esc(q.file)} · p. ${q.page} · Q ${esc(q.number)}<br>ID ${q.id}</small></td><td><span class="pill ${q.difficulty.toLowerCase()}">${q.difficulty}</span></td><td><button class="table-action" data-action="practice-one" data-id="${q.id}" ${q.difficulty==='Hard'&&!readyHard()?'disabled':''}>${q.difficulty==='Hard'&&!readyHard()?'Locked':'Practice'}</button></td></tr>`).join('')||'<tr><td colspan="3" class="empty">No unused questions match. Try a different skill or search.</td></tr>'}</tbody></table></div><div class="pagination"><button class="secondary" data-action="prev-page" ${filter.page===0?'disabled':''}>Previous</button><span>${list.length?filter.page*pageSize+1:0}–${Math.min((filter.page+1)*pageSize,list.length)} of ${list.length}</span><button class="secondary" data-action="next-page" ${(filter.page+1)*pageSize>=list.length?'disabled':''}>Next</button></div>`;
}
function renderProgress(){
  const all=records(),correct=all.filter(r=>r.correct).length,independent=all.filter(r=>r.correct&&!r.hintsUsed&&!r.revealed).length,hinted=all.filter(r=>r.correct&&r.hintsUsed&&!r.revealed).length;
  const groups=new Map();
  for(const r of all){const g=groups.get(r.exactSkill)||{total:0,correct:0,independent:0,hinted:0,setups:0};g.total++;g.correct+=r.correct?1:0;g.independent+=r.correct&&!r.hintsUsed&&!r.revealed?1:0;g.hinted+=r.correct&&r.hintsUsed&&!r.revealed?1:0;g.setups+=r.setupCorrect===true?1:0;groups.set(r.exactSkill,g);}
  const unfinished=sectionSessions().filter(s=>!s.completed);
  const history=priorHistory().filter(r=>r.section===state.section);
  const diag=reading()?null:data.diagnostics.at(-1);
  return header('See what’s becoming reliable.','Website practice, earlier tutoring, and diagnostic results each keep their own context.',`<button class="secondary" data-action="export">Export progress</button>`)+`<section class="metric-row"><div class="metric"><strong>${all.length}</strong><small>Questions attempted here</small></div><div class="metric"><strong>${pct(correct,all.length)}</strong><small>Answer accuracy</small></div><div class="metric"><strong>${independent}</strong><small>Unassisted correct</small></div><div class="metric"><strong>${hinted}</strong><small>Correct with hints</small></div></section><div class="section-heading"><h2>Practice by exact skill</h2><span class="small muted">New website attempts only</span></div><div class="table-wrap"><table><thead><tr><th>Skill</th><th>Correct</th><th>Without hints</th><th>With hints</th><th>Valid setup / reasoning</th></tr></thead><tbody>${[...groups].map(([skill,g])=>`<tr><td><strong>${esc(skill)}</strong></td><td>${g.correct}/${g.total}</td><td>${g.independent}</td><td>${g.hinted}</td><td>${g.setups}/${g.total}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">Your first answer will start this record. Every explanation and hint matters.</td></tr>'}</tbody></table></div><p class="history-note">Math setups and Reading and Writing reasoning use your self-check against the supplied official solution. Revealed answers count as attempts, not correct independent answers.</p>${unfinished.length?'<div class="section-heading"><h2>Pick up a paused set</h2></div>'+unfinished.map(s=>`<div class="resume-row"><div><strong>${s.type==='foundation'?(reading()?'Reading and Writing check':'Math foundation check'):'Focused '+esc(state.section)+' set'}</strong><p>${s.records.length} of ${s.questionIds.length} attempted · ${s.timed?'Timed':'Untimed'}</p></div><button class="secondary" data-action="resume" data-id="${esc(s.id)}">Resume set</button></div>`).join(''):''}${diag?`<div class="section-heading"><h2>Your latest diagnostic</h2><span class="small muted">${esc(diag.received_on||'Date not supplied')}</span></div><p class="history-note" style="padding-top:0">${diag.visible_correct}/${diag.visible_total} correct in the visible results. Each category has only one or two questions, so this helps choose follow-up practice rather than establish mastery.</p><div class="diagnostic-grid">${diag.skill_results.map(r=>`<div class="diagnostic-row"><div class="diagnostic-label"><strong>${esc(r.reported_skill)}</strong><span>${r.correct}/${r.total} correct</span></div><div class="diagnostic-track"><span class="${r.correct===r.total?'good':''}" style="width:${100*r.correct/r.total}%"></span></div></div>`).join('')}</div>`:''}<div class="section-heading"><h2>Earlier tutoring history</h2><span class="small muted">Imported from your saved record</span></div><p class="history-note" style="padding-top:0">${history.filter(r=>r.correct).length}/${history.length} ${esc(state.section)} answers correct in the saved tutoring sessions. ${history.filter(r=>r.assistance==='hinted').length} explicitly marked as assisted; other assistance status was not consistently recorded. These attempts are excluded from fresh practice.</p><div class="table-wrap"><table><thead><tr><th>Question</th><th>Result</th><th>Help recorded</th></tr></thead><tbody>${history.map(r=>`<tr><td><strong>${esc(r.skill)}</strong><small>ID ${r.questionId}</small></td><td>${r.correct?'Correct':'Incorrect'}</td><td>${r.assistance==='hinted'?'Hint used':'Not recorded'}</td></tr>`).join('')}</tbody></table></div><div class="section-heading"><h2>Keep a portable copy</h2></div><p class="history-note" style="padding-top:0">Progress stays in this browser. Export the file to back it up, move it to another browser, or share it in the tutoring chat. The website does not automatically update your chat history.</p><div class="summary-actions"><button class="secondary" data-action="export">Export progress</button><label class="secondary import-label">Import a backup<input id="import-file" type="file" accept="application/json,.json"></label></div>`;
}
function render(){view=['home','practice-hub','settings','analysis','learn','lessons','review','analytics','tests','vocab','achievements','challenge','desmos','bank','progress','plan','practice'].includes(location.hash.slice(1))?location.hash.slice(1):'home';studio.applyTheme();const content=['home','learn'].includes(view)?path.home():view==='practice-hub'?path.practice():['settings','plan'].includes(view)?path.settings():view==='bank'?renderBank():view==='progress'?renderProgress():view==='practice'?renderPractice():studio.render(view==='analysis'?'analytics':view);$('#app').innerHTML=shell(content);if(view==='practice')studio.afterRender();}
function submit(revealed=false){
  const s=active(),q=current();if(!q||recordForQuestion())return;
  const d=draft(),form=$('#answer-form');
  if(!revealed){
    if(!d.setup.trim()||!d.answer||!d.quantity||!CONFIDENCE.includes(d.confidence)){$('#form-error').textContent='Add your setup or reasoning, choose an answer and confidence rating, and check the final question.';return;}
  }
  const record={questionId:q.id,section:q.section,skill:q.skill,exactSkill:guided[q.id]?.exact||q.skill,difficulty:q.difficulty,answer:revealed?null:d.answer,correct:revealed?false:gradeAnswer(q,d.answer),setup:d.setup,setupCorrect:revealed?false:guided[q.id]?checkSetup(q.id,d.setup):null,setupAssessment:guided[q.id]?'model_check':'self_review',quantityChecked:d.quantity,hintsUsed:d.hints+desmosAssistanceCount(d),desmosTipIds:d.desmosTipIds||[],revealed,seconds:s.timed?Math.round((Date.now()-d.startedAt)/1000):null,submittedAt:new Date().toISOString(),stopwatchReadingMs:stopwatchElapsed(),confidence:CONFIDENCE.includes(d.confidence)?d.confidence:undefined,activeSeconds:Math.round(d.activeSeconds||0),source:{file:q.file,page:q.page,question:q.number,id:q.id}};
  record.correction=newCorrection(record);
  s.records.push(record);if(s.type!=='retention')scheduleRetention(state.studio,q,record.submittedAt);save();render();document.querySelector('.learning-correction, .feedback')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function exportProgress(){const payload={schema:'sat-math-studio-progress-v1',exportedAt:new Date().toISOString(),goal:profile(),section:state.section,stopwatch:state.stopwatch,activeId:state.activeId,sessions:state.sessions,routine:state.routine||null,diagnostics:state.diagnostics||[],studio:state.studio};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='sat-study-progress-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Progress exported. Share the file in your tutoring chat to sync it.');}
function hydrateDraft(form){const d=draft();if(!current())return;const fields=new FormData(form);d.setup=String(fields.get('setup')||'');d.answer=String(fields.get('answer')||'');d.quantity=fields.has('quantity');d.confidence=String(fields.get('confidence')||'');save();}
document.addEventListener('input',e=>{
  if(e.target.closest('#correction-form')){saveCorrectionDraft(e.target.closest('form'));return;}
  if(studio.input(e))return;
  if(e.target.closest('#answer-form'))hydrateDraft(e.target.closest('form'));
  if(e.target.id==='bank-search'){const position=e.target.selectionStart;filter.search=e.target.value;filter.page=0;render();const el=$('#bank-search');el.focus();el.setSelectionRange(position,position);}
});
document.addEventListener('change',async e=>{
  if(e.target.closest('#correction-form')){saveCorrectionDraft(e.target.closest('form'));return;}
  if(studio.input(e))return;
  if(await planner.change(e))return;
  if(e.target.closest('#answer-form'))hydrateDraft(e.target.closest('form'));
  if(e.target.id==='section-picker'){switchSection(e.target.value);return;}
  if(e.target.id==='skill-filter'||e.target.id==='difficulty-filter'){filter[e.target.id==='skill-filter'?'skill':'difficulty']=e.target.value;filter.page=0;render();}
  if(e.target.id==='profile-import'){await importProfile(e.target.files[0]);return;}
  if(e.target.id==='import-file'){
    try{
      const file=e.target.files[0];if(!file)return;if(file.size>5000000)throw Error('This file is too large for a progress backup.');
      const backup=JSON.parse(await file.text());
      if(backup.schema!=='sat-math-studio-progress-v1'||!Array.isArray(backup.sessions))throw Error('Choose a Apple Study: SAT progress export.');
      const incoming=backup.sessions;
      const studyTools=backup.studio?importStudio(backup.studio,data.questions):null;
      const routine=backup.routine?normalizeRoutine(backup.routine):null;
      const diagnostics=(backup.diagnostics||[]).map(normalizeDiagnostic);
      for(const s of incoming){s.section ||= bank.get(s.questionIds?.[0])?.section;s.drafts ||= {};if(s.section!=='Math'&&s.section!=='Reading and Writing')throw Error('Invalid SAT section in backup.');}
      for(const s of incoming){if(typeof s.id!=='string'||!Array.isArray(s.questionIds)||!Array.isArray(s.records)||s.questionIds.some(id=>!bank.has(id)||bank.get(id).section!==s.section)||s.records.some(r=>!bank.has(r.questionId)||!s.questionIds.includes(r.questionId))||!Number.isInteger(s.index)||s.index<0||s.index>=s.questionIds.length)throw Error('This backup contains invalid session data.');}
      validateLearningRecords(incoming);
      const mergedSessions=mergeLearningSessions(state.sessions,incoming);
      state.sessions=mergedSessions;
      if(studyTools)state.studio=mergeStudio(state.studio,studyTools);
      if(routine)state.routine=routine;
      state.diagnostics=[...new Map([...(state.diagnostics||[]),...diagnostics].map(d=>[d.id,d])).values()];
      if(!state.activeId&&incoming.length)state.activeId=incoming[0].id;
      save();render();toast('Backup imported. Your existing sessions were kept.');
    }catch(error){toast(error.message||'Could not read this backup.');}
  }
});
document.addEventListener('submit',e=>{if(path.submit(e))return;if(e.target.id==='correction-form'){e.preventDefault();submitCorrection(e.target);return;}if(studio.submit(e))return;if(planner.submit(e))return;if(e.target.id==='profile-form'){e.preventDefault();saveProfile(e.target);return;}if(e.target.id==='answer-form'){e.preventDefault();hydrateDraft(e.target);submit();}});
document.addEventListener('click',e=>{
  const choice=e.target.closest('.elimination-mode .choice');if(choice&&e.target.tagName!=='INPUT'){e.preventDefault();choice.classList.toggle('crossed-out');studio.eliminate(choice);return;}
  const target=e.target.closest('[data-action]');if(!target)return;
  const action=target.dataset.action;
  if(path.click(action,target))return;
  if(studio.click(action,target))return;
  if(planner.click(action,target))return;
  if(action==='retention-start')return startRetentionCheck(target.dataset.id);
  if(action==='correction-retry'||action==='correction-reveal'||action==='correction-skip'){const r=recordForQuestion();if(!r?.correction)return;r.correction.stage=action==='correction-retry'?'retry':action==='correction-reveal'?'revealed':'skipped';r.correction.updatedAt=new Date().toISOString();if(action==='correction-reveal')r.correction.solutionRevealed=true;save();render();document.querySelector('.learning-correction')?.scrollIntoView({block:'nearest'});return;}
  if(action==='export')return exportProgress();
  if(action==='profile')return openProfile();
  if(action==='watch-toggle'){const watch=state.stopwatch;if(watch.runningSince){watch.elapsed=stopwatchElapsed();watch.runningSince=null;}else watch.runningSince=Date.now();save();render();return;}
  if(action==='watch-reset'){state.stopwatch={elapsed:0,runningSince:null};save();render();return;}
  if(action==='foundation')return startFoundation();
  if(action==='hint'){const q=current(),tips=guided[q.id]||skillTips[q.skill]||generic;const d=draft();d.hints=Math.min(d.hints+1,tips.hints.length);save();render();$('.coach')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
  if(action==='reveal')return submit(true);
  if(action==='next'){const s=active();if(!advanceSession(s))return;finishRetention(state.studio,s);save();render();window.scrollTo({top:0,behavior:'smooth'});return;}
  if(action==='setup-yes'||action==='setup-no'){const r=recordForQuestion();if(r){r.setupCorrect=action==='setup-yes';r.approachReviewedAt=new Date().toISOString();if(!r.setupCorrect)r.correction ||= newCorrection(r);save();render();}return;}
  if(action==='resume'){state.activeId=target.dataset.id;save();location.hash='practice';render();window.scrollTo({top:0});return;}
  if(action==='practice-one'){const q=bank.get(target.dataset.id);if(q.difficulty==='Hard'&&!readyHard())return toast('Complete a stable untimed set before hard practice.');return newSession([q.id]);}
  if(action==='build-set'){
    const list=filteredBank().filter(q=>readyHard()||q.difficulty!=='Hard');
    if(list.length<5)return toast('Choose filters with at least five unused, unlocked questions.');
    for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}
    const timed=!!$('#timed-mode')?.checked&&readyTimed();return newSession(list.slice(0,5).map(q=>q.id),'custom',timed);
  }
  if(action==='next-page'||action==='prev-page'){filter.page+=action==='next-page'?1:-1;render();window.scrollTo({top:0});return;}
  if(action==='image'){
    const q=current();$('#modal').innerHTML=`<div class="dialog-header"><strong>${esc(q.skill)} · Q ${esc(q.number)}</strong><div><a class="secondary" href="${q.image}" target="_blank" rel="noopener noreferrer">Full resolution ↗</a> <button class="secondary" data-action="close-modal">Close</button></div></div><img src="${q.image}" alt="Official question ${esc(q.id)}">`;$('#modal').showModal();return;
  }
  if(action==='close-modal')$('#modal').close();
});
window.addEventListener('hashchange',()=>{if(data){render();window.scrollTo({top:0});}});
let lastPracticeTick=Date.now();
setInterval(()=>{const now=Date.now(),delta=Math.min(5,Math.max(0,(now-lastPracticeTick)/1000));lastPracticeTick=now;if(state&&view==='practice'&&current()&&!recordForQuestion()&&document.visibilityState==='visible'&&document.hasFocus()){const d=draft();d.activeSeconds=(d.activeSeconds||0)+delta;if(Math.floor(d.activeSeconds)%10===0)save();}if(state?.studio)studio.tick();const clock=$('#stopwatch-time');if(clock&&state)clock.textContent=formatWatch(stopwatchElapsed());const el=$('#timer'),s=active();if(el&&s&&!s.completed){const sec=Math.floor((Date.now()-draft().startedAt)/1000);el.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}},1000);
async function boot(){
  try{
    const configuration=await (await fetch('library-config.json')).json();const response=await fetch(configuration.data);if(!response.ok)throw Error('Question library could not load.');data=await response.json();bank=new Map(data.questions.map(q=>[q.id,q]));
    try{state=JSON.parse(localStorage.getItem(KEY)||'null');}catch{storageOK=false;}
    if(!state||state.version!==1||!Array.isArray(state.sessions))state={version:1,sessions:[],activeId:null,section:'Math'};
    state.section=state.section==='Reading and Writing'?'Reading and Writing':'Math';
    state.stopwatch ||= {elapsed:0,runningSince:null};
    initializeStudio(state);
    for(const session of state.sessions)for(const record of session.records||[])markExposure(state.studio,record.questionId,record.submittedAt||new Date().toISOString());
    if(!Array.isArray(state.diagnostics))state.diagnostics=seedDiagnostics(data.diagnostics||[]);
    for(const s of state.sessions){s.section ||= bank.get(s.questionIds[0])?.section||'Math';s.drafts ||= {};}
    if(!state.sessions.length&&(location.hash==='#practice')&&data.questions.some(q=>q.section===state.section))newSession(reading()?data.readingFoundationIds:data.foundationIds,'foundation');else render();
  }catch(error){$('#app').innerHTML=`<div class="loading"><div><h1>Your library could not load.</h1><p>${esc(error.message)}</p><button class="primary" onclick="location.reload()" style="margin-top:20px">Try again</button></div></div>`;}
}
boot();
