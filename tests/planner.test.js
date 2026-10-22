import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDiagnostic,normalizeRoutine,rankSkills,buildPlan,seedDiagnostics,validDate} from '../dist/planner.js';
const date='2037-10-21',routine={scope:'Math',minutes:30,days:[1,3,5],startDate:date,testDate:'2037-11-07'};
const diagnostic=normalizeDiagnostic({section:'Math',date,label:'Test',rows:[{skill:'Linear Functions',correct:0,total:2},{skill:'Area and Volume',correct:8,total:10}]});
const questions=['Math','Reading and Writing'].flatMap(section=>(section==='Math'?['Linear Functions','Area and Volume']:['Inferences','Transitions']).flatMap(skill=>['Easy','Medium','Hard'].flatMap(difficulty=>Array.from({length:80},(_,i)=>({id:section+skill+difficulty+i,section,skill,difficulty})))));
const record=(q,extra={})=>({questionId:q.id,skill:q.skill,correct:true,hintsUsed:0,revealed:false,setupCorrect:true,submittedAt:date+'T14:00:00Z',...extra});
test('diagnostic counts, real dates and routine constraints reject invalid input',()=>{
 assert.throws(()=>normalizeDiagnostic({...diagnostic,rows:[{skill:'Linear Functions',correct:3,total:2}]}));
 assert.throws(()=>normalizeDiagnostic({...diagnostic,rows:[{skill:'Linear Functions',correct:'',total:2}]}));
 assert.throws(()=>normalizeDiagnostic({...diagnostic,section:'English'}));
 assert.equal(validDate('2037-02-30'),false);
 assert.throws(()=>normalizeRoutine({...routine,days:[]}));
 assert.throws(()=>normalizeRoutine({...routine,testDate:date}));
});
test('diagnostic misses prioritize follow-up and small samples remain tentative',()=>{
 const ranks=rankSkills({section:'Math',diagnostics:[diagnostic],questions});
 assert.equal(ranks[0].skill,'Linear Functions');
 assert.match(ranks[0].reason,/small sample/);
 assert.ok(ranks.find(r=>r.skill==='Area and Volume').priority<.5);
 const seeded=seedDiagnostics([{received_on:date,skill_results:[{reported_skill:'Area & Volume',correct:0,total:2},{reported_skill:'Graphs',correct:1,total:1}]}]);
 assert.equal(seeded[0].rows[0].skill,'Area and Volume');assert.equal(seeded[0].rows.length,1);
 const replacement=normalizeDiagnostic({...diagnostic,rows:[{skill:'Linear Functions',correct:5,total:5}]});
 const latest=rankSkills({section:'Math',diagnostics:[diagnostic,replacement],questions}).find(r=>r.skill==='Linear Functions');
 assert.equal(latest.diagnosticCorrect,5);
});
test('only independent answers with sound approaches reduce need and unlock stretching',()=>{
 const qs=questions.filter(q=>q.skill==='Linear Functions').slice(0,10);
 const base={section:'Math',diagnostics:[diagnostic],questions};
 const strong=rankSkills({...base,sessions:[{section:'Math',records:qs.map(q=>record(q))}]}).find(r=>r.skill==='Linear Functions');
 const hinted=rankSkills({...base,sessions:[{section:'Math',records:qs.map(q=>record(q,{hintsUsed:1}))}]}).find(r=>r.skill==='Linear Functions');
 const invalid=rankSkills({...base,sessions:[{section:'Math',records:qs.map(q=>record(q,{setupCorrect:null}))}]}).find(r=>r.skill==='Linear Functions');
 assert.ok(strong.stable);assert.ok(strong.priority<.2);assert.ok(!hinted.stable);assert.ok(hinted.priority>.8);assert.ok(!invalid.stable);
 const before=rankSkills({...base,sessions:[{section:'Math',records:qs.map(q=>record(q,{submittedAt:'2037-10-01T00:00:00Z'}))}]}).find(r=>r.skill==='Linear Functions');
 assert.equal(before.practiceCount,0);
});
test('calendar respects weekdays, test deadline, budget and no-repeat reservations',()=>{
 const unused=questions.find(q=>q.skill==='Linear Functions'&&q.difficulty==='Medium');
 const reserved=questions.find(q=>q.skill==='Linear Functions'&&q.difficulty==='Medium'&&q.id!==unused.id);
 const result=buildPlan({routine,diagnostics:[diagnostic],questions,today:date,history:[{questionId:unused.id}],sessions:[{section:'Math',completed:false,questionIds:[reserved.id],records:[]}]});
 assert.ok(result.days.length);assert.equal(result.days[0].skills[0],'Linear Functions');
 const ids=result.days.flatMap(d=>d.questionIds);
 assert.equal(new Set(ids).size,ids.length);assert.ok(!ids.includes(unused.id));assert.ok(!ids.includes(reserved.id));
 for(const day of result.days){assert.equal(day.section,'Math');assert.ok(day.date<'2037-11-07');assert.ok(routine.days.includes(new Date(day.date+'T12:00:00Z').getUTCDay()));assert.equal(day.practiceMinutes+day.reviewMinutes+day.breakMinutes,30);assert.equal(day.timed,false);assert.ok(!day.difficulty.includes('Hard'));}
});
test('both sections receive study days, English-only stays English and late dates do not build a backlog',()=>{
 const combined=buildPlan({routine:{...routine,scope:'Both'},questions,today:date});
 assert.deepEqual([...new Set(combined.days.map(d=>d.section))].sort(),['Math','Reading and Writing']);
 const rw=buildPlan({routine:{...routine,scope:'Reading and Writing'},questions,today:'2037-10-30'});
 assert.ok(rw.days.every(d=>d.section==='Reading and Writing'&&d.date>='2037-10-30'));
 const past=buildPlan({routine,questions,today:'2037-11-08'});assert.equal(past.days.length,0);
 const pausedEnglish={id:'paused-English',type:'routine',planDate:date,section:'Reading and Writing',completed:false,questionIds:[],records:[]};
 const math=buildPlan({routine,questions,sessions:[pausedEnglish],today:date});
 assert.ok(math.days.every(day=>day.section==='Math'));
});
test('completed routine work stays visible while next sessions adapt; hard pace requires two stable sets',()=>{
 const qs=questions.filter(q=>q.skill==='Linear Functions').slice(0,10);
 const sessions=[0,1].map((n)=>({id:'session-'+n,section:'Math',type:'routine',completed:true,planDate:n?'2037-10-19':date,questionIds:qs.slice(n*5,n*5+5).map(q=>q.id),records:qs.slice(n*5,n*5+5).map(q=>record(q))}));
 // Restrict the library to this skill to inspect difficulty, without priority rotation.
 const result=buildPlan({routine,diagnostics:[diagnostic],questions:questions.filter(q=>q.skill==='Linear Functions'),sessions,today:date});
 assert.equal(result.days[0].completed,true);assert.equal(result.days[0].existingId,'session-0');
 assert.equal(result.days[1].difficulty,'Hard');assert.equal(result.days[1].timed,true);
 assert.equal(result.completedCount,2);
});
