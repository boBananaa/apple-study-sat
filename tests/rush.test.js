import test from 'node:test';
import assert from 'node:assert/strict';
import {createRush,submitRushAnswer,skipRush,expireRush,advanceRush,endRush,rushRemaining,rushSummary,rushTaken,validateRush,mergeRush} from '../dist/rush-logic.js';
const now=1900000000000;
const questions=['Math','Reading and Writing'].flatMap(section=>Array.from({length:36},(_,i)=>({id:section+'-'+i,section,skill:i%2?'Linear Functions':'Nonlinear Functions',exactSkill:i%2?'Slope from context':'Quadratic model',difficulty:i%3===2?'Hard':i%3===1?'Medium':'Easy',file:'official-fixture.pdf',page:i+1,number:i+2,key:{url:'https://example.com/official-fixture.pdf'}})));
const make=(options={},taken=new Set())=>createRush(questions,taken,{section:'Math',count:5,pace:'standard',now,seed:42,...options});
const qFor=round=>questions.find(q=>q.id===round.questionIds[round.index]);
test('Rush reserves one fresh unique filtered set without mutating the question bank or used IDs',()=>{
 const original=structuredClone(questions),taken=new Set(['Math-0','Math-3']),round=make({},taken);
 assert.equal(round.questionIds.length,5);assert.equal(new Set(round.questionIds).size,5);assert.ok(round.questionIds.every(id=>!taken.has(id)));assert.ok(round.questionIds.every(id=>questions.find(q=>q.id===id).difficulty!=='Hard'));
 assert.deepEqual(questions,original);assert.deepEqual([...taken],['Math-0','Math-3']);assert.deepEqual([...rushTaken([round])],round.questionIds);assert.deepEqual(round.exposedIds,[round.questionIds[0]]);
 const next=make({id:'next'},rushTaken([round]));assert.ok(next.questionIds.every(id=>!round.questionIds.includes(id)));assert.notEqual(make().id,make().id);
});
test('setup honors section, exact skill, difficulty and the existing Hard gate with honest shortage errors',()=>{
 const round=make({section:'Reading and Writing',skill:'Linear Functions',difficulty:'Medium'});assert.ok(round.questionIds.every(id=>{const q=questions.find(q=>q.id===id);return q.section==='Reading and Writing'&&q.skill==='Linear Functions'&&q.difficulty==='Medium';}));
 assert.throws(()=>make({difficulty:'Hard'}),/readiness/);assert.ok(make({difficulty:'Hard',allowHard:true}).questionIds.every(id=>questions.find(q=>q.id===id).difficulty==='Hard'));
 assert.throws(()=>make({skill:'No such skill'}),/0 are available/);assert.throws(()=>make({count:7}));assert.throws(()=>make({pace:'instant'}));
 assert.equal(make({count:20}).questionIds.length,20);
});
test('section-specific pace clocks persist exact deadlines through a backup reload',()=>{
 for(const [section,base] of [['Math',95],['Reading and Writing',71]])for(const [pace,multiplier] of [['relaxed',1.5],['standard',1],['fast',.75]]){
  const round=make({section,pace});assert.equal(round.secondsPerQuestion,base*multiplier);assert.equal(round.deadline,now+base*multiplier*1000);assert.equal(rushRemaining(round,round.deadline-1),1);assert.equal(rushRemaining(round,round.deadline),0);
  const restored=validateRush(JSON.parse(JSON.stringify([round])),questions)[0];assert.equal(restored.deadline,round.deadline);assert.equal(restored.questionStartedAt,now);
 }
});
test('only correct answers earn time-based stars, wrong answers reset the streak, and first answers are immutable',()=>{
 const round=make(),q=qFor(round),first=submitRushAnswer(round,q,'42',true,now+10000);assert.equal(first.stars,3);assert.equal(first.streak,1);assert.equal(round.status,'feedback');assert.ok(Object.isFrozen(first));assert.ok(Object.isFrozen(first.source));
 assert.equal(submitRushAnswer(round,q,'wrong',false,now+11000),first);assert.equal(round.results.length,1);assert.equal(first.answer,'42');assert.equal(first.correct,true);
 assert.throws(()=>{first.correct=false;});advanceRush(round,now+15000);const second=submitRushAnswer(round,qFor(round),'7',{correct:true},now+15000+60000);assert.equal(second.stars,2);assert.equal(second.streak,2);
 advanceRush(round,now+80000);const wrong=submitRushAnswer(round,qFor(round),'9',false,now+80001);assert.equal(wrong.stars,0);assert.equal(wrong.streak,0);assert.equal(round.bestStreak,2);
 advanceRush(round,now+90000);assert.equal(submitRushAnswer(round,qFor(round),'1',true,now+180000).stars,1);
 assert.deepEqual(validateRush([round],questions)[0].results,round.results);
});
test('returning after a deadline records exactly one null-answer timeout and waits in feedback',()=>{
 const round=make(),deadline=round.deadline,originalIds=[...round.exposedIds],away=deadline+86400000;
 assert.equal(advanceRush(round,away),false);assert.equal(round.status,'feedback');assert.equal(round.index,0);assert.deepEqual(round.exposedIds,originalIds);assert.equal(round.results.length,1);
 const result=round.results[0];assert.equal(result.answer,null);assert.equal(result.correct,false);assert.equal(result.timeout,true);assert.equal(result.timedOut,true);assert.equal(result.stars,0);assert.equal(result.elapsedMs,95000);assert.equal(expireRush(round,away+1),null);
 assert.equal(advanceRush(round,away+5000),true);assert.equal(round.index,1);assert.equal(round.questionStartedAt,away+5000);assert.equal(round.deadline,away+5000+95000);assert.equal(rushRemaining(round,away+5000),95);
 assert.equal(validateRush([round],questions)[0].index,1);
});
test('an answer at the deadline cannot earn credit and a skipped question has a distinct feedback result',()=>{
 const round=make();const late=submitRushAnswer(round,qFor(round),'right answer',true,round.deadline);assert.equal(late.timeout,true);assert.equal(late.answer,null);assert.equal(late.correct,false);
 advanceRush(round,round.deadline+1);const skipped=skipRush(round,qFor(round),round.questionStartedAt+1000);assert.equal(skipped.skipped,true);assert.equal(skipped.timeout,false);assert.equal(skipped.answer,null);assert.equal(skipped.stars,0);assert.equal(round.status,'feedback');
 assert.equal(rushSummary(round).timedOut,1);assert.equal(rushSummary(round).skipped,1);assert.equal(rushSummary(round).incorrect,0);assert.equal(rushSummary(round).unanswered,2);
});
test('ending releases unexposed reservations and preserves exposed IDs without recording an invented answer',()=>{
 const round=make(),all=[...round.questionIds];assert.equal(endRush(round,now+1000),true);assert.equal(round.status,'ended');assert.equal(round.results.length,0);assert.deepEqual([...rushTaken([round])],[all[0]]);assert.equal(endRush(round,now+2000),false);
 const rest=questions.filter(q=>all.includes(q.id));const next=createRush(rest,new Set(),{count:5,section:'Math',now:now+1});assert.equal(next.questionIds.length,5);
 assert.deepEqual(validateRush([round],questions)[0].exposedIds,[all[0]]);assert.equal(rushSummary(round).unanswered,1);assert.equal(rushSummary(round).unseen,4);assert.equal(rushSummary(round).seen,1);assert.equal(rushSummary(round).accuracy,0);assert.equal(rushSummary(round).elapsedMs,1000);
});
test('ending an overdue active question preserves its timeout before releasing remaining IDs',()=>{
 const round=make();endRush(round,round.deadline+10000);assert.equal(round.status,'ended');assert.equal(round.results.length,1);assert.equal(round.results[0].timeout,true);assert.deepEqual([...rushTaken([round])],round.exposedIds);assert.equal(validateRush([round],questions)[0].results[0].answer,null);
});
test('a completed Rush produces exact-skill summaries and no session or mastery record',()=>{
 const round=make(),state={sessions:[],studio:{learning:{retention:{}}}},untouched=structuredClone(state);
 for(let i=0;i<5;i++){const start=round.questionStartedAt;submitRushAnswer(round,qFor(round),'1',i<3,start+1000);advanceRush(round,start+2000);}
 assert.equal(round.status,'complete');const summary=rushSummary(round);assert.equal(summary.answered,5);assert.equal(summary.correct,3);assert.equal(summary.incorrect,2);assert.equal(summary.stars,9);assert.equal(summary.maxStars,15);assert.equal(summary.bestStreak,3);assert.equal(summary.accuracy,.6);assert.equal(summary.elapsedMs,5000);assert.equal(summary.skills.reduce((n,s)=>n+s.total,0),5);assert.equal(summary.skills.reduce((n,s)=>n+s.correct,0),3);assert.ok(summary.skills.every(s=>['Slope from context','Quadratic model'].includes(s.skill)));
 assert.deepEqual(state,untouched);assert.deepEqual([...rushTaken([round])],round.exposedIds);assert.equal(validateRush([round],questions)[0].status,'complete');
 summary.results[0].correct=false;assert.equal(round.results[0].correct,true);
});
test('backup validation rejects duplicate rounds, mismatched exposure, forged deadlines and rewritten star totals',()=>{
 const round=make();assert.throws(()=>validateRush([round,round],questions));
 for(const mutate of [r=>r.exposedIds.push(r.questionIds[1]),r=>r.deadline++,r=>r.questionIds[1]=r.questionIds[0],r=>r.id=123,r=>r.index=2]){const bad=structuredClone(round);mutate(bad);assert.throws(()=>validateRush([bad],questions));}
 submitRushAnswer(round,qFor(round),'1',true,now+1000);const forged=structuredClone(round);forged.results[0].stars=0;assert.throws(()=>validateRush([forged],questions));
 assert.throws(()=>validateRush([round],questions.filter(q=>q.id!==round.questionIds[0])));assert.deepEqual(validateRush(null),[]);
});
test('backup merge preserves local first answers and rejects same-ID restarts while accepting compatible progress',()=>{
 const base=make({id:'shared'}),local=structuredClone(base),incoming=structuredClone(base);
 submitRushAnswer(local,qFor(local),'wrong',false,now+1000);submitRushAnswer(incoming,qFor(incoming),'right',true,now+1000);assert.equal(mergeRush([local],[incoming],questions)[0].results[0].correct,false);
 const ahead=structuredClone(local);advanceRush(ahead,now+2000);submitRushAnswer(ahead,qFor(ahead),'second',true,now+3000);const merged=mergeRush([local],[ahead],questions)[0];assert.equal(merged.results.length,2);assert.equal(merged.results[0].answer,'wrong');
 const restart=make({id:'shared',seed:999,now:now+5000});assert.deepEqual(mergeRush([local],[restart],questions)[0].questionIds,local.questionIds);
 const ended=structuredClone(local);endRush(ended,now+4000);assert.equal(mergeRush([ended],[ahead],questions)[0].status,'ended');
 assert.deepEqual(local.results.length,1);assert.deepEqual(incoming.results.length,1);
});
test('wrong-question and backwards-clock submissions cannot corrupt a round',()=>{
 const round=make(),original=structuredClone(round);assert.throws(()=>submitRushAnswer(round,{id:'wrong'},'a',true,now+100));assert.throws(()=>submitRushAnswer(round,qFor(round),'a',true,now-1));assert.throws(()=>submitRushAnswer(round,qFor(round),'a',undefined,now+1));assert.deepEqual(round,original);
 assert.equal(advanceRush(round,now+100),false);assert.equal(round.index,0);submitRushAnswer(round,qFor(round),'a',true,now+100);assert.throws(()=>advanceRush(round,now+99));assert.throws(()=>endRush(round,now+99));
});

test('conflicting remote progress conserves all exposed IDs and closes the round without replacing local answers',()=>{
 const base=make({id:'conflict-exposure'}),local=structuredClone(base),remote=structuredClone(base);
 submitRushAnswer(local,qFor(local),'local wrong',false,now+1000);submitRushAnswer(remote,qFor(remote),'remote correct',true,now+1000);advanceRush(remote,now+2000);submitRushAnswer(remote,qFor(remote),'remote second',true,now+3000);advanceRush(remote,now+4000);
 const merged=mergeRush([local],[remote],questions)[0];assert.equal(merged.results.length,1);assert.equal(merged.results[0].answer,'local wrong');assert.equal(merged.status,'ended');assert.deepEqual(merged.exposedIds,remote.exposedIds);assert.deepEqual([...rushTaken([merged])],remote.exposedIds);assert.equal(rushSummary(merged).unanswered,2);assert.equal(validateRush([merged],questions)[0].status,'ended');
 assert.equal(local.status,'feedback');assert.equal(local.exposedIds.length,1);
});

test('an ended local round still retains questions exposed by a compatible remote backup',()=>{
 const base=make({id:'ended-exposure'}),local=structuredClone(base),remote=structuredClone(base);endRush(local,now+1000);submitRushAnswer(remote,qFor(remote),'answer',true,now+1000);advanceRush(remote,now+2000);
 const merged=mergeRush([local],[remote],questions)[0];assert.equal(merged.status,'ended');assert.equal(merged.results.length,0);assert.deepEqual(merged.exposedIds,remote.exposedIds);assert.equal(validateRush([merged],questions)[0].status,'ended');assert.equal(rushTaken([merged]).size,2);
});
