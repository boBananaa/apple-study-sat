// Standalone answer-only speed practice. Rush results never establish lesson mastery.
const SECTIONS=['Math','Reading and Writing'],PACES={relaxed:1.5,standard:1,fast:.75},COUNTS=[5,10,20],DIFFICULTIES=['Easy','Medium','Hard'];
const OPEN=['active','feedback'];
let sequence=0;
const clone=value=>JSON.parse(JSON.stringify(value));
const plain=value=>value&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const validTime=value=>Number.isFinite(value)&&value>=0&&Number.isFinite(new Date(value).getTime());
const nowTime=value=>{if(!validTime(value))throw Error('Rush needs a valid clock time.');return value;};
const freezeResult=result=>Object.freeze({...result,source:Object.freeze({...result.source})});
const clockSeconds=(section,pace)=>(section==='Math'?95:71)*PACES[pace];
const starsFor=(correct,elapsed,limit)=>!correct?0:elapsed<=limit*.5?3:elapsed<=limit*.8?2:1;
function metadata(q){return {id:q.id,section:q.section,skill:String(q.skill||'Unspecified skill').slice(0,200),exactSkill:String(q.exactSkill||q.skill||'Unspecified skill').slice(0,200),difficulty:q.difficulty,source:{id:q.id,file:String(q.file||'').slice(0,1000),page:q.page??null,question:q.number??null,...(typeof q.key?.url==='string'?{url:q.key.url.slice(0,2000)}:{})}};}
function currentMeta(round){return round.questionMeta[round.index];}
function assertRound(round){if(!round||round.version!==1||!Array.isArray(round.results)||!Array.isArray(round.questionIds))throw Error('Invalid Question Rush round.');}
export function createRush(questions,taken=new Set(),{id,section='Math',pace='standard',count=5,skill='all',difficulty='mixed',allowHard=false,now=Date.now(),seed=now}={}){
 nowTime(now);
 if(!SECTIONS.includes(section)||!Object.hasOwn(PACES,pace)||!COUNTS.includes(count)||typeof skill!=='string'||skill.length>200||!['mixed',...DIFFICULTIES].includes(difficulty)||typeof allowHard!=='boolean')throw Error('Choose a section, 5, 10, or 20 questions, and a valid Rush pace.');
 if(difficulty==='Hard'&&!allowHard)throw Error('Hard questions need your existing readiness check first.');
 const used=taken instanceof Set?taken:new Set(taken||[]),unique=new Map();
 for(const q of questions||[])if(q&&typeof q.id==='string'&&q.id&&q.id.length<=500&&q.section===section&&DIFFICULTIES.includes(q.difficulty)&&!used.has(q.id)&&(allowHard||q.difficulty!=='Hard')&&(skill==='all'||q.skill===skill)&&(difficulty==='mixed'||q.difficulty===difficulty)&&!unique.has(q.id))unique.set(q.id,q);
 const pool=[...unique.values()].sort((a,b)=>a.id.localeCompare(b.id));
 if(pool.length<count)throw Error(`This Rush needs ${count} unused questions matching your filters; ${pool.length} are available. Choose fewer questions, widen the filters, or add questions.`);
 let cursor=Number(seed)>>>0;const random=()=>{cursor=(Math.imul(1664525,cursor)+1013904223)>>>0;return cursor/4294967296;};
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const selected=pool.slice(0,count),questionIds=selected.map(q=>q.id),secondsPerQuestion=clockSeconds(section,pace);
 id=String(id||`rush-${Math.trunc(now)}-${++sequence}`);
 if(!/^[\w-]{1,100}$/.test(id))throw Error('Invalid Rush identifier.');
 return {version:1,id,section,pace,count,skill,difficulty,secondsPerQuestion,status:'active',questionIds,questionMeta:selected.map(metadata),exposedIds:[questionIds[0]],index:0,results:[],startedAt:now,questionStartedAt:now,deadline:now+secondsPerQuestion*1000,finishedAt:null,streak:0,bestStreak:0};
}
export function rushRemaining(round,now=Date.now()){
 assertRound(round);nowTime(now);return round.status==='active'?Math.max(0,Math.ceil((round.deadline-now)/1000)):0;
}
function recordAnswer(round,q,answer,grade,now,{skipped=false}={}){
 assertRound(round);nowTime(now);
 if(round.status!=='active')return round.results.find(result=>result.questionId===round.questionIds[round.index])||null;
 const meta=currentMeta(round);
 if(q&&q.id!==meta.id)throw Error('Answer the current Rush question first.');
 if(now<round.questionStartedAt)throw Error('The answer clock cannot move before this question started.');
 const timeout=now>=round.deadline;
 if(!timeout&&!skipped&&answer!=null&&!(typeof grade==='boolean'||plain(grade)&&typeof grade.correct==='boolean'||typeof grade==='function'))throw Error('Rush needs the answer grade.');
 const submittedAnswer=timeout||skipped||answer==null?null:String(answer).trim().slice(0,4000);
 const correct=!timeout&&!skipped&&submittedAnswer!==null&&submittedAnswer!==''&&(typeof grade==='function'?grade(q,submittedAnswer):typeof grade==='boolean'?grade:grade?.correct)===true;
 const elapsedMs=Math.min(round.secondsPerQuestion*1000,Math.max(0,now-round.questionStartedAt)),stars=starsFor(correct,elapsedMs,round.secondsPerQuestion*1000);
 round.streak=correct?round.streak+1:0;round.bestStreak=Math.max(round.bestStreak,round.streak);
 const result=freezeResult({questionId:meta.id,section:round.section,skill:meta.skill,exactSkill:meta.exactSkill,difficulty:meta.difficulty,source:meta.source,answer:submittedAnswer,correct,timeout,timedOut:timeout,skipped:!timeout&&skipped,stars,elapsedMs,answeredAt:now,submittedAt:new Date(now).toISOString(),streak:round.streak,mode:'rush',setupCorrect:null,setupAssessment:'rush_answer_only',hintsUsed:0,revealed:false});
 round.results.push(result);round.status='feedback';return result;
}
export function submitRushAnswer(round,q,answer,grade,now=Date.now()){return recordAnswer(round,q,answer,grade,now);}
export function skipRush(round,q,now=Date.now()){return recordAnswer(round,q,null,false,now,{skipped:true});}
export function expireRush(round,now=Date.now()){
 assertRound(round);nowTime(now);
 return round.status==='active'&&now>=round.deadline?recordAnswer(round,null,null,false,now):null;
}
export function advanceRush(round,now=Date.now()){
 assertRound(round);nowTime(now);
 // An expired question enters feedback first, even after a long absence.
 if(round.status==='active'){expireRush(round,now);return false;}
 if(round.status!=='feedback')return false;
 if(now<round.results.at(-1).answeredAt)throw Error('The next question cannot start before the previous answer.');
 if(round.index===round.questionIds.length-1){round.status='complete';round.finishedAt=now;return true;}
 round.index++;round.exposedIds.push(round.questionIds[round.index]);round.questionStartedAt=now;round.deadline=now+round.secondsPerQuestion*1000;round.status='active';return true;
}
export function endRush(round,now=Date.now()){
 assertRound(round);nowTime(now);if(!OPEN.includes(round.status))return false;
 if(now<round.questionStartedAt||round.results.length&&now<round.results.at(-1).answeredAt)throw Error('The round cannot end before its current question or answer.');
 expireRush(round,now);round.status=round.results.length===round.count?'complete':'ended';round.finishedAt=now;return true;
}
export function rushTaken(rounds=[]){
 return new Set(rounds.flatMap(round=>OPEN.includes(round.status)?round.questionIds||[]:round.exposedIds||[]));
}
export function rushSummary(round){
 assertRound(round);const results=round.results,skills=new Map();
 for(const id of round.exposedIds){const meta=round.questionMeta.find(item=>item.id===id),skill=meta.exactSkill||meta.skill;const row=skills.get(skill)||{skill,total:0,correct:0,incorrect:0,unanswered:0,timedOut:0,skipped:0,stars:0};row.total++;skills.set(skill,row);}
 for(const result of results){const skill=result.exactSkill||result.skill,row=skills.get(skill);row.correct+=Number(result.correct);row.incorrect+=Number(!result.correct&&!result.timeout&&!result.skipped&&result.answer!==null);row.timedOut+=Number(result.timeout);row.skipped+=Number(result.skipped);row.stars+=result.stars;}
 const correct=results.filter(r=>r.correct).length,incorrect=results.filter(r=>!r.correct&&!r.timeout&&!r.skipped&&r.answer!==null).length;
 const unfinishedElapsed=round.finishedAt!==null&&results.length<=round.index?Math.min(round.secondsPerQuestion*1000,Math.max(0,round.finishedAt-round.questionStartedAt)):0;
 return {id:round.id,status:round.status,section:round.section,pace:round.pace,planned:round.count,seen:round.exposedIds.length,answered:results.length,correct,incorrect,unanswered:round.exposedIds.length-correct-incorrect,unseen:round.count-round.exposedIds.length,timedOut:results.filter(r=>r.timeout).length,skipped:results.filter(r=>r.skipped).length,stars:results.reduce((sum,r)=>sum+r.stars,0),maxStars:results.length*3,bestStreak:round.bestStreak,elapsedMs:results.reduce((sum,r)=>sum+r.elapsedMs,0)+unfinishedElapsed,accuracy:round.exposedIds.length?correct/round.exposedIds.length:null,skills:[...skills.values()].map(row=>({...row,unanswered:row.total-row.correct-row.incorrect,accuracy:row.correct/row.total})),results:clone(results)};
}
const invalid=()=>{throw Error('Invalid Question Rush backup.');};
function validateRound(value,questions){
 if(!plain(value)||value.version!==1||typeof value.id!=='string'||!/^[-\w]{1,100}$/.test(value.id)||!SECTIONS.includes(value.section)||!Object.hasOwn(PACES,value.pace)||!COUNTS.includes(value.count)||!['active','feedback','complete','ended'].includes(value.status)||value.secondsPerQuestion!==clockSeconds(value.section,value.pace)||!Array.isArray(value.questionIds)||value.questionIds.length!==value.count||value.questionIds.some(id=>typeof id!=='string'||!id||id.length>500)||new Set(value.questionIds).size!==value.count||!Array.isArray(value.questionMeta)||value.questionMeta.length!==value.count||!Array.isArray(value.exposedIds)||!Array.isArray(value.results)||!Number.isInteger(value.index)||value.index<0||value.index>=value.count||!validTime(value.startedAt)||!validTime(value.questionStartedAt)||value.questionStartedAt<value.startedAt||!validTime(value.deadline)||value.deadline!==value.questionStartedAt+value.secondsPerQuestion*1000)invalid();
 if(value.exposedIds.length<value.index+1||value.exposedIds.length>value.count||value.status!=='ended'&&value.exposedIds.length!==value.index+1||value.exposedIds.some((id,index)=>id!==value.questionIds[index]))invalid();
 const bank=questions==null?null:new Map(questions.map(q=>[q.id,q]));
 for(const [index,meta] of value.questionMeta.entries()){
  if(!plain(meta)||meta.id!==value.questionIds[index]||meta.section!==value.section||typeof meta.skill!=='string'||!meta.skill||meta.skill.length>200||typeof meta.exactSkill!=='string'||!meta.exactSkill||meta.exactSkill.length>200||!DIFFICULTIES.includes(meta.difficulty)||!plain(meta.source)||meta.source.id!==meta.id||typeof meta.source.file!=='string'||meta.source.file.length>1000||meta.source.url!=null&&(typeof meta.source.url!=='string'||meta.source.url.length>2000))invalid();
  for(const field of ['page','question'])if(meta.source[field]!=null&&!(Number.isInteger(meta.source[field])&&meta.source[field]>=0||typeof meta.source[field]==='string'&&meta.source[field].length<=100))invalid();
  if(bank&&(!bank.has(meta.id)||bank.get(meta.id).section!==value.section))invalid();
 }
 if(value.results.length>value.exposedIds.length||value.status==='active'&&value.results.length!==value.index||value.status==='feedback'&&value.results.length!==value.index+1||value.status==='complete'&&value.results.length!==value.count||value.status==='ended'&&![value.index,value.index+1].includes(value.results.length))invalid();
 if(OPEN.includes(value.status)?value.finishedAt!==null:!validTime(value.finishedAt)||value.finishedAt<value.questionStartedAt)invalid();
 let streak=0,best=0,lastTime=value.startedAt;
 for(const [index,result] of value.results.entries()){
  const meta=value.questionMeta[index];
  if(!plain(result)||result.questionId!==value.questionIds[index]||result.section!==value.section||result.skill!==meta.skill||result.exactSkill!==meta.exactSkill||result.difficulty!==meta.difficulty||JSON.stringify(result.source)!==JSON.stringify(meta.source)||result.answer!==null&&(typeof result.answer!=='string'||result.answer.length>4000)||typeof result.correct!=='boolean'||typeof result.timeout!=='boolean'||result.timedOut!==result.timeout||typeof result.skipped!=='boolean'||!Number.isFinite(result.elapsedMs)||result.elapsedMs<0||result.elapsedMs>value.secondsPerQuestion*1000||!validTime(result.answeredAt)||result.answeredAt<lastTime||result.submittedAt!==new Date(result.answeredAt).toISOString()||result.stars!==starsFor(result.correct,result.elapsedMs,value.secondsPerQuestion*1000)||result.mode!=='rush'||result.setupCorrect!==null||result.setupAssessment!=='rush_answer_only'||result.hintsUsed!==0||result.revealed!==false)invalid();
  if((result.timeout||result.skipped)&&(result.correct||result.answer!==null)||result.timeout&&result.skipped||result.correct&&result.answer===null||result.timeout&&result.elapsedMs!==value.secondsPerQuestion*1000)invalid();
  streak=result.correct?streak+1:0;best=Math.max(best,streak);if(result.streak!==streak)invalid();lastTime=result.answeredAt;
 }
 if(value.streak!==streak||value.bestStreak!==best||value.results.length&&value.status==='active'&&value.questionStartedAt<lastTime||value.finishedAt!==null&&value.finishedAt<lastTime)invalid();
 const out=clone(value);out.results=out.results.map(freezeResult);return out;
}
export function validateRush(rounds,questions){
 if(rounds==null)return [];
 if(!Array.isArray(rounds)||rounds.length>500)invalid();const out=rounds.map(round=>validateRound(round,questions));if(new Set(out.map(round=>round.id)).size!==out.length)invalid();return out;
}
export function mergeRush(existing,incoming,questions){
 const left=validateRush(existing,questions),right=validateRush(incoming,questions),rounds=new Map(left.map(round=>[round.id,round]));
 for(const next of right){
  const old=rounds.get(next.id);if(!old){rounds.set(next.id,next);continue;}
  // An imported same-ID restart cannot replace the reserved order or first answers.
  if(JSON.stringify(old.questionIds)!==JSON.stringify(next.questionIds)||old.startedAt!==next.startedAt||old.section!==next.section||old.pace!==next.pace)continue;
  if(!OPEN.includes(old.status)){
   if(next.exposedIds.length>old.exposedIds.length){old.exposedIds=[...next.exposedIds];old.finishedAt=Math.max(old.finishedAt,next.finishedAt||0,next.questionStartedAt,...next.results.map(r=>r.answeredAt));}
   continue;
  }
  const prefix=old.results.every((result,index)=>JSON.stringify(result)===JSON.stringify(next.results[index]));
  if(prefix&&(next.results.length>old.results.length||next.results.length===old.results.length&&next.exposedIds.length>old.exposedIds.length||next.results.length===old.results.length&&next.exposedIds.length===old.exposedIds.length&&!OPEN.includes(next.status)))rounds.set(next.id,next);
  else if(!prefix&&next.exposedIds.length>old.exposedIds.length){
   // Conflicting answers cannot overwrite local evidence or make remotely seen IDs fresh.
   // Close this round while retaining the full exposed prefix from both backups.
   old.exposedIds=[...next.exposedIds];old.status='ended';old.finishedAt=Math.max(old.questionStartedAt,next.questionStartedAt,...old.results.map(r=>r.answeredAt),...next.results.map(r=>r.answeredAt),next.finishedAt||0);
  }
 }
 return [...rounds.values()];
}
