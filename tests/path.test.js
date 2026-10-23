import test from 'node:test';
import assert from 'node:assert/strict';
import {buildHomePath,selectHomeTaskQuestions,bindHomeTask,completeHomeTask} from '../dist/path-logic.js';
import {skillKey} from '../dist/learning-logic.js';
import {OFFICIAL_DOMAINS,saveOfficialReport} from '../dist/results-logic.js';
const today='2037-10-21';
const lessons=[{id:'linear',section:'Math',skill:'Linear Functions',title:'Read a linear model',minutes:5},{id:'area',section:'Math',skill:'Area and Volume',title:'Find the area',minutes:5},{id:'inference',section:'Reading and Writing',skill:'Inferences',title:'Read the evidence',minutes:5}];
const questions=['Math','Reading and Writing'].flatMap(section=>(section==='Math'?['Linear Functions','Area and Volume']:['Inferences']).flatMap(skill=>Array.from({length:15},(_,i)=>({id:section+'|'+skill+'|'+i,section,skill,difficulty:i===14?'Hard':i<3?'Easy':'Medium'}))));
const state=()=>{
 const s={section:'Math',sessions:[],diagnostics:[{section:'Math',date:'2037-10-20',rows:[{skill:'Linear Functions',correct:0,total:10}]}],studio:{lessons:{},review:{},exams:[],learning:{version:1,exposures:{},retention:{}}}};
 // Synthetic complete official-report fixture; no production baseline is inferred.
 saveOfficialReport(s,{source:'official-bluebook',date:'2037-10-20',testName:'Synthetic test fixture',math:600,readingWriting:600,domains:Object.fromEntries(Object.entries(OFFICIAL_DOMAINS).map(([section,domains])=>[section,Object.fromEntries(domains.map(domain=>[domain.name,section==='Math'?'470-540':'490-540']))]))},{today});
 return s;
};
const build=(s,extra={})=>buildHomePath({state:s,questions,lessons,today,...extra});
const practice=plan=>plan.tasks.find(task=>task.kind==='practice');
test('undated Today offers a stable short sequence and never invents a calendar',()=>{
 const s=state(),first=build(s);assert.equal(first.label,'Today');assert.equal(first.calendarEnabled,false);assert.deepEqual(first.upcoming,[]);
 assert.deepEqual(first.tasks.map(t=>t.kind),['lesson','practice']);assert.equal(practice(first).count,5);assert.equal(practice(first).skill,'Linear Functions');
 assert.deepEqual(build(s).tasks,first.tasks);assert.equal(Object.keys(s.studio.homePath.days).length,1);
 assert.ok(!JSON.stringify(s.studio.homePath).includes('questionIds'));
});
test('fresh selection excludes imported history, exposures, paused sets and assessment reservations',()=>{
 const s=state(),plan=build(s),task=practice(plan),pool=questions.filter(q=>q.skill===task.skill);
 const history=[{questionId:pool[0].id}];s.studio.learning.exposures[pool[1].id]='2037-10-20';
 s.sessions.push({id:'paused',section:'Math',completed:false,questionIds:[pool[2].id],records:[]});
 s.studio.exams.push({id:'exam',status:'active',section:'Math',modules:[{questionIds:[pool[3].id]}]});
 const ids=selectHomeTaskQuestions({task,state:s,questions,history});assert.equal(ids.length,5);assert.equal(new Set(ids).size,5);
 for(const q of pool.slice(0,4))assert.ok(!ids.includes(q.id));assert.ok(!ids.includes(pool.at(-1).id));
 assert.ok(!Object.hasOwn(task,'questionIds'));
});
test('paused assessments come first, then paused practice resumes instead of starting a new set',()=>{
 const s=state();s.sessions=[{id:'practice',section:'Math',questionIds:['x','y'],records:[],completed:false}];
 s.studio.exams=[{id:'exam',section:'Math',status:'between',moduleIndex:0,modules:[{section:'Math',questionIds:['z']}]}];
 assert.equal(build(s).currentTask.kind,'resume-assessment');
 const t=state();t.activeId='practice';t.sessions=s.sessions;assert.equal(build(t).currentTask.sessionId,'practice');
 assert.ok(build(t).tasks.length<=3);
});
test('due correction and delayed retrieval precede a lesson and cap the daily work at three tasks',()=>{
 const s=state(),q=questions[0],key=skillKey('Math','Linear Functions');
 s.sessions=[{id:'old',section:'Math',completed:true,questionIds:[q.id],records:[{questionId:q.id,skill:q.skill,correct:false,hintsUsed:1}]}];
 s.studio.learning.retention[key]={section:'Math',skill:q.skill,due:today,checks:[]};
 const plan=build(s);assert.deepEqual(plan.tasks.map(t=>t.kind),['correction','retention','lesson']);
 assert.equal(plan.currentTask.questionId,q.id);assert.equal(selectHomeTaskQuestions({task:plan.tasks[1],state:s,questions}).length,3);
});
test('already reviewed lessons do not repeat, and an exhausted weak skill yields a different fresh skill',()=>{
 const s=state();s.studio.lessons.linear={completed:true,at:today};assert.ok(!build(s).tasks.some(t=>t.lessonId==='linear'));
 const t=state();for(const q of questions.filter(q=>q.skill==='Linear Functions'))t.studio.learning.exposures[q.id]=today;
 const plan=build(t);assert.equal(practice(plan).skill,'Area and Volume');assert.ok(!plan.tasks.some(t=>t.skill==='Linear Functions'));
});
test('a depleted skill can use a short fresh remainder without recycling old IDs',()=>{
 const s=state(),localQuestions=questions.filter(q=>q.skill==='Linear Functions').slice(0,2),plan=build(s,{questions:localQuestions});
 assert.equal(practice(plan).count,2);assert.match(practice(plan).description,/2 fresh questions/);
 assert.equal(selectHomeTaskQuestions({task:practice(plan),state:s,questions:localQuestions}).length,2);
});
test('empty libraries preserve lesson access, vocabulary for R&W, and a concrete Settings task',()=>{
 const math=build(state(),{questions:[]});assert.deepEqual(math.tasks.map(t=>t.kind),['lesson','bank-setup']);
 assert.equal(math.tasks.at(-1).status,'pending');assert.equal(build(state(),{questions:[]}).status,'ready');
 const rw=build(state(),{questions:[],scope:'Reading and Writing'});assert.deepEqual(rw.tasks.map(t=>t.kind),['lesson','vocabulary','bank-setup']);
 assert.ok(!rw.tasks.some(t=>t.kind==='practice'));
});
test('rest days show no required tasks and respect a future availability start date',()=>{
 const weekday=new Date(today+'T12:00:00Z').getUTCDay(),s=state();
 assert.equal(build(s,{preferences:{days:[(weekday+1)%7]}}).status,'rest');assert.deepEqual(build(s,{preferences:{days:[(weekday+1)%7]}}).tasks,[]);
 const t=state();assert.equal(build(t,{preferences:{startDate:'2037-10-25'}}).status,'rest');
 const resumed=build(s,{preferences:{days:[weekday]}});assert.equal(resumed.restDay,false);assert.ok(resumed.currentTask);
});
test('only a real future test date enables tentative dated work on available days',()=>{
 for(const testDate of ['2037-02-30',today,'2037-10-20',''])assert.equal(build(state(),{preferences:{testDate}}).calendarEnabled,false);
 const plan=build(state(),{preferences:{testDate:'2037-11-01',days:[1,3,5],minutes:30}});
 assert.equal(plan.calendarEnabled,true);assert.equal(plan.minutes,30);assert.ok(plan.upcoming.length);
 for(const day of plan.upcoming){assert.ok(day.date>today&&day.date<'2037-11-01');assert.ok([1,3,5].includes(new Date(day.date+'T12:00:00Z').getUTCDay()));assert.equal(day.tentative,true);assert.ok(day.tasks.every(t=>t.status==='upcoming'&&!t.questionIds));}
});
test('Both rotates actual persisted study days and previews, R&W scope stays in its section',()=>{
 const s=state(),first=build(s,{scope:'Both',preferences:{testDate:'2037-11-01'}});
 const next=build(s,{scope:'Both',today:'2037-10-22',preferences:{testDate:'2037-11-01'}});
 assert.notEqual(first.section,next.section);assert.notEqual(first.section,first.upcoming[0].section);
 const rw=build(state(),{scope:'Reading and Writing'});assert.ok(rw.tasks.every(t=>t.section==='Reading and Writing'));
});
test('finished work remains in its original day with actual completion references',()=>{
 const s=state(),first=build(s),p=practice(first);assert.equal(bindHomeTask(s,first.key,p.id,{sessionId:'today-set'}),true);
 s.sessions.push({id:'today-set',section:'Math',questionIds:['a'],records:[],completed:true,completedAt:today+'T14:00:00Z'});
 s.studio.lessons.linear={completed:true,at:today+'T13:00:00Z'};
 const second=build(s);assert.equal(second.status,'complete');assert.equal(second.tasks.length,first.tasks.length);
 assert.equal(second.tasks.find(t=>t.id===p.id).completion.sessionId,'today-set');
 build(s,{today:'2037-10-22'});assert.equal(s.studio.homePath.days[first.key].tasks.find(t=>t.id===p.id).status,'complete');
 assert.equal(completeHomeTask(s,first.key,'missing',{at:today}),false);
});
test('completed retrieval records preserve assisted first-answer evidence without rewriting it',()=>{
 const s=state(),key=skillKey('Math','Linear Functions');s.studio.learning.retention[key]={section:'Math',skill:'Linear Functions',due:today,checks:[]};
 const first=build(s),retention=first.tasks.find(t=>t.kind==='retention');s.studio.learning.retention[key].checks.push({sessionId:'check',passed:false,independent:2});
 const next=build(s);assert.equal(next.tasks.find(t=>t.id===retention.id).status,'complete');assert.equal(s.studio.learning.retention[key].checks[0].passed,false);
});
test('a short time budget limits fresh practice and due work without claiming a full set',()=>{
 const s=state(),plan=build(s,{preferences:{minutes:15}});
 assert.equal(practice(plan).count,3);assert.ok(plan.tasks.reduce((n,t)=>n+t.minutes,0)<=15);
 s.studio.lessons.linear={completed:true,at:today+'T13:00:00Z'};
 const next=build(s,{preferences:{minutes:15}});assert.equal(practice(next).count,3);assert.ok(next.tasks.reduce((n,t)=>n+t.minutes,0)<=15);
});
test('new diagnostic evidence and depleted questions adapt unstarted work but preserve completions',()=>{
 const s=state(),first=build(s);s.diagnostics[0].rows=[{skill:'Area and Volume',correct:0,total:20}];
 const changed=build(s);assert.equal(practice(changed).skill,'Area and Volume');
 for(const q of questions.filter(q=>q.skill==='Area and Volume'))s.studio.learning.exposures[q.id]=today;
 const depleted=build(s);assert.equal(practice(depleted).skill,'Linear Functions');
 assert.deepEqual(build(s).tasks,depleted.tasks);
 const lesson=depleted.tasks.find(t=>t.kind==='lesson');s.studio.lessons[lesson.lessonId]={completed:true,at:today};
 const finishedLesson=build(s);assert.equal(finishedLesson.tasks.find(t=>t.id===lesson.id).status,'complete');
 assert.equal(first.key,changed.key);
});
import {validateHomePath,mergeHomePath} from '../dist/path-state.js';
test('portable paths reject invalid dates, reserved future question IDs, and malformed tasks',()=>{
 const s=state();build(s);assert.deepEqual(validateHomePath(s.studio.homePath),s.studio.homePath);
 const corrupt=structuredClone(s.studio.homePath),day=Object.values(corrupt.days)[0];day.tasks[0].questionIds=['reserved'];assert.throws(()=>validateHomePath(corrupt));
 assert.throws(()=>validateHomePath({version:1,days:{'2037-02-30|Math':{date:'2037-02-30',scope:'Math',section:'Math',tasks:[]}}}));
});
test('backup merging retains completed tasks and actual launched references from either side',()=>{
 const left=state(),right=state(),a=build(left),b=build(right);
 completeHomeTask(left,a.key,a.tasks[0].id,{lessonId:'linear',at:today});bindHomeTask(right,b.key,practice(b).id,{sessionId:'portable'});
 const merged=mergeHomePath(left.studio.homePath,right.studio.homePath),tasks=merged.days[a.key].tasks;
 assert.equal(tasks.find(t=>t.id===a.tasks[0].id).status,'complete');assert.equal(tasks.find(t=>t.id===practice(b).id).sessionId,'portable');
 assert.equal(mergeHomePath(merged,left.studio.homePath).days[a.key].tasks.find(t=>t.id===a.tasks[0].id).status,'complete');
});
test('an assessment opened later takes priority over an already linked practice task',()=>{
 const s=state(),first=build(s),p=practice(first);bindHomeTask(s,first.key,p.id,{sessionId:'linked'});
 s.sessions.push({id:'linked',section:'Math',questionIds:['x'],records:[],completed:false});
 assert.equal(build(s).currentTask.sessionId,'linked');
 s.studio.exams.push({id:'later-exam',status:'active',section:'Math',moduleIndex:0,modules:[{section:'Math',questionIds:['y']}]});
 const changed=build(s);assert.equal(changed.currentTask.examId,'later-exam');assert.equal(changed.tasks.filter(t=>t.sessionId==='linked').length,1);
});
import {initializeStudio,importStudio,mergeStudio} from '../dist/studio-logic.js';
test('Home backups retain real completion, linked work, and a validated contextual return target',()=>{
 const s=state(),plan=build(s),p=practice(plan);initializeStudio(s);
 completeHomeTask(s,plan.key,plan.tasks[0].id,{lessonId:'linear',at:today});
 bindHomeTask(s,plan.key,p.id,{sessionId:'portable-session'});
 s.studio.homePath.active={key:plan.key,taskId:p.id};s.studio.preferences={scope:'Both',minutes:30,days:[5,1,3,1],extra:'drop'};
 const imported=importStudio(structuredClone(s.studio),questions,{today});
 assert.deepEqual(imported.homePath.active,{key:plan.key,taskId:p.id});
 assert.equal(imported.homePath.days[plan.key].tasks[0].status,'complete');
 assert.equal(imported.homePath.days[plan.key].tasks.find(t=>t.id===p.id).sessionId,'portable-session');
 assert.deepEqual(imported.preferences,{scope:'Both',minutes:30,days:[1,3,5]});
 const baseline=initializeStudio(state()),merged=mergeStudio(baseline,imported,{today});
 assert.deepEqual(merged.homePath.active,imported.homePath.active);assert.deepEqual(merged.preferences,imported.preferences);
});
test('backup merge keeps local contextual activity and preferences when the incoming backup has neither',()=>{
 const s=state(),plan=build(s);initializeStudio(s);s.studio.homePath.active={key:plan.key,taskId:plan.tasks[0].id};s.studio.preferences={scope:'Reading and Writing',minutes:15,days:[2,4]};
 const older=initializeStudio(state());const merged=mergeStudio(s.studio,importStudio(older,questions,{today}),{today});
 assert.deepEqual(merged.homePath.active,s.studio.homePath.active);assert.deepEqual(merged.preferences,s.studio.preferences);
 const stale=structuredClone(s.studio.homePath);stale.active.taskId='no-longer-present';assert.equal(validateHomePath(stale).active,undefined);
 const malformed=structuredClone(s.studio.homePath);malformed.active={key:[],taskId:{}};assert.equal(validateHomePath(malformed).active,undefined);
 malformed.active={key:'__proto__',taskId:'bad'};assert.equal(validateHomePath(malformed).active,undefined);
});
test('backup preferences reject unsafe values and normalize omitted optional fields',()=>{
 const baseline=initializeStudio(state());
 for(const preferences of [{scope:'other'}, {minutes:-1}, {minutes:15.5}, {days:[]}, {days:['1']}, {days:[7]}, []])assert.throws(()=>importStudio({...baseline,preferences},questions,{today}));
 assert.deepEqual(importStudio({...baseline,preferences:{scope:'Both'}},questions,{today}).preferences,{scope:'Both',minutes:30,days:[1,2,3,4,5]});
});
import {LESSONS} from '../dist/learning-content.js';
import {markExposure,scheduleRetention} from '../dist/learning-logic.js';
test('completing the planned empty-bank lesson keeps the original bank setup as the next action',()=>{
 const s=state();s.diagnostics=[];initializeStudio(s);
 const initial=build(s,{questions:[],lessons:LESSONS,preferences:{minutes:30}});
 assert.deepEqual(initial.tasks.map(t=>t.kind),['lesson','bank-setup']);
 const plannedLesson=initial.tasks[0],plannedIds=initial.tasks.map(t=>t.id);
 s.studio.homePath.active={key:initial.key,taskId:plannedLesson.id};
 s.studio.lessons[plannedLesson.lessonId]={completed:true,assisted:false,at:today+'T13:00:00Z'};
 s.studio.events.push({key:'lesson-'+plannedLesson.lessonId,kind:'lesson',points:25,at:today+'T13:00:00Z'});
 for(let i=0;i<4;i++){
  const home=build(s,{questions:[],lessons:LESSONS,preferences:{minutes:30}});
  assert.deepEqual(home.tasks.map(t=>t.id),plannedIds);assert.equal(home.tasks[0].status,'complete');
  assert.equal(home.currentTask.kind,'bank-setup');assert.equal(home.tasks.filter(t=>t.kind==='lesson').length,1);
 }
});
test('a seven-minute lesson and its five-question set remain the whole day through launch, answers, and completion',()=>{
 const s=state(),sevenMinuteLessons=lessons.map(l=>({...l,minutes:7})),options={lessons:sevenMinuteLessons,preferences:{minutes:30}};
 const initial=build(s,options),plannedIds=initial.tasks.map(t=>t.id),plannedPractice=practice(initial),lesson=initial.tasks.find(t=>t.kind==='lesson');
 assert.equal(plannedPractice.count,5);
 s.studio.lessons[lesson.lessonId]={completed:true,at:today+'T13:00:00Z'};
 let home=build(s,options);assert.deepEqual(home.tasks.map(t=>t.id),plannedIds);assert.equal(home.currentTask.id,plannedPractice.id);assert.equal(practice(home).count,5);
 const ids=selectHomeTaskQuestions({task:home.currentTask,state:s,questions}),session={id:'planned-today',section:'Math',questionIds:ids,records:[],completed:false,index:0};
 assert.equal(ids.length,5);bindHomeTask(s,initial.key,plannedPractice.id,{sessionId:session.id});s.sessions.push(session);s.activeId=session.id;
 for(const [index,id] of ids.entries()){
  const q=questions.find(q=>q.id===id),at=today+'T14:0'+index+':00Z';
  const record={questionId:id,skill:q.skill,correct:index!==0,hintsUsed:index===1?1:0,setupCorrect:true,revealed:false,confidence:'sure',submittedAt:at};
  session.records.push(record);markExposure(s.studio,id,at);scheduleRetention(s.studio,q,at);
  home=build(s,options);assert.deepEqual(home.tasks.map(t=>t.id),plannedIds);assert.equal(practice(home).sessionId,session.id);assert.ok(home.tasks.length<=3);
 }
 session.completed=true;session.completedAt=today+'T14:10:00Z';
 for(let i=0;i<4;i++){
  home=build(s,options);assert.equal(home.status,'complete');assert.equal(home.currentTask,null);assert.deepEqual(home.tasks.map(t=>t.id),plannedIds);assert.ok(home.tasks.every(t=>t.status==='complete'));
 }
 assert.equal(s.sessions[0].records[0].correct,false);assert.equal(s.sessions[0].records[1].hintsUsed,1);
});
test('a full completed day resumes independently started work without expanding its saved daily tasks',()=>{
 const s=state(),q=questions[0];s.sessions.push({id:'earlier',section:'Math',completed:true,questionIds:[q.id],records:[{questionId:q.id,skill:q.skill,correct:false,hintsUsed:0}]});
 const initial=build(s,{preferences:{minutes:30}});assert.equal(initial.tasks.length,3);
 for(const task of initial.tasks)completeHomeTask(s,initial.key,task.id,{at:today,kind:task.kind});
 const completedIds=initial.tasks.map(t=>t.id);assert.equal(build(s,{preferences:{minutes:30}}).status,'complete');
 s.sessions.push({id:'extra-set',section:'Math',questionIds:[questions[2].id],records:[],completed:false});s.activeId='extra-set';
 let home=build(s,{preferences:{minutes:30}});
 assert.equal(home.currentTask.sessionId,'extra-set');assert.equal(home.currentTask.optional,true);assert.equal(home.currentTask.ephemeral,true);assert.equal(home.tasks.length,4);
 assert.deepEqual(s.studio.homePath.days[initial.key].tasks.map(t=>t.id),completedIds);assert.ok(s.studio.homePath.days[initial.key].tasks.every(t=>t.status==='complete'));
 s.sessions.at(-1).completed=true;s.sessions.at(-1).completedAt=today+'T15:00:00Z';
 home=build(s,{preferences:{minutes:30}});assert.equal(home.status,'complete');assert.equal(home.tasks.length,3);assert.equal(home.currentTask,null);
 s.studio.exams.push({id:'extra-exam',section:'Math',status:'active',moduleIndex:0,modules:[{section:'Math',questionIds:[questions[3].id]}]});
 home=build(s,{preferences:{minutes:30}});assert.equal(home.currentTask.examId,'extra-exam');assert.equal(home.currentTask.ephemeral,true);
 assert.deepEqual(s.studio.homePath.days[initial.key].tasks.map(t=>t.id),completedIds);
 s.studio.exams.at(-1).status='complete';assert.equal(build(s,{preferences:{minutes:30}}).status,'complete');
});
test('Hard Home questions require a completed stable five-question set, not five singles or an active set',()=>{
 const pool=questions.filter(q=>q.section==='Math'&&q.skill==='Linear Functions');
 const records=pool.slice(0,5).map(q=>({questionId:q.id,skill:q.skill,correct:true,hintsUsed:0,revealed:false,setupCorrect:true,confidence:'sure',submittedAt:today+'T13:00:00Z'}));
 const task={kind:'practice',status:'pending',section:'Math',skill:'Linear Functions',count:5};
 const selected=s=>selectHomeTaskQuestions({task,state:s,questions}).map(id=>questions.find(q=>q.id===id));
 const singles=state();singles.sessions=records.map((r,index)=>({id:'single-'+index,section:'Math',completed:true,questionIds:[r.questionId],records:[r]}));
 assert.ok(selected(singles).every(q=>q.difficulty!=='Hard'));assert.equal(selected(singles)[0].difficulty,'Medium');
 const active=state();active.sessions=[{id:'active-five',section:'Math',completed:false,questionIds:records.map(r=>r.questionId),records}];
 assert.ok(selected(active).every(q=>q.difficulty!=='Hard'));assert.equal(selected(active)[0].difficulty,'Medium');
 const stable=state();stable.sessions=[{id:'complete-five',section:'Math',completed:true,questionIds:records.map(r=>r.questionId),records}];
 assert.equal(selected(stable)[0].difficulty,'Hard');
});
