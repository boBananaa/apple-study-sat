import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESSONS,VOCAB,ROOTS,CHALLENGE} from '../dist/learning-content.js';
import {SKILLS,rankSkills} from '../dist/planner.js';
import {initializeStudio,award,activity,recordReview,rateVocabulary,createExam,submitExamModule,startNextModule,remainingSeconds,finishExam,examTaken,importStudio,mergeStudio,chooseQuestions} from '../dist/studio-logic.js';
// Synthetic fixtures only; no official question assets are bundled.
const questions=['Math','Reading and Writing'].flatMap(section=>Object.entries(SKILLS[section]).flatMap(([k,skill])=>Array.from({length:12},(_,i)=>({id:section.replaceAll(' ','')+'-'+k+'-'+i,section,skill,domain:section==='Math'?['Algebra','Advanced Math','Problem-Solving and Data Analysis','Geometry and Trigonometry'][Number(k)%4]:['Information and Ideas','Craft and Structure','Expression of Ideas','Standard English Conventions'][Number(k)%4],difficulty:['Easy','Medium','Hard'][i%3],answer:i%2?'B':'4',file:'Synthetic fixture.pdf',page:1,number:'1.1'}))));
const base=()=>({sessions:[],diagnostics:[],studio:initializeStudio({})});
test('curriculum covers every skill with original complete lessons and coherent prerequisites',()=>{
 assert.ok(LESSONS.length>=29);assert.equal(new Set(LESSONS.map(l=>l.id)).size,LESSONS.length);
 for(const section of Object.keys(SKILLS))assert.deepEqual([...new Set(LESSONS.filter(l=>l.section===section).map(l=>l.skill))].sort(),[...SKILLS[section]].sort());
 for(const l of LESSONS){assert.ok(l.steps.length>=3&&l.worked.prompt&&l.check.answer!==undefined&&l.rule);for(const id of l.prerequisites)assert.ok(LESSONS.some(x=>x.id===id));}
 assert.ok(VOCAB.length>=50&&ROOTS.length>=15);assert.equal(CHALLENGE.length,7);
});
test('full test has 98 unique questions and standard timing; taken/reserved IDs stay excluded',()=>{
 const taken=new Set(questions.slice(0,10).map(q=>q.id)),e=createExam(questions,taken,{kind:'full',now:100000,id:'test-one'});
 assert.deepEqual(e.modules.map(m=>m.questionIds.length),[27,27,22,22]);assert.deepEqual(e.modules.map(m=>m.seconds),[1920,1920,2100,2100]);
 const ids=e.modules.flatMap(m=>m.questionIds);assert.equal(new Set(ids).size,98);assert.ok(ids.every(id=>!taken.has(id)));
 assert.equal(remainingSeconds(e,101000),1919);assert.equal(remainingSeconds(e,2021000),0);
 const state=base();state.studio.exams.push(e);assert.equal(examTaken(state).size,98);
 assert.throws(()=>createExam(questions,taken,{kind:'invalid'}));assert.throws(()=>chooseQuestions([],new Set(),{section:'Math',count:12}));
});
test('submissions lock modules, route second module from results, preserve other reservations, and finish once',()=>{
 const state=base(),e=createExam(questions,new Set(),{kind:'section',section:'Math',now:100000,id:'test-two'});state.studio.exams.push(e);
 const bank=new Map(questions.map(q=>[q.id,q]));for(const id of e.modules[0].questionIds)e.modules[0].answers[id]=bank.get(id).answer;
 assert.ok(submitExamModule(e,questions,200000));assert.equal(e.status,'between');assert.equal(submitExamModule(e,questions),false);
 const oldIds=[...e.modules[0].questionIds];startNextModule(e,questions,examTaken(state),200001);assert.equal(e.modules[1].route,'hard');assert.ok(e.modules[1].questionIds.every(id=>!oldIds.includes(id)));
 submitExamModule(e,questions,300000);assert.equal(e.status,'complete');assert.ok(finishExam(state,e));assert.equal(finishExam(state,e),false);assert.equal(state.sessions.length,2);assert.equal(state.diagnostics.length,1);
 assert.ok(state.sessions.flatMap(s=>s.records).every(r=>r.setupAssessment==='exam_answer_only'&&r.setupCorrect===null));
 const ranks=rankSkills({section:'Math',diagnostics:state.diagnostics,sessions:state.sessions,questions});assert.ok(ranks.every(r=>r.practiceCount===0&&!r.stable));
});
test('full simulation has a ten-minute break between sections; diagnostics are untimed and update skills',()=>{
 const e=createExam(questions,new Set(),{kind:'full',now:100000,id:'test-three'});
 submitExamModule(e,questions,110000);startNextModule(e,questions,new Set(e.modules.flatMap(m=>m.questionIds)),110001);submitExamModule(e,questions,120000);
 assert.equal(e.status,'break');assert.equal(remainingSeconds(e,120000),600);
 const d=createExam(questions,new Set(),{kind:'diagnostic',section:'Math',now:1,id:'diagnostic'});assert.equal(d.modules.length,1);assert.equal(d.modules[0].questionIds.length,12);assert.equal(d.deadline,null);
 const state=base();submitExamModule(d,questions,10000);finishExam(state,d);assert.equal(state.diagnostics[0].rows.reduce((n,r)=>n+r.total,0),12);
});
test('spaced review and vocabulary track assistance and deduplicate daily XP',()=>{
 const state=base(),s=state.studio;
 const first=recordReview(s,'q',{correct:true,setup:'model',rule:'units'},'2037-10-21');assert.equal(first.due,'2037-10-22');
 const second=recordReview(s,'q',{correct:true,setup:'model',rule:'units'},'2037-10-22');assert.equal(second.due,'2037-10-25');
 const helped=recordReview(s,'q',{correct:true,hinted:true,setup:'model',rule:'units'},'2037-10-25');assert.equal(helped.successes,0);
 assert.throws(()=>recordReview(s,'x',{correct:true,setup:'',rule:'units'}));
 rateVocabulary(s,'word','good','2037-10-21');assert.equal(s.vocab.word.due,'2037-10-22');rateVocabulary(s,'word','again','2037-10-21');assert.equal(s.vocab.word.due,'2037-10-21');
 assert.equal(s.events.filter(e=>e.key==='vocab-word-2037-10-21').length,1);
 assert.ok(award(s,'unique',20,'lesson','2037-10-21T16:00:00Z'));assert.equal(award(s,'unique',20,'lesson'),false);assert.ok(activity(state,'2037-10-21').xp>0);
});
test('backup validates study data and merging keeps unique work from both browsers',()=>{
 const old=base().studio,incoming=base().studio;award(old,'one',10,'lesson');award(incoming,'two',20,'lesson');
 old.saved=[questions[0].id];incoming.saved=[questions[1].id];const merged=mergeStudio(old,importStudio(incoming,questions));assert.equal(merged.saved.length,2);assert.equal(merged.events.length,2);
 assert.throws(()=>importStudio({...incoming,weeklyGoal:'\" onfocus=evil'},questions));
 const malicious=structuredClone(incoming);malicious.events=[{key:'bad',points:'<script>',at:'today'}];assert.throws(()=>importStudio(malicious,questions));
 const e=createExam(questions,new Set(),{kind:'section',section:'Math',now:1,id:'safe'});incoming.exams.push(e);assert.equal(importStudio(incoming,questions).exams.length,1);
 incoming.exams[0].modules[0].questionIds[0]='missing';assert.throws(()=>importStudio(incoming,questions));
});
