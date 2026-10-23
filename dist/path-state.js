// Portable Home plans contain references to real work, never future question reservations.
import {SECTIONS,validDate} from './planner.js?v=10';
const kinds=['resume-assessment','resume-practice','correction','retention','lesson','practice','bank-setup','vocabulary','official-baseline','official-checkpoint'];
const scopes=[...SECTIONS,'Both'];
const plain=value=>value&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const copy=value=>JSON.parse(JSON.stringify(value));
const fail=()=>{throw Error('Invalid saved Home path.');};
const validActive=(active,days)=>plain(active)&&typeof active.key==='string'&&typeof active.taskId==='string'&&Object.hasOwn(days,active.key)&&days[active.key]?.tasks?.some(task=>task.id===active.taskId);
const activeReference=(active,days)=>validActive(active,days)?{key:active.key,taskId:active.taskId}:null;
export function validateHomePath(value){
 if(value==null)return {version:1,days:{}};
 if(!plain(value)||value.version!==1||!plain(value.days)||Object.keys(value.days).length>2000)fail();
 const days={};
 for(const [key,day] of Object.entries(value.days)){
  if(!plain(day)||!validDate(day.date)||!scopes.includes(day.scope)||key!==day.date+'|'+day.scope||!SECTIONS.includes(day.section)||!Array.isArray(day.tasks)||day.tasks.length>12)fail();
  const ids=new Set();
  for(const task of day.tasks){
   if(!plain(task)||typeof task.id!=='string'||!task.id||task.id.length>500||ids.has(task.id)||!kinds.includes(task.kind)||!['pending','complete','blocked'].includes(task.status)||!scopes.includes(task.section))fail();
   ids.add(task.id);
   for(const field of ['title','description','skill','lessonId','questionId','sessionId','examId','retentionKey','reportId','checkpointDate'])if(task[field]!=null&&(typeof task[field]!=='string'||task[field].length>4000))fail();
   for(const field of ['count','minutes','reviewAttempts','checkCount'])if(task[field]!=null&&(!Number.isInteger(task[field])||task[field]<0||task[field]>1000))fail();
   if(task.checkpointDate!=null&&!validDate(task.checkpointDate))fail();
   if(Object.hasOwn(task,'questionIds')||task.tentative)fail();
   if(task.completion!=null&&(!plain(task.completion)||JSON.stringify(task.completion).length>12000))fail();
   if(task.bankIds&&(!Array.isArray(task.bankIds)||task.bankIds.length>30000||task.bankIds.some(id=>typeof id!=='string'||id.length>500)))fail();
   if(task.vocabBaseline&&(!plain(task.vocabBaseline)||JSON.stringify(task.vocabBaseline).length>100000))fail();
  }
  days[key]=copy(day);
 }
 const active=activeReference(value.active,days);
 return {version:1,days,...(active?{active}:{})};
}
export function mergeHomePath(existing,incoming){
 const old=validateHomePath(existing),next=validateHomePath(incoming),days={...old.days};
 for(const [key,day] of Object.entries(next.days)){
  if(!days[key]){days[key]=copy(day);continue;}
  const base=days[key],byId=new Map(base.tasks.map(task=>[task.id,task]));
  for(const task of day.tasks){
   const previous=byId.get(task.id);
   if(!previous||previous.status!=='complete'&&task.status==='complete')byId.set(task.id,copy(task));
   else if(previous.status!=='complete'&&!previous.sessionId&&!previous.examId&&(task.sessionId||task.examId))byId.set(task.id,copy(task));
  }
  const all=[...byId.values()],complete=all.filter(task=>task.status==='complete'),launched=all.filter(task=>task.status!=='complete'&&(task.sessionId||task.examId));
  const kept=[...complete,...launched],remaining=all.filter(task=>!kept.includes(task));
  // Preserve actual completions from both browsers; keep at most three unstarted recommendations.
  base.tasks=[...kept,...remaining.slice(0,Math.max(0,3-kept.length))];delete base.signature;
 }
 const active=activeReference(old.active,days)||activeReference(next.active,days);
 return {version:1,days,...(active?{active}:{})};
}
