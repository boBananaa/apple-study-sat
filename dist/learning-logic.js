// Evidence for learning, kept separate from repeat-question correction and effort XP.
import {gradeAnswer} from './logic.js?v=8';

export const CONFIDENCE = ['sure','unsure','guessing'];
export const METHODS = ['algebra','desmos','mental','evidence','grammar','other'];
const date = (now=new Date()) => `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
const after = (day,n) => {const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const validDate = v => typeof v==='string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
const own = (obj,key) => Object.hasOwn(obj,key);
export const skillKey = (section,skill) => encodeURIComponent(section+'|'+skill);
export const independent = r => r.correct===true && r.hintsUsed===0 && !r.revealed && r.setupCorrect===true && !r.previouslyExposed&&r.confidence!=='guessing';

export function initializeLearning(studio){
 studio.learning ??= {version:1,exposures:{},retention:{}};
 return studio.learning;
}
export function markExposure(studio,id,at=new Date().toISOString()){
 const learning=initializeLearning(studio);
 if(own(learning.exposures,id))return false;
 Object.defineProperty(learning.exposures,id,{value:at,enumerable:true,writable:true,configurable:true});
 return true;
}
export function scheduleRetention(studio,question,at=new Date().toISOString()){
 const learning=initializeLearning(studio),key=skillKey(question.section,question.skill);
 // More daily practice must not keep pushing an already scheduled check away.
 if(!own(learning.retention,key))learning.retention[key]={section:question.section,skill:question.skill,originAt:at,due:after(date(new Date(at)),3),checks:[]};
 return learning.retention[key];
}
export function newCorrection(record){
 if(record.correct && record.setupCorrect!==false)return null;
 return {stage:record.revealed?'revealed':'hint',attempts:[],hintShown:!record.revealed};
}
export function retryCorrection(record,question,{setup,answer,rule,errorType='Unknown',method='other'},at=new Date().toISOString()){
 if(!record.correction || !['hint','retry'].includes(record.correction.stage))throw Error('This correction is already complete.');
 if(!String(setup||'').trim() || !String(answer||'').trim() || !String(rule||'').trim())throw Error('Add your corrected approach, answer, and a rule to recognize next time.');
 const attempt={setup:String(setup).trim().slice(0,4000),answer:String(answer).trim().slice(0,100),rule:String(rule).trim().slice(0,2000),errorType:String(errorType).slice(0,100),method:METHODS.includes(method)?method:'other',correct:gradeAnswer(question,answer),assisted:true,at};
 record.correction.attempts.push(attempt);
 record.correction.stage=attempt.correct?'complete':'retry';
 record.correction.updatedAt=at;
 record.correction.error=attempt.correct?'':'That answer does not match the key. Check your setup and the requested quantity, then try again or reveal the solution.';
 return attempt;
}
export function confidenceSummary(sessions,section){
 const records=sessions.filter(s=>s.section===section&&s.type!=='assessment').flatMap(s=>s.records||[]);
 const rated=records.filter(r=>CONFIDENCE.includes(r.confidence));
 const groups=CONFIDENCE.map(confidence=>{const rows=rated.filter(r=>r.confidence===confidence);return {confidence,total:rows.length,correct:rows.filter(r=>r.correct).length,independent:rows.filter(independent).length,helped:rows.filter(r=>r.hintsUsed>0||r.revealed).length};});
 const sureMisses=rated.filter(r=>r.confidence==='sure'&&!r.correct).length;
 const uncertainCorrect=rated.filter(r=>r.correct&&r.confidence!=='sure').length;
 const focusSkills=[...new Set(rated.filter(r=>r.confidence==='sure'&&!r.correct||r.correct&&r.confidence!=='sure').map(r=>r.skill||r.exactSkill))].filter(Boolean).map(skill=>({skill,sureMisses:rated.filter(r=>(r.skill||r.exactSkill)===skill&&r.confidence==='sure'&&!r.correct).length,uncertainCorrect:rated.filter(r=>(r.skill||r.exactSkill)===skill&&r.correct&&r.confidence!=='sure').length}));
 const timings=rated.filter(r=>Number.isFinite(r.activeSeconds)&&r.activeSeconds>=0).map(r=>r.activeSeconds).sort((a,b)=>a-b);
 return {total:rated.length,unrated:records.length-rated.length,groups,sureMisses,uncertainCorrect,focusSkills,medianSeconds:timings.length?timings[Math.floor(timings.length/2)]:null,message:rated.length?`${sureMisses} sure-but-incorrect answer${sureMisses===1?'':'s'} to inspect; ${uncertainCorrect} correct answer${uncertainCorrect===1?'':'s'} marked unsure or guessing. Confidence is a reflection tool, not a score estimate.`:'Rate your confidence before checking an answer. Earlier attempts without a rating stay unrated.'};
}
export function freshRetentionQuestions(studio,questions,taken,entry,count=3){
 const exposures=initializeLearning(studio).exposures;
 return questions.filter(q=>q.section===entry.section&&q.skill===entry.skill&&q.difficulty!=='Hard'&&!taken.has(q.id)&&!own(exposures,q.id))
  .sort((a,b)=>Number(b.difficulty==='Medium')-Number(a.difficulty==='Medium')||String(a.id).localeCompare(String(b.id))).slice(0,count);
}
export function retentionSummary(studio,questions,taken,section,today=date()){
 const learning=initializeLearning(studio);
 const items=Object.entries(learning.retention).filter(([,e])=>e.section===section).map(([id,e])=>{
  const available=freshRetentionQuestions(studio,questions,taken,e).length;
  const latest=e.checks.at(-1),due=e.due<=today;
  return {id,skill:e.skill,section:e.section,due:e.due,available,checks:e.checks.length,passed:latest?.passed===true,status:due?(available>=3?'due':'needs-library'):'scheduled'};
 }).sort((a,b)=>a.due.localeCompare(b.due)||a.skill.localeCompare(b.skill));
 return {items,dueCount:items.filter(i=>i.status==='due').length,pendingCount:items.filter(i=>i.status==='scheduled').length,blockedCount:items.filter(i=>i.status==='needs-library').length,verifiedCount:items.filter(i=>i.passed).length,nextDueLabel:items.filter(i=>i.due>today).at(0)?.due||'',emptyReason:items.length?'':'Complete a practice question to schedule a fresh check three days later.'};
}
export function finishRetention(studio,session,today=date()){
 if(session.type!=='retention'||!session.completed||session.retentionFinalized)return null;
 const learning=initializeLearning(studio),entry=learning.retention[session.retentionKey];
 if(!entry || session.records.some(r=>r.correct&&r.setupCorrect===null&&!r.revealed))return null;
 if(entry.checks.some(c=>c.sessionId===session.id)){session.retentionFinalized=true;return null;}
 // A stale/malformed backup cannot certify a check before its original due day.
 const valid=session.retentionDue && today>=session.retentionDue && session.questionIds.length>=3 && new Set(session.questionIds).size===session.questionIds.length && session.records.every(r=>r.section===entry.section&&r.skill===entry.skill&&session.questionIds.includes(r.questionId));
 const n=session.records.filter(independent).length;
 const passed=Boolean(valid&&session.records.length===session.questionIds.length&&n===session.records.length);
 const result={sessionId:session.id,date:today,passed,independent:n,total:session.records.length,questionIds:[...session.questionIds]};
 if(!entry.checks.some(c=>c.sessionId===session.id))entry.checks.push(result);
 entry.due=after(today,passed?7:1);entry.checks=entry.checks.slice(-60);session.retentionFinalized=true;
 return result;
}

export function validateLearning(value,questions){
 if(value===undefined)return {version:1,exposures:{},retention:{}};
 if(!value||value.version!==1||!value.exposures||!value.retention||Array.isArray(value.exposures)||Array.isArray(value.retention))throw Error('Invalid learning evidence in backup.');
 const allowed=new Set(questions.map(q=>q.id)),out={version:1,exposures:{},retention:{}};
 for(const [id,at] of Object.entries(value.exposures)){
  if(!allowed.has(id))continue;
  if(!Number.isFinite(Date.parse(at)))throw Error('Invalid exposure date in backup.');
  Object.defineProperty(out.exposures,id,{value:at,enumerable:true,writable:true,configurable:true});
 }
 for(const [key,e] of Object.entries(value.retention)){
  if(!e||!['Math','Reading and Writing'].includes(e.section)||typeof e.skill!=='string'||key!==skillKey(e.section,e.skill)||!validDate(e.due)||!Number.isFinite(Date.parse(e.originAt))||!Array.isArray(e.checks)||e.checks.length>60)throw Error('Invalid delayed check in backup.');
  for(const c of e.checks)if(typeof c.sessionId!=='string'||!validDate(c.date)||typeof c.passed!=='boolean'||!Number.isInteger(c.independent)||!Number.isInteger(c.total)||c.independent<0||c.total<1||c.independent>c.total||!Array.isArray(c.questionIds)||c.questionIds.some(id=>!allowed.has(id)))throw Error('Invalid delayed-check result in backup.');
  out.retention[key]=structuredClone(e);
 }
 return out;
}
export function mergeLearning(a,b){
 const out=structuredClone(a);
 for(const [id,at] of Object.entries(b.exposures))if(!own(out.exposures,id)||at<out.exposures[id])Object.defineProperty(out.exposures,id,{value:at,enumerable:true,writable:true,configurable:true});
 for(const [key,e] of Object.entries(b.retention)){
  const old=out.retention[key];if(!old){out.retention[key]=structuredClone(e);continue;}
  const checks=[...new Map([...old.checks,...e.checks].map(c=>[c.sessionId,c])).values()].sort((x,y)=>x.date.localeCompare(y.date)).slice(-60);
  out.retention[key]={...old,checks,due:checks.length?after(checks.at(-1).date,checks.at(-1).passed?7:1):(old.due<e.due?old.due:e.due)};
 }
 return out;
}
export function validateLearningRecords(sessions){
 for(const s of sessions)for(const r of s.records||[]){
  if(r.confidence!==undefined&&!CONFIDENCE.includes(r.confidence))throw Error('Invalid confidence rating in backup.');
  if(r.activeSeconds!==undefined&&(!Number.isFinite(r.activeSeconds)||r.activeSeconds<0))throw Error('Invalid active practice time in backup.');
  if(!r.correction)continue;
  const c=r.correction;if(!['hint','retry','complete','revealed','skipped'].includes(c.stage)||!Array.isArray(c.attempts)||c.attempts.length>100)throw Error('Invalid correction in backup.');
  for(const a of c.attempts)if(typeof a.setup!=='string'||a.setup.length>4000||typeof a.answer!=='string'||a.answer.length>100||typeof a.rule!=='string'||a.rule.length>2000||typeof a.correct!=='boolean'||a.assisted!==true||!Number.isFinite(Date.parse(a.at)))throw Error('Invalid correction attempt in backup.');
 }
}

export function mergeLearningSessions(existing,incoming){
 const out=structuredClone(existing);
 for(const session of incoming){
  const old=out.find(s=>s.id===session.id);
  if(!old){out.push(structuredClone(session));continue;}
  if(JSON.stringify(old.questionIds)!==JSON.stringify(session.questionIds)||old.section!==session.section)throw Error('Conflicting session in backup.');
  for(const r of session.records){
   const first=old.records.find(x=>x.questionId===r.questionId);
   if(!first){old.records.push(structuredClone(r));continue;}
   if(first.answer!==r.answer||first.correct!==r.correct||first.revealed!==r.revealed)throw Error('Conflicting first attempt in backup.');
   if(String(r.approachReviewedAt||'')>String(first.approachReviewedAt||'')||first.setupCorrect===null&&r.setupCorrect!==null){first.setupCorrect=r.setupCorrect;first.approachReviewedAt=r.approachReviewedAt;}
   if(r.correction){
    if(!first.correction)first.correction=structuredClone(r.correction);
    else {
     const a=first.correction,b=r.correction;
     const attempts=[...new Map([...a.attempts,...b.attempts].map(x=>[x.at+'|'+x.answer+'|'+x.setup,x])).values()].sort((x,y)=>x.at.localeCompare(y.at));
     first.correction={...(String(b.updatedAt||'')>String(a.updatedAt||'')?b:a),attempts};
    }
   }
  }
  if(session.index>old.index){old.index=session.index;old.drafts=structuredClone(session.drafts);}
  if(session.completed){old.completed=true;old.completedAt=session.completedAt;}
  if(session.retentionFinalized)old.retentionFinalized=true;
 }
 return out;
}
