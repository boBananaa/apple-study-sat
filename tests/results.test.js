import test from 'node:test';
import assert from 'node:assert/strict';
import {OFFICIAL_DOMAINS,PERFORMANCE_BANDS,normalizeOfficialReport,validateOfficialResults,mergeOfficialResults,saveOfficialReport,resultsGate,rankRoadmapSkills,buildResultsRoadmap,setPracticeScoreSatisfied} from '../dist/results-logic.js';
import {buildHomePath,selectHomeTaskQuestions,completeHomeTask} from '../dist/path-logic.js';
import {validateHomePath} from '../dist/path-state.js';
import {SKILLS} from '../dist/planner.js';
const today='2037-10-21',exam='2037-12-20';
const report=(extra={})=>({source:'official-bluebook',date:'2037-10-20',testName:'SAT practice 1',math:510,readingWriting:690,domains:Object.fromEntries(Object.entries(OFFICIAL_DOMAINS).map(([section,domains])=>[section,Object.fromEntries(domains.map(domain=>[domain.name,section==='Math'?'470-540':'610-670']))])),...extra});
const state=()=>({section:'Math',profile:{total:1450,testDate:exam},sessions:[],diagnostics:[],studio:{lessons:{},review:{},exams:[],officialResults:{version:1,reports:[normalizeOfficialReport(report(),{today})],happyWithPracticeScore:false},learning:{version:1,exposures:{},retention:{}}}});
const questions=['Linear Functions','Nonlinear Functions'].flatMap(skill=>Array.from({length:10},(_,i)=>({id:skill+'-'+i,skill,section:'Math',difficulty:i<3?'Easy':i===9?'Hard':'Medium'})));
const lessons=[{id:'linear-1',section:'Math',skill:'Linear Functions',title:'Linear 1',minutes:5},{id:'linear-2',section:'Math',skill:'Linear Functions',title:'Linear 2',minutes:5},{id:'nonlinear',section:'Math',skill:'Nonlinear Functions',title:'Nonlinear',minutes:5}];
const home=(s,extra={})=>buildHomePath({state:s,questions,lessons,today,...extra});
test('official domain mappings cover every named planner skill once and bands differ by section',()=>{
 assert.deepEqual(PERFORMANCE_BANDS.Math[2],[420,460]);assert.deepEqual(PERFORMANCE_BANDS['Reading and Writing'][2],[420,480]);
 for(const section of Object.keys(OFFICIAL_DOMAINS)){const skills=OFFICIAL_DOMAINS[section].flatMap(d=>d.skills);assert.equal(new Set(skills).size,skills.length);assert.deepEqual([...skills].sort(),[...SKILLS[section]].sort());assert.equal(OFFICIAL_DOMAINS[section].length,4);}
});
test('a complete same-sitting official report is required; scores, old diagnostics, and website exams cannot bypass it',()=>{
 const s=state();delete s.studio.officialResults;s.profile.math=710;s.profile.readingWriting=690;s.diagnostics=[{section:'Math',rows:[{skill:'Linear Functions',correct:4,total:10}]}];
 s.studio.scoreReports=[{date:'2037-10-20',math:710,readingWriting:690}];
 assert.equal(resultsGate(s,{today}).ready,false);const plan=home(s);assert.equal(plan.gate.ready,false);assert.equal(plan.currentTask.kind,'official-baseline');assert.deepEqual(plan.upcoming,[]);assert.equal(plan.calendarEnabled,false);
 for(const change of [{source:'website-test'},{source:'official-psat'},{date:'2037-10-22'},{superscore:true},{total:1400},{domains:{}},{math:511}])assert.throws(()=>normalizeOfficialReport(report(change),{today}));
 const partial=report();delete partial.domains.Math.Algebra;assert.throws(()=>normalizeOfficialReport(partial,{today}));
});
test('official report validation never converts domain bands into invented correct/total counts',()=>{
 const normalized=normalizeOfficialReport(report(),{today});assert.equal(normalized.total,1200);assert.deepEqual(normalized.domains.Math.Algebra,{lower:470,upper:540,band:4});
 assert.ok(!JSON.stringify(normalized).includes('correct'));assert.ok(!JSON.stringify(normalized).includes('accuracy'));
 const wrong=report();wrong.domains.Math.Algebra='420-480';assert.throws(()=>normalizeOfficialReport(wrong,{today}));
});
test('the latest actual or Bluebook test report wins by date, without superscoring or baseline migration',()=>{
 const s=state();saveOfficialReport(s,report({source:'official-sat',date:today,math:470,readingWriting:710}),{today});
 const gate=resultsGate(s,{today});assert.equal(gate.report.source,'official-sat');assert.equal(gate.report.math,470);assert.equal(gate.report.total,1180);assert.equal(s.studio.officialResults.reports.length,2);
 assert.deepEqual(validateOfficialResults(undefined),{version:1,reports:[],happyWithPracticeScore:false});
 const backup=validateOfficialResults(s.studio.officialResults,{today});assert.deepEqual(backup,s.studio.officialResults);assert.equal(mergeOfficialResults(backup,undefined,{today}).reports.length,2);
 assert.throws(()=>validateOfficialResults({...backup,checkpointPolicy:{intervalDays:0,minGapDays:0,stopBeforeExamDays:0}},{today}));
});
test('paused answers and saved Home evidence survive the results gate',()=>{
 const s=state(),first=home(s);completeHomeTask(s,first.key,first.tasks[0].id,{at:today});const saved=structuredClone(s.studio.homePath);
 delete s.studio.officialResults;s.sessions.push({id:'paused',section:'Math',completed:false,questionIds:['a','b'],records:[{questionId:'a',correct:false,hintsUsed:1}]});s.activeId='paused';
 const gated=home(s);assert.equal(gated.currentTask.sessionId,'paused');assert.ok(gated.tasks.some(t=>t.kind==='official-baseline'));assert.deepEqual(s.studio.homePath,saved);assert.equal(s.sessions[0].records[0].correct,false);assert.equal(s.sessions[0].records[0].hintsUsed,1);
});
test('weak domains guide broad skill priorities and fresh questions confirm the uncertain skill mapping',()=>{
 const s=state();s.studio.officialResults.reports[0].domains.Math['Advanced Math']={lower:200,upper:360};
 const ranks=rankRoadmapSkills({state:s,section:'Math',questions,today});assert.equal(ranks[0].domain,'Advanced Math');assert.equal(ranks[0].practiceCount,0);assert.equal(ranks[0].diagnosticCount,0);assert.match(ranks[0].reason,/does not identify which skill/);assert.match(ranks[0].uncertainty,/no per-skill accuracy/);
 const plan=home(s);assert.equal(plan.tasks.find(t=>t.kind==='practice').skill,'Nonlinear Functions');
});
test('scores guide section allocation toward a target while Math-only scope remains explicit',()=>{
 const s=state(),both=buildResultsRoadmap({state:s,today,scope:'Both'});assert.equal(both.sections[0].section,'Math');assert.ok(both.sections[0].gap>both.sections[1].gap);
 assert.deepEqual(buildResultsRoadmap({state:s,today,scope:'Math'}).sections.map(s=>s.section),['Math']);
 const first=home(s,{scope:'Both'}),second=home(s,{scope:'Both',today:'2037-10-22'}),third=home(s,{scope:'Both',today:'2037-10-23'});assert.equal(first.section,'Math');assert.equal(second.section,'Math');assert.equal(third.section,'Reading and Writing');
});
test('low official bands prefer Easy and never unlock Hard without independent stable practice',()=>{
 const s=state();s.studio.officialResults.reports[0].domains.Math.Algebra={lower:200,upper:360};const task=home(s).tasks.find(t=>t.kind==='practice');const ids=selectHomeTaskQuestions({task,state:s,questions});assert.equal(questions.find(q=>q.id===ids[0]).difficulty,'Easy');assert.ok(ids.every(id=>questions.find(q=>q.id===id).difficulty!=='Hard'));
});
test('the weak skill uses its next uncompleted lesson and a finished day never grows after a new report',()=>{
 const s=state();s.studio.officialResults.reports[0].domains.Math.Algebra={lower:200,upper:360};s.studio.lessons['linear-1']={completed:true,at:today};
 const first=home(s);assert.equal(first.tasks.find(t=>t.kind==='lesson').lessonId,'linear-2');for(const t of first.tasks)completeHomeTask(s,first.key,t.id,{at:today});const ids=first.tasks.map(t=>t.id);
 saveOfficialReport(s,report({date:today,math:600}),{today});const finished=home(s);assert.equal(finished.status,'complete');assert.deepEqual(finished.tasks.map(t=>t.id),ids);
});
test('official checkpoints continue after all lessons and bank questions are finished',()=>{
 const s=state();s.studio.officialResults.reports[0].date='2037-10-01';for(const lesson of lessons)s.studio.lessons[lesson.id]={completed:true,at:today};
 const plan=home(s,{questions:[]});assert.equal(plan.currentTask.kind,'official-checkpoint');assert.equal(plan.currentTask.official,true);assert.equal(plan.currentTask.minutes,144);assert.ok(plan.roadmap.checkpoints.length>1);assert.deepEqual(validateHomePath(s.studio.homePath),s.studio.homePath);
 const dates=plan.roadmap.checkpoints.map(c=>c.date);assert.equal(dates[0],today);assert.ok(dates.every(d=>d<exam));for(let i=1;i<dates.length;i++)assert.equal((Date.parse(dates[i])-Date.parse(dates[i-1]))/86400000,14);
});
test('checkpoint schedules require an explicit future exam date, leave a final buffer, and stop on satisfaction',()=>{
 const s=state();for(const date of [null,'',today,'2037-02-30']){const roadmap=buildResultsRoadmap({state:s,today,testDate:date});assert.equal(roadmap.calendarEnabled,false);assert.deepEqual(roadmap.checkpoints,[]);}
 const close=buildResultsRoadmap({state:s,today,testDate:'2037-10-24'});assert.deepEqual(close.checkpoints,[]);
 setPracticeScoreSatisfied(s,true,{today});assert.deepEqual(buildResultsRoadmap({state:s,today}).checkpoints,[]);
 saveOfficialReport(s,report({date:today,math:600}),{today});assert.equal(s.studio.officialResults.happyWithPracticeScore,false);assert.ok(buildResultsRoadmap({state:s,today}).nextCheckpoint);
 assert.match(buildResultsRoadmap({state:s,today}).scoreNote,/either direction/);
});
test('entering a new official practice report completes its checkpoint without an extra lesson that day',()=>{
 const s=state();s.studio.officialResults.reports[0].date='2037-10-01';const first=home(s);assert.equal(first.currentTask.kind,'official-checkpoint');
 saveOfficialReport(s,report({date:today,math:550}),{today});const after=home(s);assert.equal(after.status,'complete');assert.equal(after.tasks.length,1);assert.equal(after.tasks[0].completion.reportId,resultsGate(s,{today}).report.id);
 assert.ok(after.roadmap.nextCheckpoint.date>today);
});

test('the entered real exam date ends new roadmap work while preserving paused work and saved days',()=>{
 for(const testDate of [today,'2037-10-20']){
  const s=state();const before=home(s);const saved=structuredClone(s.studio.homePath);s.profile.testDate=testDate;
  const reached=home(s);assert.equal(reached.examDateReached,true);assert.equal(reached.needsNewTestDate,true);assert.equal(reached.testDate,testDate);assert.equal(reached.gate.reason,'test-date-reached');assert.equal(reached.gate.ready,false);assert.equal(reached.calendarEnabled,false);assert.deepEqual(reached.tasks,[]);assert.deepEqual(reached.upcoming,[]);assert.deepEqual(s.studio.homePath,saved);
  s.sessions.push({id:'paused-after-exam',section:'Math',questionIds:['saved-1','saved-2'],records:[{questionId:'saved-1',correct:false,hintsUsed:1}],completed:false});s.activeId='paused-after-exam';
  const resumed=home(s);assert.equal(resumed.tasks.length,1);assert.equal(resumed.currentTask.sessionId,'paused-after-exam');assert.equal(resumed.currentTask.optional,true);assert.equal(resumed.currentTask.ephemeral,true);assert.deepEqual(s.studio.homePath,saved);assert.equal(s.sessions[0].records[0].correct,false);
 }
});
test('an expired exam date takes precedence over missing official results and accepts a future replacement',()=>{
 const s=state();delete s.studio.officialResults;s.profile.testDate=today;assert.equal(home(s).gate.reason,'test-date-reached');
 s.profile.testDate=exam;assert.equal(home(s).gate.reason,'official-results-required');saveOfficialReport(s,report(),{today});assert.equal(home(s).gate.ready,true);
});

test('distinct reports from the same test date follow manual entry order even within one clock millisecond',()=>{
 const s=state();s.studio.officialResults.reports=[];
 const first=saveOfficialReport(s,report({date:today,testName:'SAT practice 1'}),{today});
 const second=saveOfficialReport(s,report({date:today,testName:'SAT practice 2',math:550}),{today});
 const third=saveOfficialReport(s,report({date:today,source:'official-sat',testName:'Actual SAT',math:570}),{today});
 assert.ok(Date.parse(second.enteredAt)>Date.parse(first.enteredAt));assert.ok(Date.parse(third.enteredAt)>Date.parse(second.enteredAt));
 assert.equal(resultsGate(s,{today}).report.id,third.id);assert.equal(resultsGate(s,{today}).report.math,570);
});
test('provided report entry timestamps survive saves and compare by actual time across offsets',()=>{
 const s=state();s.studio.officialResults.reports=[];
 const newer=saveOfficialReport(s,report({date:today,testName:'Newer entry',enteredAt:'2037-10-21T13:00:00-05:00'}),{today});
 saveOfficialReport(s,report({date:today,source:'official-sat',testName:'Older entry',enteredAt:'2037-10-21T17:00:00Z'}),{today});
 assert.equal(newer.enteredAt,'2037-10-21T13:00:00-05:00');assert.equal(resultsGate(s,{today}).report.id,newer.id);
 const merged=mergeOfficialResults({version:1,reports:[newer]},s.studio.officialResults,{today});assert.equal(merged.reports.at(-1).id,newer.id);
});
