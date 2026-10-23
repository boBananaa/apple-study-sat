// The Home path stores work descriptors. Fresh questions are selected only when work starts.
import {SECTIONS,addDays,localDate,validDate,rankSkills} from './planner.js?v=10';
import {freshRetentionQuestions} from './learning-logic.js?v=10';
import {reviewQueue,examTaken} from './studio-logic.js?v=10';
import {stableSession} from './logic.js?v=10';
import {resultsGate,rankRoadmapSkills,buildResultsRoadmap} from './results-logic.js?v=10';

const scopes=[...SECTIONS,'Both'];
const dateOf=value=>typeof value==='string'?value.slice(0,10):'';
const task=(kind,fields={})=>({id:kind+'-'+String(fields.examId||fields.sessionId||fields.questionId||fields.retentionKey||fields.lessonId||fields.skill||fields.section||'today'),kind,status:'pending',...fields});
const clone=value=>JSON.parse(JSON.stringify(value));
const allowed=(scope,section)=>scope==='Both'||scope===section||section==='Both';

function settingsFor(state,preferences,today,scope){
 const input=preferences||state.routine||{};
 const days=Array.isArray(input.days)?[...new Set(input.days.filter(day=>Number.isInteger(day)&&day>=0&&day<=6))].sort():[0,1,2,3,4,5,6];
 const rawDate=Object.hasOwn(input,'testDate')?input.testDate:state.profile?.testDate;
 const testDate=validDate(rawDate)&&rawDate>today?rawDate:null;
 return {scope:scopes.includes(scope)?scope:'Math',days,minutes:Number.isFinite(Number(input.minutes))?Math.max(15,Math.min(120,Math.round(Number(input.minutes)))):20,startDate:validDate(input.startDate)?input.startDate:null,testDate,enteredTestDate:validDate(rawDate)?rawDate:null};
}
function freshPool(state,questions,history,section,skill,hard=false,band=null){
 hard=!!hard&&(state.sessions||[]).some(session=>session.section===section&&stableSession(session));
 const preferred=hard?'Hard':band?.band<=3?'Easy':'Medium';
 const taken=examTaken(state,history);
 return questions.filter(q=>q.section===section&&q.skill===skill&&!taken.has(q.id)&&(hard||q.difficulty!=='Hard'))
  .sort((a,b)=>Number(b.difficulty===preferred)-Number(a.difficulty===preferred)||String(a.id).localeCompare(String(b.id)));
}
function sectionFor(state,settings,date){
 if(settings.scope!=='Both')return settings.scope;
 const priorities=buildResultsRoadmap({state,today:date,testDate:settings.testDate,scope:settings.scope}).sections;
 // Give the section with the larger remaining score gap two of every three study days.
 if(priorities.length===2&&priorities[0].gap>=(priorities[1].gap||0)+40){
  const studied=Object.values(state.studio?.homePath?.days||{}).filter(day=>day.scope==='Both'&&day.date<date&&!day.restDay&&day.tasks?.some(t=>t.kind==='practice'||t.kind==='lesson')).length;
  return priorities[studied%3===2?1:0].section;
 }
 const previous=Object.values(state.studio?.homePath?.days||{}).filter(day=>day.scope==='Both'&&day.date<date&&!day.restDay).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
 if(previous)return previous.section==='Math'?'Reading and Writing':'Math';
 const completed=(state.sessions||[]).filter(s=>s.completed&&s.type!=='assessment'&&SECTIONS.includes(s.section)).sort((a,b)=>String(a.completedAt||a.createdAt||'').localeCompare(String(b.completedAt||b.createdAt||''))).at(-1);
 return completed?.section==='Math'?'Reading and Writing':completed?.section==='Reading and Writing'?'Math':SECTIONS.includes(state.section)?state.section:'Math';
}
function pausedTask(state,scope){
 const exams=(state.studio?.exams||[]).filter(e=>['active','between','break'].includes(e.status)&&allowed(scope,e.section));
 const exam=exams.find(e=>e.id===state.studio?.activeExamId)||exams.at(-1);
 if(exam)return task('resume-assessment',{examId:exam.id,section:exam.modules?.[exam.moduleIndex]?.section||exam.section,title:'Continue your assessment',description:'Your answers and place are saved. Continue the current module or break.'});
 const sessions=(state.sessions||[]).filter(s=>!s.completed&&!s.abandoned&&s.type!=='assessment'&&allowed(scope,s.section)&&s.questionIds?.length);
 const session=sessions.find(s=>s.id===state.activeId)||sessions.at(-1);
 return session?task('resume-practice',{sessionId:session.id,section:session.section,skill:session.planSkills?.[0],count:Math.max(0,session.questionIds.length-(session.records||[]).length),title:'Continue your saved set',description:'Finish the questions you already started. Your first answers and hints are saved.'}):null;
}
function focusFor({state,questions,history,lessons,section,today}){
 const ranks=rankRoadmapSkills({state,section,questions,today});
 const candidates=ranks.map(rank=>({...rank,available:freshPool(state,questions,history,section,rank.skill,rank.stable,rank.domainBand).length,lesson:lessons.find(l=>l.section===section&&l.skill===rank.skill&&!state.studio?.lessons?.[l.id]?.completed)}));
 // Use the highest-priority skill with a full fresh set; a short remainder is honest fallback.
 return candidates.find(r=>r.available>=5)||candidates.find(r=>r.available>0)||candidates.find(r=>r.lesson&&!state.studio?.lessons?.[r.lesson.id]?.completed)||candidates.find(r=>r.lesson)||candidates[0];
}
function dailyTasks(input,settings,date,section,{preview=false,restDay=false}={}){
 const {state,questions,history,lessons}=input;
 const resume=preview?null:pausedTask(state,settings.scope);
 if(restDay)return resume?[{...resume,optional:true}]:[];
 const roadmap=buildResultsRoadmap({state,today:input.today||date,testDate:settings.testDate,scope:settings.scope});
 const checkpointForDay=preview?roadmap.checkpoints.find(checkpoint=>checkpoint.date===date):roadmap.checkpointDue?roadmap.nextCheckpoint:null;
 if(checkpointForDay){
  const checkpoint=task('official-checkpoint',{section:'Both',checkpointDate:checkpointForDay.date,reportId:roadmap.reportId,title:'Take an official Bluebook SAT practice test',description:'Take a fresh full-length SAT test in Bluebook. Then enter its section scores and all eight domain bands to update your roadmap. Set aside about 2 hours 24 minutes, including the 10-minute break.',minutes:144,official:true});
  return (resume?[resume,checkpoint]:[checkpoint]).map(item=>preview?{...item,tentative:true,status:'upcoming'}:item);
 }
 const result=resume?[resume]:[];
 const reviews=reviewQueue({...state,sessions:[{records:history.map(r=>({...r,hintsUsed:r.hintsUsed??(r.assistance==='hinted'?1:0)}))},...(state.sessions||[])]},questions,date)
  .filter(item=>item.due&&allowed(settings.scope,item.question.section));
 const correction=reviews[0];
 if(correction)result.push(task('correction',{section:correction.question.section,skill:correction.question.skill,questionId:correction.question.id,title:'Rework one earlier question',description:correction.reason+'. Write the corrected approach and a rule for next time.',reviewAttempts:correction.progress?.attempts?.length||0}));
 const taken=examTaken(state,history);
 const retention=Object.entries(state.studio?.learning?.retention||{}).filter(([,entry])=>allowed(settings.scope,entry.section)&&entry.due<=date)
  .sort((a,b)=>a[1].due.localeCompare(b[1].due)||a[0].localeCompare(b[0]));
 const due=retention.find(([,entry])=>freshRetentionQuestions(state.studio,questions,taken,entry).length>=3);
 if(due)result.push(task('retention',{retentionKey:due[0],section:due[1].section,skill:due[1].skill,count:3,title:'Check a skill after a gap',description:'Three fresh questions, untimed. First answers determine this check.',checkCount:due[1].checks?.length||0,freshAvailable:freshRetentionQuestions(state.studio,questions,taken,due[1],30000).length}));
 const focus=focusFor({...input,section,today:date});
 if(focus?.lesson&&!state.studio?.lessons?.[focus.lesson.id]?.completed)result.push(task('lesson',{lessonId:focus.lesson.id,section,skill:focus.skill,minutes:focus.lesson.minutes,title:focus.lesson.title,description:'Review the method and complete its short lesson check.'}));
 if(focus?.available){
  const count=Math.min(5,focus.available);
  result.push(task('practice',{section,skill:focus.skill,planDate:date,count,title:'Practice '+focus.skill,description:count===5?'Five fresh questions, one at a time. Save your setup or reasoning before checking.':`Finish the ${count} fresh question${count===1?'':'s'} remaining for this skill.`,reason:focus.reason,freshAvailable:focus.available}));
 }else{
  if(!result.some(item=>item.kind==='lesson')){
   const lesson=lessons.find(l=>l.section===section&&!state.studio?.lessons?.[l.id]?.completed);
   if(lesson)result.push(task('lesson',{lessonId:lesson.id,section,skill:lesson.skill,minutes:lesson.minutes,title:lesson.title,description:'Study a worked example and check your understanding. Lessons remain available without a question library.',revisit:!!state.studio?.lessons?.[lesson.id]?.completed}));
  }
  if(section==='Reading and Writing')result.push(task('vocabulary',{section,count:5,title:'Review five vocabulary words',description:'Recall a meaning, then rate each word to schedule its next review.',vocabBaseline:Object.fromEntries(Object.entries(state.studio?.vocab||{}).map(([id,item])=>[id,item.updatedAt||'']))}));
  result.push(task('bank-setup',{section,title:questions.some(q=>q.section===section)?'Add fresh questions':'Load your question library',description:questions.some(q=>q.section===section)?'The available skills have no fresh questions. Add more official questions in Settings.':'Import your official question PDFs in Settings to unlock practice and fresh checks.'}));
 }
 const chosen=[];let remaining=settings.minutes;
 for(const item of result){
  if(chosen.length===3)break;
  if(item.kind==='practice'){
   const count=Math.min(item.count,Math.floor(remaining/3));
   if(count<Math.min(3,item.count))continue;
   item.count=count;item.minutes=count*3;
   item.description=`${count} fresh question${count===1?'':'s'}, one at a time. Save your setup or reasoning before checking.`;
  }else item.minutes=item.minutes||(item.kind==='retention'?9:item.kind==='correction'?5:item.kind==='vocabulary'?5:item.kind==='bank-setup'?3:item.kind==='resume-practice'?Math.max(3,item.count*3):settings.minutes);
  const resume=item.kind.startsWith('resume-');
  if(!resume&&item.minutes>remaining)continue;
  chosen.push(item);remaining=Math.max(0,remaining-item.minutes);
 }
 return chosen.map(item=>preview?{...item,tentative:true,status:'upcoming'}:item);
}
function signatureFor(state,settings,questions,history){
 // Recording today's planned work changes completion, not the scope of today's work.
 const value=JSON.stringify([settings,state.diagnostics||[],state.studio?.officialResults||null,questions.map(q=>[q.id,q.section,q.skill,q.difficulty]),history.map(r=>r.questionId)]);
 let hash=2166136261;for(let i=0;i<value.length;i++)hash=Math.imul(hash^value.charCodeAt(i),16777619);return (hash>>>0).toString(16);
}
function pendingFreshChanged(day,state,questions,history){
 let changed=false;
 for(const item of day.tasks){
  if(item.status==='complete'||item.sessionId||item.examId||!['practice','retention'].includes(item.kind))continue;
  let available=0;
  if(item.kind==='practice'){
   const rank=rankSkills({section:item.section,diagnostics:state.diagnostics||[],sessions:state.sessions||[],questions}).find(rank=>rank.skill===item.skill);
   available=freshPool(state,questions,history,item.section,item.skill,rank?.stable).length;
  }else{
   const entry=state.studio.learning.retention?.[item.retentionKey];
   if(entry)available=freshRetentionQuestions(state.studio,questions,examTaken(state,history),entry,30000).length;
  }
  if(item.freshAvailable==null)item.freshAvailable=available;
  if(available!==item.freshAvailable||available<(item.count||3))changed=true;
 }
 return changed;
}
function reconcile(day,state,questions,today=localDate()){
 for(const item of day.tasks){
  if(item.status==='complete')continue;
  let completion=null;
  if(item.kind==='official-checkpoint'){const report=resultsGate(state,{today}).report;if(report?.source==='official-bluebook'&&report.id!==item.reportId&&report.date>=item.checkpointDate)completion={reportId:report.id,at:report.enteredAt};}
  if(item.sessionId){const session=(state.sessions||[]).find(s=>s.id===item.sessionId);if(session?.completed)completion={sessionId:session.id,at:session.completedAt||null};}
  if(item.examId){const exam=(state.studio?.exams||[]).find(e=>e.id===item.examId);if(exam?.status==='complete')completion={examId:exam.id,at:exam.completedAt||null};}
  if(item.kind==='lesson'){const reviewed=state.studio?.lessons?.[item.lessonId];if(reviewed?.completed&&(!item.revisit||dateOf(reviewed.at)>=day.date))completion={lessonId:item.lessonId,at:reviewed.at||null};}
  if(item.kind==='correction'){const review=state.studio?.review?.[item.questionId];if((review?.attempts?.length||0)>item.reviewAttempts)completion={questionId:item.questionId,at:review.updatedAt||null};}
  if(item.kind==='retention'){const checks=state.studio?.learning?.retention?.[item.retentionKey]?.checks||[];if(checks.length>item.checkCount)completion={retentionKey:item.retentionKey,sessionId:checks.at(-1).sessionId};}
  if(item.kind==='vocabulary'){const changed=Object.entries(state.studio?.vocab||{}).filter(([id,word])=>word.updatedAt&&word.updatedAt!==(item.vocabBaseline||{})[id]&&dateOf(word.updatedAt)>=day.date);if(changed.length>=item.count)completion={wordIds:changed.map(([id])=>id)};}
  if(item.kind==='bank-setup'&&questions.some(q=>q.section===item.section)&&(!item.bankIds||questions.some(q=>q.section===item.section&&!item.bankIds.includes(q.id))))completion={libraryLoaded:true};
  if(completion){item.status='complete';item.completion=completion;}
 }
}

export function buildHomePath({state,questions=[],history=[],lessons=[],today=localDate(),scope=state.routine?.scope||state.section||'Math',preferences=state.routine,previewDays=4}){
 if(!validDate(today))throw Error('Home needs a valid local date.');
 state.studio??={};state.studio.learning??={version:1,exposures:{},retention:{}};
 state.studio.homePath??={version:1,days:{}};
 const settings=settingsFor(state,preferences,today,scope),key=today+'|'+settings.scope;
 const gate=resultsGate(state,{today}),roadmap=buildResultsRoadmap({state,today,testDate:settings.testDate,scope:settings.scope});
 if(settings.enteredTestDate&&settings.enteredTestDate<=today){
  const resume=pausedTask(state,settings.scope),tasks=resume?[{...resume,optional:true,ephemeral:true}]:[];
  return {key,date:today,scope:settings.scope,section:settings.scope==='Both'?'Math':settings.scope,restDay:false,tasks,currentTask:tasks[0]||null,status:resume?'ready':'complete',label:'Today',calendarEnabled:false,testDate:settings.enteredTestDate,needsTestDate:false,needsNewTestDate:true,examDateReached:true,minutes:settings.minutes,upcoming:[],gate:{...gate,ready:false,reason:'test-date-reached',nextAction:'update-test-date',message:'Your entered SAT date has arrived. Review your results or enter your next SAT date to start another study roadmap.'},roadmap};
 }
 if(!gate.ready){
  const resume=pausedTask(state,settings.scope),baseline=task('official-baseline',{section:'Both',title:'Add your latest official SAT results',description:gate.message,minutes:5,ephemeral:true});
  const tasks=resume?[{...resume,optional:true,ephemeral:true},baseline]:[baseline];
  return {key,date:today,scope:settings.scope,section:settings.scope==='Both'?'Math':settings.scope,restDay:false,tasks,currentTask:tasks[0],status:'ready',label:'Today',calendarEnabled:false,testDate:settings.testDate,needsTestDate:!settings.testDate,minutes:settings.minutes,upcoming:[],gate,roadmap};
 }
 const restDay=!settings.days.includes(new Date(today+'T12:00:00Z').getUTCDay())||!!settings.startDate&&today<settings.startDate;
 const input={state,questions,history,lessons,today};
 let day=state.studio.homePath.days[key];
 if(!day){
  const section=sectionFor(state,settings,today);
  day={key,date:today,scope:settings.scope,section,restDay,createdAt:today,tasks:dailyTasks(input,settings,today,section,{restDay})};
  for(const item of day.tasks)if(item.kind==='bank-setup')item.bankIds=questions.filter(q=>q.section===item.section).map(q=>q.id);
  day.signature=signatureFor(state,settings,questions,history);day.signatureVersion=2;
  state.studio.homePath.days[key]=day;
 }
 reconcile(day,state,questions,today);
 const signature=signatureFor(state,settings,questions,history);
 // Adopt the narrower signature for older saved paths without adding new work on upgrade.
 if(day.signatureVersion!==2){day.signature=signature;day.signatureVersion=2;}
 const availabilityChanged=pendingFreshChanged(day,state,questions,history);
 if((day.signature!==signature||availabilityChanged)&&!(day.tasks.length&&day.tasks.every(item=>item.status==='complete'))){
  const preserved=day.tasks.filter(item=>item.status==='complete'||item.sessionId||item.examId);
  // Keep completed evidence and launched work; only unstarted recommendations adapt.
  const budget=Math.max(0,settings.minutes-preserved.reduce((sum,item)=>sum+(item.minutes||0),0));
  const desired=dailyTasks(input,{...settings,minutes:budget},today,day.section,{restDay}).filter(item=>!preserved.some(old=>old.id===item.id||old.sessionId&&old.sessionId===item.sessionId||old.examId&&old.examId===item.examId));
  const pending=desired.slice(0,Math.max(0,3-preserved.length)).map(item=>{
   const old=day.tasks.find(old=>old.id===item.id);
   return old?{...old,...item}:item;
  });
  day.tasks=[...preserved,...pending];day.signature=signature;
  for(const item of day.tasks)if(item.kind==='bank-setup'&&!item.bankIds)item.bankIds=questions.filter(q=>q.section===item.section).map(q=>q.id);
 }
 // A set started elsewhere takes priority without replacing already completed work.
 const resume=pausedTask(state,settings.scope);
 if(resume&&!day.tasks.some(item=>item.sessionId===resume.sessionId&&resume.sessionId||item.examId===resume.examId&&resume.examId)){
  const replace=day.tasks.map((item,i)=>({item,i})).reverse().find(({item})=>item.status!=='complete'&&!item.sessionId&&!item.examId);
  if(day.tasks.length<3)day.tasks.unshift(resume);
  else if(replace){day.tasks.splice(replace.i,1);day.tasks.unshift(resume);}
 }
 const upcoming=[];
 if(settings.testDate&&settings.days.length){
  let section=day.section;
  for(let date=addDays(today,1);date<settings.testDate&&date<=addDays(today,365)&&upcoming.length<Math.max(0,Math.min(14,previewDays));date=addDays(date,1)){
   if(!settings.days.includes(new Date(date+'T12:00:00Z').getUTCDay())||settings.startDate&&date<settings.startDate)continue;
   if(settings.scope==='Both')section=section==='Math'?'Reading and Writing':'Math';
   upcoming.push({key:date+'|'+settings.scope,date,section,tentative:true,status:'upcoming',tasks:dailyTasks(input,settings,date,section,{preview:true})});
  }
 }
 day.restDay=restDay;
 if(!restDay&&!day.tasks.length)day.tasks=dailyTasks(input,settings,today,day.section);
 const tasks=clone(day.tasks).filter(item=>!restDay||item.status==='complete'||item.sessionId||item.examId).map(item=>restDay?{...item,optional:true}:item);
 // Extra work started independently can resume without expanding the saved daily plan.
 if(resume&&!tasks.some(item=>resume.sessionId&&item.sessionId===resume.sessionId||resume.examId&&item.examId===resume.examId))tasks.unshift({...resume,optional:true,ephemeral:true});
 const resumed=resume&&tasks.find(item=>item.status!=='complete'&&(resume.sessionId&&item.sessionId===resume.sessionId||resume.examId&&item.examId===resume.examId));
 const currentTask=resumed||tasks.find(item=>item.status!=='complete'&&item.status!=='blocked')||null;
 const {signature:ignoredSignature,signatureVersion:ignoredVersion,...viewDay}=day;
 return {...clone(viewDay),tasks,currentTask,status:restDay?'rest':currentTask?'ready':'complete',label:settings.testDate?today:'Today',calendarEnabled:!!settings.testDate,testDate:settings.testDate,needsTestDate:!settings.testDate,minutes:settings.minutes,upcoming,gate,roadmap};
}

export function selectHomeTaskQuestions({task,state,questions=[],history=[]}){
 if(!task||task.status==='complete'||task.sessionId)return[];
 if(task.kind==='retention'){
  const entry=state.studio?.learning?.retention?.[task.retentionKey];
  if(!entry)return[];
  const chosen=freshRetentionQuestions(state.studio,questions,examTaken(state,history),entry,3);
  return chosen.length===3?chosen.map(q=>q.id):[];
 }
 if(task.kind!=='practice')return[];
 const rank=rankRoadmapSkills({state,section:task.section,questions,today:task.planDate||localDate()}).find(r=>r.skill===task.skill)||rankSkills({section:task.section,diagnostics:state.diagnostics||[],sessions:state.sessions||[],questions}).find(r=>r.skill===task.skill);
 return freshPool(state,questions,history,task.section,task.skill,rank?.stable,rank?.domainBand).slice(0,task.count||5).map(q=>q.id);
}
export function bindHomeTask(state,key,taskId,reference){
 const item=state.studio?.homePath?.days?.[key]?.tasks.find(item=>item.id===taskId);
 if(!item||item.status==='complete')return false;
 if(reference?.sessionId)item.sessionId=reference.sessionId;
 else if(reference?.examId)item.examId=reference.examId;
 else return false;
 return true;
}
export function completeHomeTask(state,key,taskId,completion){
 const item=state.studio?.homePath?.days?.[key]?.tasks.find(item=>item.id===taskId);
 if(!item||!completion||typeof completion!=='object')return false;
 item.status='complete';item.completion=clone(completion);return true;
}
