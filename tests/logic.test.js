import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate,gradeAnswer,stableSession,advanceSession,usedIds} from '../dist/logic.js';
test('numeric grading accepts equivalent fractions',()=>{assert.equal(calculate('2(3+4)'),14);assert.ok(gradeAnswer({accepted:['0.25']},'1/4'));assert.ok(!gradeAnswer({accepted:['0.25']},'25'));});
test('help and reasoning affect readiness',()=>{const record={correct:true,hintsUsed:0,revealed:false,setupCorrect:true};const s={completed:true,records:Array.from({length:5},()=>({...record}))};assert.ok(stableSession(s));s.records[0].hintsUsed=1;s.records[1].setupCorrect=false;assert.ok(!stableSession(s));});
test('repeated navigation cannot skip an unanswered question',()=>{const s={index:0,questionIds:['first','second'],records:[{questionId:'first'}],completed:false};assert.ok(advanceSession(s));assert.ok(!advanceSession(s));assert.equal(s.index,1);assert.deepEqual([...usedIds([{questionId:'old'}],[{records:[{questionId:'new'}]}])],['old','new']);});
