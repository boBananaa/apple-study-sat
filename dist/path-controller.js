import {createResultsUI} from './results-ui.js?v=10';
import {desktopSettings,isDesktop} from './desktop.js?v=10';
import {LESSONS} from './learning-content.js?v=10';
import {buildHomePath,selectHomeTaskQuestions,bindHomeTask} from './path-logic.js?v=10';
import {homePathMarkup,practiceHubMarkup} from './path-ui.js?v=10';
import {localDate,addDays,validDate,normalizeRoutine} from './planner.js?v=10';
import {examTaken,reviewQueue} from './studio-logic.js?v=10';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=(d,options={month:'short',day:'numeric'})=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{...options,timeZone:'UTC'});
const weekdays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export function createPathController(context){
 const {getState,getData,getProfile,save,render,toast,history,studio}=context;
 const state=()=>getState(),data=()=>getData();
 const results=createResultsUI({getState,getProfile,save,render,toast});
 let currentModel=null,libraryOpen=false;
 function preferences(){const s=state();return {...{scope:s.section,minutes:30,days:[1,2,3,4,5]},...s.routine,...s.studio.preferences,testDate:getProfile().testDate||s.routine?.testDate||null};}
 function model(){const p=preferences();currentModel=buildHomePath({state:state(),questions:data().questions,history:history(),lessons:LESSONS,scope:p.scope,preferences:p,previewDays:14});save();return currentModel;}
 function library(section){const qs=data().questions.filter(q=>q.section===section),used=examTaken(state(),history()),fresh=qs.filter(q=>!used.has(q.id)&&q.difficulty!=='Hard');return {state:!qs.length?'empty':!fresh.length?'depleted':'ready',message:!qs.length?'Lessons are available now. Load your own supported PDF library in Settings for official question practice.':!fresh.length?'Resume saved work, review earlier questions, or load more questions in Settings.':'',count:qs.length,fresh:fresh.length};}
 function taskView(task,next){return {...task,...(task.status!=='complete'&&task.sessionId?{title:'Continue your saved set',description:'Your place, first answers, and hints are saved.'}:{}),state:task.status==='complete'?'done':task.status==='blocked'?'blocked':task.id===next?.id?'current':'available',meta:[task.section,task.count?task.count+' questions':task.minutes?task.minutes+' min':''].filter(Boolean).join(' · ')};}
 function home(){
  const m=model(),p=getProfile(),dated=m.calendarEnabled;
  if(results.isAdding())return `<div class="path-home"><header class="path-page-heading"><h1>Update your official results</h1></header>${results.form()}</div>`;
  if(!m.gate.ready)return results.gate(m);
  const weeks=new Map();
  for(const day of m.upcoming){const week=addDays(day.date,-((new Date(day.date+'T12:00:00Z').getUTCDay()+6)%7));if(!weeks.has(week))weeks.set(week,{id:week,label:'Week of '+pretty(week),days:[]});weeks.get(week).days.push({id:day.key,dateLabel:pretty(day.date,{weekday:'short',month:'short',day:'numeric'}),title:day.tasks.some(t=>t.kind==='official-checkpoint')?'Official Bluebook practice test':day.section+' practice',description:'The recommendation adapts to your results.',state:'upcoming',tasks:day.tasks.filter(t=>t.kind!=='bank-setup').slice(0,2).map(t=>({title:t.title,meta:t.section}))});}
  const visibleTasks=m.tasks.length>3?[...m.tasks.filter(t=>t.status==='complete').slice(-2),...m.tasks.filter(t=>t.status!=='complete').slice(0,1)]:m.tasks;
  const next=m.currentTask,resuming=!!(next?.sessionId||next?.examId||next?.kind.startsWith('resume'));
  const title=next?.kind==='official-checkpoint'?'Time for an official checkpoint.':m.restDay?'A lighter day.':m.status==='complete'?'Today’s steps are complete.':resuming?'Pick up where you left off.':next?.skill?'Build confidence in '+next.skill+'.':'Start with one useful step.';
  const description=next?.kind==='official-checkpoint'?'Set aside about 2 hours 24 minutes, including the break. Enter the new report afterward to refresh your path.':m.restDay?'No new work is scheduled. You can resume a saved session or practice independently.':m.status==='complete'?'Your work is saved. The next study day will use these results.':(m.minutes+' minutes available. Follow the steps below; your approach and first answers guide what comes next.');
  return results.roadmap(m)+homePathMarkup({sectionLabel:m.scope==='Both'?'Math and Reading & Writing':m.scope,goalLabel:p.total?p.total+' goal':'',testDateLabel:dated?pretty(m.testDate,{month:'short',day:'numeric',year:'numeric'}):'',setupNeeded:!dated,today:{id:m.key,dateLabel:dated?pretty(m.date,{weekday:'short',month:'short',day:'numeric'}):'',title,description,emptyMessage:m.restDay?'Take a break today. Your next scheduled work appears below.':'You’ve completed the planned steps. Practice is available if you want more.',tasks:visibleTasks.map(t=>taskView(t,next))},weeks:[...weeks.values()],continueLabel:resuming?'Resume':'Continue',continueDisabled:!next,continueNote:next?.reason?next.reason:m.status==='complete'?'Completion records effort and outcomes; it does not certify a score.':'',library:library(m.section)});
 }
 function practice(){
  const s=state(),l=library(s.section),paused=s.sessions.find(x=>x.id===s.activeId&&!x.completed&&x.type!=='assessment'&&x.section===s.section)||s.sessions.find(x=>!x.completed&&x.type!=='assessment'&&x.section===s.section);
  const e=s.studio.exams.find(x=>['active','between','break'].includes(x.status));
  const resume=e?{id:'assessment',title:'Your assessment is in progress',description:'Continue the current module or break.'}:paused?{id:paused.id,title:'Your practice is saved',description:(paused.questionIds.length-paused.records.length)+' questions left in '+paused.section+'.'}:null;
  return practiceHubMarkup({sectionLabel:s.section,resume,library:l,items:[{id:'skills',title:'Practice a skill',description:'Choose a skill and build a fresh question set.',meta:l.fresh+' unused Easy or Medium questions',state:l.fresh?'available':'blocked'},{id:'review',title:'Review earlier questions',description:'Rework mistakes and take fresh checks when they are due.'},{id:'tests',title:'App diagnostics and simulations',description:'Practice the test-day rhythm. For official score checkpoints, use Bluebook.',state:l.count?'available':'blocked'}]});
 }
 function settings(){
  const p=getProfile(),prefs=preferences(),diagnostics=state().diagnostics||[];
  return `<div class="simple-settings"><div class="page-title"><div><h1>Settings</h1><p>Set the goal and routine that guide your daily path.</p></div></div><section class="settings-section"><h2>Your routine</h2><form id="study-settings-form"><div class="settings-form-grid"><label>Next SAT date<input name="testDate" type="date" value="${esc(prefs.testDate||'')}"></label><label>Target total score<input name="total" type="number" min="400" max="1600" step="10" value="${p.total||''}" placeholder="Optional"></label><label>Section focus<select name="scope">${['Math','Reading and Writing','Both'].map(x=>`<option ${prefs.scope===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Minutes per study day<input name="minutes" type="number" min="15" max="120" step="5" required value="${prefs.minutes}"></label></div><label class="checkpoint-spacing">Official practice test spacing<select name="checkpointInterval">${[7,14,21,28].map(n=>`<option value="${n}" ${n===(state().studio.officialResults?.checkpointPolicy?.intervalDays||14)?'selected':''}>About every ${n} days</option>`).join('')}</select></label><fieldset class="settings-weekdays"><legend>Study days</legend>${weekdays.map((label,i)=>`<label><input type="checkbox" name="days" value="${i}" ${prefs.days.includes(i)?'checked':''}><span>${label}</span></label>`).join('')}</fieldset><details class="settings-detail"><summary>Your current scores</summary><div class="settings-form-grid"><label>Math<input name="math" type="number" min="200" max="800" step="10" value="${p.math||''}" placeholder="Optional"></label><label>Reading and Writing<input name="readingWriting" type="number" min="200" max="800" step="10" value="${p.readingWriting||''}" placeholder="Optional"></label></div></details><p class="field-note">A test date enables the calendar. You can use today’s recommendation without one.</p><p id="study-settings-error" class="form-error" role="alert"></p><button class="primary" type="submit">Save routine</button></form></section>${results.settings()}${desktopSettings()}<details class="settings-section settings-detail"><summary>Additional skill diagnostics</summary><p>Add correct and total counts by skill to help choose your starting point.</p><div class="summary-actions"><button class="secondary" data-action="diagnostic-add">Add diagnostic</button><label class="secondary import-label">Import diagnostic JSON<input id="diagnostic-import" type="file" accept="application/json,.json"></label><button class="text-button" data-action="diagnostic-template">Download template</button></div>${diagnostics.map(d=>`<details class="settings-diagnostic"><summary>${esc(d.label)} · ${esc(d.section)} · ${esc(d.date)}</summary><ul>${d.rows.map(r=>`<li>${esc(r.reportedSkill||r.skill)}: ${r.correct}/${r.total}</li>`).join('')}</ul><button class="text-button" data-action="diagnostic-delete" data-id="${esc(d.id)}">Remove diagnostic</button></details>`).join('')||'<p class="small muted">No diagnostic results added yet.</p>'}</details><details id="library-settings" class="settings-section settings-detail" ${libraryOpen?'open':''}><summary>Question library and backups</summary><p>${data().questions.length.toLocaleString()} questions loaded across both sections. Your scores, notes, and progress stay in this browser.</p><div class="summary-actions">${isDesktop()?'<button class="secondary" data-action="desktop-library">Import prepared question library</button>':'<a class="secondary" href="setup.html">Load a question library</a>'}<button class="secondary" data-action="export">Export progress</button><label class="secondary import-label">Import progress backup<input id="import-file" type="file" accept="application/json,.json"></label><button class="text-button" data-action="profile">Import or edit a profile</button></div></details><section class="settings-section settings-appearance"><h2>Appearance</h2><button class="secondary" data-action="theme-toggle">${state().studio.theme==='dark'?'Use light mode':'Use dark mode'}</button></section></div>`;
 }
 function go(view){location.hash=view;render();window.scrollTo({top:0});}
 function launch(task,key){
  if(!task)return;
  if(task.status==='complete')return toast('This step is complete. Continue with the next step.');
  const s=state();s.studio.homePath.active={key,taskId:task.id};
  if(task.section==='Math'||task.section==='Reading and Writing')s.section=task.section;
  save();
  if(task.kind==='official-baseline'||task.kind==='official-checkpoint'){results.add();return;}
  if(task.kind==='resume-assessment'){s.studio.activeExamId=task.examId;save();go('tests');return;}
  if(task.kind==='resume-practice'||task.sessionId){s.activeId=task.sessionId;save();go('practice');return;}
  if(task.kind==='lesson'){studio.click('lesson-open',{dataset:{id:task.lessonId}});return;}
  if(task.kind==='correction'){location.hash='review';studio.click('review-open',{dataset:{id:task.questionId}});return;}
  if(task.kind==='retention'){const session=context.startRetention(task.retentionKey);if(session){bindHomeTask(s,key,task.id,{sessionId:session.id});save();}return;}
  if(task.kind==='practice'){
   const ids=selectHomeTaskQuestions({task,state:s,questions:data().questions,history:history()});
   if(!ids.length){toast('These questions are no longer fresh. Home will find the next useful step.');go('home');return;}
   const session=context.startPractice(ids,'path',false,{homePathKey:key,homeTaskId:task.id});
   if(session){bindHomeTask(s,key,task.id,{sessionId:session.id});save();}return;
  }
  if(task.kind==='vocabulary'){go('vocab');return;}
  if(task.kind==='bank-setup'){libraryOpen=true;go('settings');return;}
 }
 function click(action,target){
  if(results.click(action,target))return true;
  if(action==='path-setup'){go('settings');return true;}
  if(action==='library-open'){libraryOpen=true;go('settings');return true;}
  if(action==='path-continue'||action==='path-task'){const m=model();launch(action==='path-task'?m.tasks.find(t=>t.id===target.dataset.id):m.currentTask,m.key);return true;}
  if(action==='path-resume'){
   const s=state(),e=s.studio.exams.find(e=>['active','between','break'].includes(e.status));
   if(e&&target.dataset.id==='assessment'){s.studio.activeExamId=e.id;save();go('tests');}
   else {const session=s.sessions.find(x=>x.id===target.dataset.id&&!x.completed)||s.sessions.find(x=>x.id===s.activeId&&!x.completed);if(session){s.section=session.section;s.activeId=session.id;save();go('practice');}else go('home');}return true;
  }
  if(action==='practice-open'){const routes={skills:'bank',review:'review',tests:'tests',lessons:'lessons',desmos:'desmos',vocabulary:'vocab'};if(routes[target.dataset.id]){if(state().studio.homePath)state().studio.homePath.active=null;save();go(routes[target.dataset.id]);}return true;}
  return false;
 }
 function submit(event){
  if(results.submit(event))return true;
  if(event.target.id!=='study-settings-form')return false;event.preventDefault();
  try{
   const fields=new FormData(event.target),date=String(fields.get('testDate')||''),days=fields.getAll('days').map(Number),minutes=Number(fields.get('minutes')),scope=String(fields.get('scope'));
   if(date&&(!validDate(date)||date<=localDate()))throw Error('Enter your next SAT date, after today, or leave it blank.');
   if(!days.length)throw Error('Choose at least one study day.');
   if(!Number.isInteger(minutes)||minutes<15||minutes>120)throw Error('Choose 15–120 minutes.');
   if(!['Math','Reading and Writing','Both'].includes(scope))throw Error('Choose a section focus.');
   const score=(name,min,max)=>{const raw=fields.get(name);if(raw===null||raw==='')return null;const n=Number(raw);if(!Number.isInteger(n)||n<min||n>max||n%10)throw Error('Scores must be in steps of 10 and within SAT score ranges.');return n;};
   const math=score('math',200,800),readingWriting=score('readingWriting',200,800),total=score('total',400,1600);
   const interval=Number(fields.get('checkpointInterval'));if(![7,14,21,28].includes(interval))throw Error('Choose a practice test spacing.');
   state().studio.officialResults||={version:1,reports:[],happyWithPracticeScore:false};state().studio.officialResults.checkpointPolicy={intervalDays:interval,minGapDays:7,stopBeforeExamDays:3};
   const routine=date?normalizeRoutine({scope,minutes,days,startDate:localDate(),testDate:date}):null;
   state().profile={math,readingWriting,total,baseline:math&&readingWriting?math+readingWriting:null,testDate:date||null};state().studio.preferences={scope,minutes,days};state().routine=routine;save();render();toast('Routine saved. Home will choose your next steps.');
  }catch(e){document.querySelector('#study-settings-error').textContent=e.message;}return true;
 }
 function returnLink(){return state()?.studio?.homePath?.active?'<a class="primary path-return" href="#home">Continue daily path</a>':'';}
 return {home,practice,settings,click,submit,returnLink};
}
