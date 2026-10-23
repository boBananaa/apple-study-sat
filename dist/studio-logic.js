import {validateRush,mergeRush} from './rush-logic.js?v=10';
import {validateOfficialResults,mergeOfficialResults} from './results-logic.js?v=10';
import {validateDesmosPractice,mergeDesmosPractice} from './desmos-practice.js?v=10';
import {validateHomePath,mergeHomePath} from './path-state.js?v=10';
import {initializeLearning,validateLearning,mergeLearning} from './learning-logic.js?v=10';
import {gradeAnswer} from './logic.js?v=10';
import {localDate,addDays,validDate} from './planner.js?v=10';

export const isIndependent=r=>r.correct===true&&r.hintsUsed===0&&!r.revealed&&r.setupCorrect===true&&!r.previouslyExposed&&r.confidence!=='guessing';
export function initializeStudio(state){
 state.studio ||= {};
 const defaults={version:1,lessons:{},vocab:{},review:{},saved:[],notes:{},annotations:{},eliminated:{},exams:[],rushRounds:[],activeRushId:null,events:[],challenge:{},theme:'light',weeklyGoal:100,focus:false,scoreReports:[]};
 for(const [key,value] of Object.entries(defaults))state.studio[key]??=value;
 initializeLearning(state.studio);
 return state.studio;
}
export function award(studio,key,points,kind,at=new Date().toISOString()){
 if(studio.events.some(e=>e.key===key))return false;
 studio.events.push({key,points,kind,at});return true;
}
export function activity(state,today=localDate()){
 const studio=initializeStudio(state),events=[...studio.events];
 const seen=new Set();
 for(const s of state.sessions||[])for(const r of s.records||[]){if(seen.has(r.questionId)||!r.submittedAt)continue;seen.add(r.questionId);events.push({key:'q-'+r.questionId,points:r.revealed?1:r.correct?(isIndependent(r)?15:8):5,kind:'practice',at:r.submittedAt});}
 const dates=new Map();for(const e of events){const d=localDate(new Date(e.at));dates.set(d,(dates.get(d)||0)+e.points);}
 let streak=0,day=dates.has(today)?today:addDays(today,-1);while(dates.has(day)){streak++;day=addDays(day,-1);}
 const weekStart=addDays(today,-((new Date(today+'T12:00:00Z').getUTCDay()+6)%7));
 return {xp:events.reduce((n,e)=>n+e.points,0),weekXp:events.filter(e=>localDate(new Date(e.at))>=weekStart).reduce((n,e)=>n+e.points,0),streak,dates,events};
}
export function reviewQueue(state,questions,today=localDate()){
 const byId=new Map(questions.map(q=>[q.id,q])),latest=new Map();
 for(const s of state.sessions||[])for(const r of s.records||[])latest.set(r.questionId,r);
 for(const round of state.studio?.rushRounds||[])for(const result of round.results||[])if(!latest.has(result.questionId))latest.set(result.questionId,{...result,hintsUsed:0,setupCorrect:null,fromRush:true});
 for(const round of state.studio?.rushRounds||[])if(!['active','feedback'].includes(round.status))for(const id of round.exposedIds||[])if(!latest.has(id))latest.set(id,{questionId:id,answer:null,correct:false,hintsUsed:0,setupCorrect:null,fromRush:true});
 for(const id of state.studio?.saved||[])if(!latest.has(id))latest.set(id,{questionId:id,correct:true,hintsUsed:0,setupCorrect:null,bookmarkOnly:true});
 return [...latest].flatMap(([id,r])=>{
  const q=byId.get(id),progress=state.studio?.review?.[id];
  if(!q)return[];
  const needs=!r.correct||r.hintsUsed>0||r.revealed||r.setupCorrect===false||r.confidence==='guessing'||state.studio?.saved?.includes(id);
  if(!needs)return[];
  return [{question:q,record:r,progress,due:!progress?.due||progress.due<=today,reason:r.fromRush?'Question Rush: missed or timed out':r.bookmarkOnly?'Saved for later':r.revealed?'Solution revealed':!r.correct?'Answer missed':r.hintsUsed?'Hint used':r.setupCorrect===false?'Setup needs work':r.confidence==='guessing'?'Correct but guessed':'Saved for review'}];
 }).sort((a,b)=>Number(b.due)-Number(a.due)||String(a.progress?.due||'').localeCompare(String(b.progress?.due||'')));
}
export function recordReview(studio,id,{correct,setup,rule,errorType='Unknown',hinted=false},today=localDate()){
 if(!setup?.trim()||!rule?.trim())throw Error('Add your corrected approach and a recognition rule.');
 const old=studio.review[id]||{successes:0,attempts:[]},success=correct&&!hinted;
 const successes=success?old.successes+1:0,interval=success?[1,3,7,14,30][Math.min(successes-1,4)]:1;
 const next={successes,due:addDays(today,interval),setup:setup.slice(0,4000),rule:rule.slice(0,2000),errorType,updatedAt:new Date().toISOString(),attempts:[...(old.attempts||[]),{date:today,correct,hinted}].slice(-30)};
 studio.review[id]=next;award(studio,'review-'+id+'-'+today,success?15:5,'review');return next;
}
export function rateVocabulary(studio,id,rating,today=localDate()){
 if(!['again','good','easy'].includes(rating))throw Error('Choose a review rating.');
 const old=studio.vocab[id]||{repetitions:0,saved:false},repetitions=rating==='again'?0:old.repetitions+1;
 const interval=rating==='again'?0:rating==='easy'?Math.min(60,Math.max(4,repetitions*7)):Math.min(30,Math.max(1,2**(repetitions-1)));
 studio.vocab[id]={...old,repetitions,due:addDays(today,interval),lastRating:rating,updatedAt:new Date().toISOString()};award(studio,'vocab-'+id+'-'+today,3,'vocabulary');
 return studio.vocab[id];
}
export function examTaken(state,history=[]){
 return new Set([...(state.studio?.rushRounds||[]).flatMap(r=>['active','feedback'].includes(r.status)?r.questionIds:r.exposedIds||[]),...Object.keys(state.studio?.learning?.exposures||{}),...history.map(r=>r.questionId),...(state.sessions||[]).flatMap(s=>s.records.map(r=>r.questionId)),...(state.sessions||[]).filter(s=>!s.completed).flatMap(s=>s.questionIds),...(state.studio?.exams||[]).filter(e=>e.status!=='abandoned').flatMap(e=>e.modules.flatMap(m=>m.questionIds))]);
}
export function chooseQuestions(questions,taken,{section,count,difficulty='mixed',seed=1}){
 let cursor=seed>>>0;const random=()=>{cursor=(1664525*cursor+1013904223)>>>0;return cursor/4294967296;};
 const pool=questions.filter(q=>q.section===section&&!taken.has(q.id)).map(q=>({...q,tie:random()}));
 if(pool.length<count)throw Error(`This session needs ${count} unused ${section} questions. Finish paused sets or add a larger library.`);
 const desired=difficulty==='hard'?['Hard','Medium','Hard','Easy','Medium']:difficulty==='support'?['Easy','Medium','Easy','Medium','Hard']:['Medium','Easy','Medium','Hard','Medium'];
 const weights=section==='Math'?{'Algebra':.35,'Advanced Math':.35,'Problem-Solving and Data Analysis':.15,'Geometry and Trigonometry':.15}:{'Information and Ideas':.26,'Craft and Structure':.28,'Expression of Ideas':.2,'Standard English Conventions':.26};
 const selected=[],domains=new Map();
 for(let i=0;i<count;i++){
  const preferred=desired[i%desired.length];
  pool.sort((a,b)=>((domains.get(a.domain)||0)+1)/(weights[a.domain]||.25)-((domains.get(b.domain)||0)+1)/(weights[b.domain]||.25)||Number(b.difficulty===preferred)-Number(a.difficulty===preferred)||a.tie-b.tie);
  const q=pool.shift();selected.push(q.id);domains.set(q.domain,(domains.get(q.domain)||0)+1);
 }
 return selected;
}
export function createExam(questions,taken,{kind='diagnostic',section='Math',multiplier=1,now=Date.now(),id=String(now)}={}){
 if(!['diagnostic','section','full'].includes(kind)||!['Math','Reading and Writing','Both'].includes(section)||![1,1.5,2].includes(Number(multiplier)))throw Error('Invalid assessment settings.');
 if(kind==='full')section='Both';
 const sections=section==='Both'?['Reading and Writing','Math']:[section],modules=[],reserved=new Set(taken);
 for(const subject of sections){const count=kind==='diagnostic'?12:subject==='Math'?22:27;
  for(let i=0;i<(kind==='diagnostic'?1:2);i++){
   const questionIds=chooseQuestions(questions,reserved,{section:subject,count,seed:now+modules.length});questionIds.forEach(q=>reserved.add(q));
   modules.push({section:subject,number:i+1,questionIds,answers:{},flags:[],records:[],seconds:kind==='diagnostic'?0:(subject==='Math'?35:32)*60*Number(multiplier),route:i===0?'mixed':'pending'});
  }
 }
 const exam={id,kind,section,multiplier:Number(multiplier),status:'active',moduleIndex:0,index:0,modules,createdAt:new Date(now).toISOString(),startedAt:now};
 exam.deadline=modules[0].seconds?now+modules[0].seconds*1000:null;return exam;
}
export function remainingSeconds(exam,now=Date.now()){return exam.deadline?Math.max(0,Math.ceil((exam.deadline-now)/1000)):null;}
export function submitExamModule(exam,questions,now=Date.now()){
 if(exam.status!=='active')return false;
 const module=exam.modules[exam.moduleIndex],bank=new Map(questions.map(q=>[q.id,q]));
 if(module.completedAt)return false;
 module.records=module.questionIds.map(id=>{const q=bank.get(id),answer=module.answers[id]||'';return {questionId:id,section:q.section,skill:q.skill,exactSkill:q.skill,difficulty:q.difficulty,answer,correct:gradeAnswer(q,answer),setup:'',setupCorrect:null,setupAssessment:'exam_answer_only',quantityChecked:false,hintsUsed:0,revealed:false,flagged:module.flags.includes(id),submittedAt:new Date(now).toISOString(),source:{file:q.file,page:q.page,question:q.number,id:q.id}};});
 module.completedAt=new Date(now).toISOString();module.accuracy=module.records.filter(r=>r.correct).length/module.records.length;
 if(exam.moduleIndex===exam.modules.length-1){exam.status='complete';exam.completedAt=new Date(now).toISOString();exam.deadline=null;return true;}
 const next=exam.modules[exam.moduleIndex+1];
 exam.status=next.section!==module.section?'break':'between';exam.deadline=exam.status==='break'?now+600000:null;return true;
}
export function startNextModule(exam,questions,taken,now=Date.now()){
 if(!['between','break'].includes(exam.status))throw Error('Finish the current module first.');
 const previous=exam.modules[exam.moduleIndex],next=exam.modules[exam.moduleIndex+1];
 if(next.number===2){
  const available=new Set(taken);next.questionIds.forEach(id=>available.delete(id));
  const route=previous.accuracy>=.65?'hard':'support';
  next.questionIds=chooseQuestions(questions,available,{section:next.section,count:next.questionIds.length,difficulty:route,seed:now});next.route=route;
 }
 exam.moduleIndex++;exam.index=0;exam.status='active';exam.startedAt=now;exam.deadline=next.seconds?now+next.seconds*1000:null;
}
export function finishExam(state,exam){
 if(exam.status!=='complete'||exam.synced)return false;
 for(const [i,m] of exam.modules.entries()){
  if(!state.sessions.some(s=>s.id===exam.id+'-module-'+i))state.sessions.push({id:exam.id+'-module-'+i,section:m.section,type:'assessment',questionIds:m.questionIds,index:m.questionIds.length-1,records:m.records,drafts:{},timed:m.seconds>0,completed:true,createdAt:exam.createdAt,completedAt:m.completedAt});
 }
 for(const section of new Set(exam.modules.map(m=>m.section))){
  const records=exam.modules.filter(m=>m.section===section).flatMap(m=>m.records),groups=new Map();
  for(const r of records){const row=groups.get(r.skill)||{skill:r.skill,reportedSkill:r.skill,correct:0,total:0};row.correct+=r.correct?1:0;row.total++;groups.set(r.skill,row);}
  state.diagnostics.push({id:exam.id+'-'+section,section,date:localDate(new Date(exam.completedAt)),label:exam.kind==='diagnostic'?'Website diagnostic':'Website test result',rows:[...groups.values()]});
 }
 award(initializeStudio(state),'exam-'+exam.id,exam.kind==='diagnostic'?40:100,'assessment',exam.completedAt);exam.synced=true;return true;
}
function normalizePreferences(value){
 if(value==null)return null;
 if(typeof value!=='object'||Array.isArray(value))throw Error('Invalid study preferences in backup.');
 const scope=value.scope??'Math',minutes=value.minutes??30,days=value.days??[1,2,3,4,5];
 if(!['Math','Reading and Writing','Both'].includes(scope)||!Number.isInteger(minutes)||minutes<15||minutes>120||!Array.isArray(days)||!days.length||days.length>7||days.some(day=>!Number.isInteger(day)||day<0||day>6))throw Error('Invalid study preferences in backup.');
 return {scope,minutes,days:[...new Set(days)].sort((a,b)=>a-b)};
}
export function importStudio(value,questions,{today=localDate()}={}){
 if(!value||value.version!==1)throw Error('This study-tool backup is not supported.');
 const allowed=new Set(questions.map(q=>q.id));
 if(!Array.isArray(value.exams)||value.exams.length>100||!Array.isArray(value.events)||value.events.length>50000)throw Error('Invalid study-tool backup.');
 for(const e of value.exams){if(!/^[\w-]{1,100}$/.test(e.id)||!['active','between','break','complete','abandoned'].includes(e.status)||!Array.isArray(e.modules)||!e.modules.length||e.modules.length>4||!Number.isInteger(e.moduleIndex)||e.moduleIndex<0||e.moduleIndex>=e.modules.length||!Number.isInteger(e.index)||e.index<0||e.index>=e.modules[e.moduleIndex].questionIds.length||e.deadline!==null&&(!Number.isFinite(e.deadline)||e.deadline<0))throw Error('Invalid assessment in backup.');for(const m of e.modules){if(!Array.isArray(m.questionIds)||!m.questionIds.length||m.questionIds.length>27||m.questionIds.some(id=>!allowed.has(id))||!Array.isArray(m.records)||!m.answers||typeof m.answers!=='object'||Object.values(m.answers).some(v=>typeof v!=='string'||v.length>100)||!Array.isArray(m.flags)||m.flags.some(id=>!m.questionIds.includes(id)))throw Error('This assessment contains invalid data or questions missing from your library.');}}
 if(value.events.some(e=>typeof e.key!=='string'||!Number.isFinite(e.points)||e.points<0||e.points>1000||!Number.isFinite(Date.parse(e.at))))throw Error('Invalid activity data.');
 const clean=initializeStudio({studio:structuredClone(value)});
 clean.learning=validateLearning(value.learning,questions);
 clean.homePath=validateHomePath(value.homePath);
 clean.officialResults=validateOfficialResults(value.officialResults,{today});
 clean.desmosPractice=validateDesmosPractice(value.desmosPractice);
 clean.rushRounds=validateRush(value.rushRounds||[],questions);
 clean.activeRushId=clean.rushRounds.some(r=>r.id===value.activeRushId)?value.activeRushId:null;
 const preferences=normalizePreferences(value.preferences);
 if(preferences)clean.preferences=preferences;else delete clean.preferences;
 if(!Number.isInteger(clean.weeklyGoal)||clean.weeklyGoal<25||clean.weeklyGoal>5000)throw Error('Invalid weekly goal.');
 for(const item of Object.values(clean.vocab))if(!Number.isInteger(item.repetitions)||item.repetitions<0||item.repetitions>1000)throw Error('Invalid vocabulary review data.');
 for(const item of Object.values(clean.vocab))if(item.due&&!validDate(item.due))throw Error('Invalid vocabulary review date.');
 for(const item of Object.values(clean.review))if(!Number.isInteger(item.successes)||item.successes<0||item.successes>1000||!validDate(item.due)||!Array.isArray(item.attempts))throw Error('Invalid correction review data.');
 if(!Array.isArray(clean.saved)||!Array.isArray(clean.scoreReports)||clean.scoreReports.some(r=>!validDate(r.date)||[r.math,r.readingWriting].some(v=>!Number.isInteger(v)||v<200||v>800||v%10)))throw Error('Invalid score checkpoint.');
 for(const e of clean.exams)for(const m of e.modules)if(m.records.some(r=>!m.questionIds.includes(r.questionId)))throw Error('Assessment records do not match the questions.');
 return {...clean,saved:(clean.saved||[]).filter(id=>allowed.has(id)),theme:clean.theme==='dark'?'dark':'light',focus:false};
}
export function mergeStudio(existing,incoming,{today=localDate()}={}){
 const out={...existing,...incoming,focus:false};
 out.learning=mergeLearning(initializeLearning(existing),initializeLearning(incoming));
 out.homePath=mergeHomePath(existing.homePath,incoming.homePath);
 out.officialResults=mergeOfficialResults(existing.officialResults,incoming.officialResults,{today});
 out.desmosPractice=mergeDesmosPractice(existing.desmosPractice,incoming.desmosPractice);
 out.rushRounds=mergeRush(existing.rushRounds||[],incoming.rushRounds||[]);
 out.activeRushId=out.rushRounds.some(r=>r.id===incoming.activeRushId)?incoming.activeRushId:existing.activeRushId||null;
 const preferences=normalizePreferences(incoming.preferences)||normalizePreferences(existing.preferences);
 if(preferences)out.preferences=preferences;else delete out.preferences;
 for(const key of ['lessons','review','vocab']){out[key]={...existing[key]};for(const [id,value] of Object.entries(incoming[key]||{})){const old=out[key][id];if(!old||String(value.updatedAt||value.at||'')>=String(old.updatedAt||old.at||''))out[key][id]=value;}}
 out.saved=[...new Set([...existing.saved,...incoming.saved])];out.notes={...existing.notes,...incoming.notes};out.annotations={...existing.annotations,...incoming.annotations};out.eliminated={...existing.eliminated,...incoming.eliminated};out.challenge={...existing.challenge,...incoming.challenge};
 out.events=[...new Map([...existing.events,...incoming.events].map(e=>[e.key,e])).values()];
 const exams=new Map(existing.exams.map(e=>[e.id,e]));for(const e of incoming.exams){const old=exams.get(e.id);if(!old||e.modules.flatMap(m=>m.records).length>=old.modules.flatMap(m=>m.records).length)exams.set(e.id,e);}out.exams=[...exams.values()];
 out.scoreReports=[...new Map([...existing.scoreReports,...incoming.scoreReports].map(r=>[r.date+'|'+r.label+'|'+r.math+'|'+r.readingWriting,r])).values()];return out;
}
