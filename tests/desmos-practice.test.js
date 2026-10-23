import test from 'node:test';
import assert from 'node:assert/strict';
import {DESMOS_TIPS,DESMOS_PRACTICE} from '../dist/desmos-content.js';
import {practiceNumber,checkDesmosPractice,getDesmosPracticeRecord,submitDesmosPractice,retryDesmosPractice,validateDesmosPractice,mergeDesmosPractice,createDesmosPractice} from '../dist/desmos-practice.js';
import {createDesmosGuide} from '../dist/desmos-ui.js';

const expected={
 'function-value':26,'function-translations':3,'intercepts-and-answer-format':7/6,'linear-table-fit':43,'quadratic-table-fit':2,'system-intersection':14,'slider-tangency':-9,'left-right-roots':6,
 'parameter-root-choices':'B','parameter-point-trace':'C','inequality-feasibility':'B','inequality-extrema':8,'graphical-equivalence':'D','custom-rational-fit':1,'polynomial-from-zeros':30,'coefficient-list-identity':-18,
 'radicals-and-exponent-fit':5/3,'vertex-constraints-counterexample':'A','regression-nonuniqueness':0,'literal-in-terms':'C','combined-list-regression':5,'three-constraint-quadratic':-2,'percentage-chains':149.6,'list-descriptive-statistics':6.5,
 'missing-mean-value':89,'standard-deviation-transformations':3,'trig-angle-mode':6.9,'circle-center-radius-extrema':11,'coordinate-distance-midpoint':5,'word-model-then-calculate':6,'statistics-interpretation-limits':'B','solution-count-algebra':4
};
function prepared(id='function-value'){
 const state={sessions:[],studio:{learning:{sentinel:true}}},row=getDesmosPracticeRecord(state,id);
 row.draft.setup='Define the function and evaluate its requested input.';row.draft.setupCommitted=true;row.draft.answer=String(expected[id]);return {state,row};
}
test('each of 32 methods has exactly one labeled original application with complete teaching fields',()=>{
 assert.equal(DESMOS_TIPS.length,32);assert.equal(DESMOS_PRACTICE.length,32);
 assert.deepEqual(DESMOS_PRACTICE.map(p=>p.tipId).sort(),DESMOS_TIPS.map(t=>t.id).sort());
 assert.equal(new Set(DESMOS_PRACTICE.map(p=>p.id)).size,32);
 for(const p of DESMOS_PRACTICE){assert.equal(p.source,'Original Desmos practice');assert.match(p.id,/^desmos-original-/);for(const field of ['prompt','setupPrompt','hint','explanation','rule'])assert.ok(p[field].length>20,`${p.tipId} ${field}`);assert.ok(p.lines.length);if(p.kind==='choice'){assert.equal(p.options.length,4);assert.match(p.answer,/^[A-D]$/);}assert.ok(checkDesmosPractice(p.tipId,String(expected[p.tipId])),p.tipId);assert.equal(checkDesmosPractice(p.tipId,p.kind==='choice'?'Z':'999999'),false);}
});
test('numeric grading accepts exact fractions, signed decimals, and zero without evaluating code',()=>{
 assert.equal(practiceNumber('−2'),-2);assert.equal(practiceNumber(' 7 / 6 '),7/6);assert.equal(practiceNumber('.5'),.5);assert.equal(practiceNumber('0'),0);
 for(const bad of ['', ' ', '1/0','2+2','Infinity','NaN','1,000','2abc','0x10','alert(1)'])assert.ok(Number.isNaN(practiceNumber(bad)));
 assert.equal(checkDesmosPractice('intercepts-and-answer-format','7/6'),true);assert.equal(checkDesmosPractice('intercepts-and-answer-format','1.17'),false);
 assert.equal(checkDesmosPractice('trig-angle-mode','6.9'),true);assert.equal(checkDesmosPractice('trig-angle-mode','6.8829'),false);
});
test('an original answer cannot be checked before a saved setup and a valid answer',()=>{
 const state={},row=getDesmosPracticeRecord(state,'function-value');row.draft.answer='26';assert.throws(()=>submitDesmosPractice(state,'function-value'),/setup/);
 row.draft.setup='Evaluate f at −2.';assert.throws(()=>submitDesmosPractice(state,'function-value'),/setup/);
 row.draft.setupCommitted=true;row.draft.answer='';assert.throws(()=>submitDesmosPractice(state,'function-value'),/answer/);
 row.draft.answer='26 apples';assert.throws(()=>submitDesmosPractice(state,'function-value'),/number/);
 assert.equal(row.firstAttempt,null);assert.deepEqual(row.attempts,[]);
});
test('first response and hint status survive retries, repeated clicks, and reloads without official mastery writes',()=>{
 const {state,row}=prepared();row.draft.answer='25';row.draft.hintUsed=true;
 const first=submitDesmosPractice(state,'function-value','2026-10-23T10:00:00Z');assert.equal(first.correct,false);assert.equal(first.hintsUsed,1);assert.equal(first.explanationSeen,false);
 const snapshot=structuredClone(row.firstAttempt);row.draft.answer='26';submitDesmosPractice(state,'function-value');assert.equal(row.attempts.length,1);
 retryDesmosPractice(state,'function-value');row.draft.setup='f(-2) after checking signs';row.draft.setupCommitted=true;row.draft.answer='26';
 const second=submitDesmosPractice(state,'function-value','2026-10-23T10:02:00Z');assert.equal(second.correct,true);assert.equal(second.explanationSeen,true);assert.equal(second.hintsUsed,0);assert.equal(second.referenceHelp,true);
 assert.deepEqual(row.firstAttempt,snapshot);assert.notEqual(row.firstAttempt,row.attempts[0]);assert.equal(row.attempts.length,2);
 const restored=validateDesmosPractice(JSON.parse(JSON.stringify(state.studio.desmosPractice)));assert.deepEqual(restored['function-value'].firstAttempt,snapshot);
 assert.deepEqual(state.sessions,[]);assert.deepEqual(state.studio.learning,{sentinel:true});assert.equal(state.studio.events,undefined);
});
test('backup validation rejects malformed records and merge preserves local first response without sharing objects',()=>{
 const {state}=prepared();submitDesmosPractice(state,'function-value','2026-10-23T10:00:00Z');const existing=state.studio.desmosPractice;
 const other=prepared();other.row.draft.answer='25';other.row.draft.hintUsed=true;submitDesmosPractice(other.state,'function-value','2026-10-23T10:05:00Z');
 const merged=mergeDesmosPractice(existing,other.state.studio.desmosPractice);assert.equal(merged['function-value'].firstAttempt.correct,true);assert.equal(merged['function-value'].firstAttempt.hintsUsed,0);assert.equal(merged['function-value'].attempts.length,2);assert.equal(merged['function-value'].draft.hintUsed,true);
 merged['function-value'].firstAttempt.answer='changed';assert.equal(existing['function-value'].firstAttempt.answer,'26');
 assert.deepEqual(validateDesmosPractice({unknown:{}}),{});assert.throws(()=>validateDesmosPractice([]),/Invalid/);
 const invalid=structuredClone(existing);invalid['function-value'].attempts[0].submittedAt='nonsense';assert.throws(()=>validateDesmosPractice(invalid),/Invalid/);
 assert.equal(mergeDesmosPractice(existing,existing)['function-value'].attempts.length,1);
});
test('practice markup withholds explanation and answer input until the learner completes the required steps',()=>{
 const {state,row}=prepared(),ui=createDesmosPractice({getState:()=>state});row.draft.setupCommitted=false;
 let html=ui.markup('function-value');assert.match(html,/Original Desmos practice/);assert.match(html,/Not an official SAT question/);assert.doesNotMatch(html,/data-practice-field="answer"/);assert.doesNotMatch(html,/Correct answer:|Recognition rule:|One valid setup/);assert.doesNotMatch(html,/Keep parentheses around a negative input/);
 row.draft.setupCommitted=true;row.draft.hintUsed=true;html=ui.markup('function-value');assert.match(html,/data-practice-field="answer"/);assert.match(html,/Keep parentheses around a negative input/);assert.doesNotMatch(html,/Recognition rule:/);
 submitDesmosPractice(state,'function-value');html=ui.markup('function-value');assert.match(html,/Correct answer: 26/);assert.match(html,/Recognition rule:/);assert.match(html,/not automatically graded/);
});
test('all expanded library methods contain their application exercise and learner input is escaped',()=>{
 const state={};const guide=createDesmosGuide({getState:()=>state,getData:()=>({questions:[]})});const html=guide.render();assert.equal((html.match(/data-practice-tip=/g)||[]).length,32);
 const ui=createDesmosPractice({getState:()=>state}),row=getDesmosPracticeRecord(state,'function-value');row.draft.setup='<img src=x onerror=alert(1)>';assert.match(ui.markup('function-value'),/&lt;img/);assert.doesNotMatch(ui.markup('function-value'),/<img/);
 assert.doesNotThrow(()=>createDesmosGuide({getData:()=>({questions:[]})}).render());
});
