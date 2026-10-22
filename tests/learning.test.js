import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initializeLearning, markExposure, scheduleRetention, skillKey,
  newCorrection, retryCorrection, confidenceSummary,
  freshRetentionQuestions, retentionSummary, finishRetention,
  validateLearning, mergeLearning, validateLearningRecords, mergeLearningSessions,
} from '../dist/learning-logic.js';

// Entirely synthetic question data and fictional study dates.
const section = 'Math';
const skill = 'Linear Functions';
const originAt = '2037-10-20T16:00:00.000Z';
const due = '2037-10-23';
const questions = Array.from({length: 9}, (_, i) => ({
  id: `synthetic-learning-${i}`, section, skill,
  difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
  answer: '7', file: 'Synthetic fixture.pdf', page: 1, number: String(i + 1),
}));
const studio = () => ({learning: {version: 1, exposures: {}, retention: {}}});
const originalRecord = (question, extra = {}) => ({
  questionId: question.id, section, skill,
  answer: '7', correct: true, setup: 'y = 2x + 1', setupCorrect: true,
  hintsUsed: 0, revealed: false, submittedAt: originAt, ...extra,
});
function scheduled() {
  const s = studio();
  scheduleRetention(s, questions[0], originAt);
  return s;
}
function checkSession(extra = {}) {
  return {
    id: 'synthetic-check-one', type: 'retention', section,
    completed: true, retentionKey: skillKey(section, skill), retentionDue: due,
    questionIds: questions.slice(0, 3).map(q => q.id),
    records: questions.slice(0, 3).map(q => originalRecord(q)), ...extra,
  };
}

test('correction preserves the wrong first answer when assisted retry succeeds', () => {
  const record = originalRecord(questions[0], {answer: '3', correct: false, setupCorrect: false, confidence: 'sure'});
  const first = structuredClone(record);
  record.correction = newCorrection(record);
  assert.equal(record.correction.stage, 'hint');
  const attempt = retryCorrection(record, questions[0], {
    answer: '7', setup: 'y = 2x + 1; x = 3', rule: 'Substitute the requested input.', method: 'algebra',
  }, '2037-10-20T16:03:00.000Z');
  assert.equal(attempt.correct, true);
  assert.equal(attempt.assisted, true);
  assert.equal(record.correction.stage, 'complete');
  const {correction, ...retainedFirst} = record;
  assert.deepEqual(retainedFirst, first);
  const calibration = confidenceSummary([{section, records: [record]}], section);
  assert.equal(calibration.sureMisses, 1);
  assert.equal(calibration.groups.find(g => g.confidence === 'sure').correct, 0);
  assert.throws(() => retryCorrection(record, questions[0], {answer: '7', setup: 'work', rule: 'rule'}), /complete/);
});

test('wrong assisted retry gives another setup prompt without revealing the key', () => {
  const record = originalRecord(questions[0], {answer: '3', correct: false});
  record.correction = newCorrection(record);
  const attempt = retryCorrection(record, questions[0], {answer: '5', setup: 'y = 2x', rule: 'Check the starting value.'});
  assert.equal(attempt.correct, false);
  assert.equal(record.correction.stage, 'retry');
  assert.ok(record.correction.error.length > 0);
  assert.ok(!record.correction.error.includes(questions[0].answer));
  assert.equal(record.answer, '3');
  assert.equal(record.correct, false);
  assert.throws(() => retryCorrection(record, questions[0], {answer: '7', setup: '', rule: 'check'}), /corrected approach/);
  assert.equal(record.correction.attempts.length, 1);
});

test('correct first answer with invalid setup needs correction; reveal is recorded explicitly', () => {
  assert.equal(newCorrection(originalRecord(questions[0])), null);
  assert.equal(newCorrection(originalRecord(questions[0], {setupCorrect: false})).stage, 'hint');
  const revealed = newCorrection(originalRecord(questions[0], {answer: null, correct: false, revealed: true}));
  assert.equal(revealed.stage, 'revealed');
  assert.equal(revealed.hintShown, false);
});

test('legacy confidence remains unrated and assessments do not change practice calibration', () => {
  const records = [
    originalRecord(questions[0]),
    originalRecord(questions[1], {confidence: 'sure', correct: false}),
    originalRecord(questions[2], {confidence: 'guessing'}),
    originalRecord(questions[3], {confidence: 'unsure', hintsUsed: 1}),
  ];
  const summary = confidenceSummary([
    {section, records},
    {section, type: 'assessment', records: [originalRecord(questions[4], {confidence: 'sure'})]},
    {section: 'Reading and Writing', records: [{...records[1], section: 'Reading and Writing'}]},
  ], section);
  assert.equal(summary.total, 3);
  assert.equal(summary.unrated, 1);
  assert.equal(summary.sureMisses, 1);
  assert.equal(summary.uncertainCorrect, 2);
  assert.equal(summary.groups.find(g => g.confidence === 'unsure').independent, 0);
  assert.equal(summary.groups.find(g => g.confidence === 'unsure').helped, 1);
  const legacy = confidenceSummary([{section, records: [records[0]]}], section);
  assert.equal(legacy.total, 0);
  assert.equal(legacy.medianSeconds, null);
  assert.match(legacy.message, /unrated/);
});

test('retention scheduling preserves the original due date across more practice', () => {
  const s = studio();
  const first = structuredClone(scheduleRetention(s, questions[0], originAt));
  scheduleRetention(s, questions[1], '2037-10-22T16:00:00.000Z');
  assert.deepEqual(s.learning.retention[skillKey(section, skill)], first);
  assert.equal(first.due, due);
});

test('fresh checks exclude used and exposed IDs and keep exact section and skill', () => {
  const s = scheduled();
  assert.equal(markExposure(s, questions[1].id, originAt), true);
  assert.equal(markExposure(s, questions[1].id, '2037-10-21T16:00:00.000Z'), false);
  const otherSkill = {...questions[4], id: 'synthetic-other-skill', skill: 'Circles'};
  const otherSection = {...questions[4], id: 'synthetic-other-section', section: 'Reading and Writing'};
  const taken = new Set([questions[4].id]);
  const entry = s.learning.retention[skillKey(section, skill)];
  const selected = freshRetentionQuestions(s, [...questions, otherSkill, otherSection], taken, entry);
  assert.equal(selected.length, 3);
  assert.ok(selected.every(q => q.section === section && q.skill === skill));
  assert.ok(selected.every(q => !taken.has(q.id) && q.id !== questions[1].id));
  assert.equal(selected[0].id, questions[7].id);
});

test('insufficient fresh pool is explicit and does not record a passed check', () => {
  const s = scheduled();
  const result = retentionSummary(s, questions.slice(0, 2), new Set(), section, due);
  assert.equal(result.blockedCount, 1);
  assert.equal(result.items[0].available, 2);
  assert.equal(result.items[0].status, 'needs-library');
  assert.equal(result.verifiedCount, 0);
  assert.equal(s.learning.retention[skillKey(section, skill)].checks.length, 0);
});

test('three independent original approaches after due finalize once and schedule seven days', () => {
  const s = scheduled(), session = checkSession();
  const result = finishRetention(s, session, due);
  assert.equal(result.passed, true);
  assert.equal(result.independent, 3);
  assert.equal(result.total, 3);
  assert.equal(s.learning.retention[session.retentionKey].due, '2037-10-30');
  assert.equal(finishRetention(s, session, '2037-10-24'), null);
  assert.equal(s.learning.retention[session.retentionKey].checks.length, 1);
  assert.equal(s.learning.retention[session.retentionKey].due, '2037-10-30');
});

test('assisted or previously exposed answers fail the check and schedule one day', () => {
  for (const extra of [{hintsUsed: 1}, {revealed: true, correct: false}, {previouslyExposed: true}, {setupCorrect: false}]) {
    const s = scheduled(), session = checkSession();
    Object.assign(session.records[0], extra);
    const result = finishRetention(s, session, due);
    assert.equal(result.passed, false);
    assert.equal(s.learning.retention[session.retentionKey].due, '2037-10-24');
  }
});

test('unknown original setup waits for self-check and early completion cannot certify retention', () => {
  const s = scheduled(), session = checkSession();
  session.records[0].setupCorrect = null;
  assert.equal(finishRetention(s, session, due), null);
  assert.equal(session.retentionFinalized, undefined);
  assert.equal(s.learning.retention[session.retentionKey].checks.length, 0);
  session.records[0].setupCorrect = true;
  assert.equal(finishRetention(s, session, '2037-10-22').passed, false);
});

test('exposure merge keeps earliest observation without mutating either input', () => {
  const a = initializeLearning(studio()), b = initializeLearning(studio());
  a.exposures[questions[0].id] = '2037-10-22T16:00:00.000Z';
  b.exposures[questions[0].id] = originAt;
  b.exposures[questions[1].id] = originAt;
  const beforeA = structuredClone(a), beforeB = structuredClone(b);
  const merged = mergeLearning(a, b);
  assert.equal(merged.exposures[questions[0].id], originAt);
  assert.equal(merged.exposures[questions[1].id], originAt);
  assert.deepEqual(a, beforeA);
  assert.deepEqual(b, beforeB);
  assert.deepEqual(mergeLearning(merged, b), merged);
});

test('learning backups support absent legacy data and reject invalid evidence', () => {
  assert.deepEqual(validateLearning(undefined, questions), {version: 1, exposures: {}, retention: {}});
  const s = scheduled();
  markExposure(s, questions[0].id, originAt);
  finishRetention(s, checkSession(), due);
  assert.deepEqual(validateLearning(s.learning, questions), s.learning);
  const badDate = structuredClone(s.learning);
  badDate.exposures[questions[0].id] = 'not-a-date';
  assert.throws(() => validateLearning(badDate, questions), /exposure date/);
  const badDue = structuredClone(s.learning);
  badDue.retention[skillKey(section, skill)].due = '2037-02-30';
  assert.throws(() => validateLearning(badDue, questions), /delayed check/);
  const badKey = structuredClone(s.learning);
  badKey.retention.incorrect = badKey.retention[skillKey(section, skill)];
  assert.throws(() => validateLearning(badKey, questions), /delayed check/);
  assert.doesNotThrow(() => validateLearningRecords([{records: [originalRecord(questions[0])]}]));
  assert.throws(() => validateLearningRecords([{records: [originalRecord(questions[0], {confidence: 'certain'})]}]), /confidence/);
  assert.throws(() => validateLearningRecords([{records: [originalRecord(questions[0], {activeSeconds: -1})]}]), /active practice time/);
  const forgedCorrection = originalRecord(questions[0], {correction: {stage: 'complete', attempts: [{setup: 'work', answer: '7', rule: 'check', correct: true, assisted: false, at: originAt}]}});
  assert.throws(() => validateLearningRecords([{records: [forgedCorrection]}]), /correction attempt/);
});

test('equal-length backup sessions merge correction progress and original approach review', () => {
  const record = originalRecord(questions[0], {answer: '3', correct: false, setupCorrect: null});
  record.correction = {...newCorrection(record), updatedAt: originAt};
  const before = {id: 'synthetic-merge-one', section, questionIds: [questions[0].id], index: 0, drafts: {}, records: [record], completed: false};
  const incoming = structuredClone(before);
  const retryAt = '2037-10-20T16:03:00.000Z';
  retryCorrection(incoming.records[0], questions[0], {answer: '7', setup: 'y = 2x + 1; x = 3', rule: 'Substitute the requested input.'}, retryAt);
  incoming.records[0].correction.updatedAt = retryAt;
  incoming.records[0].setupCorrect = false;
  incoming.records[0].approachReviewedAt = retryAt;
  incoming.completed = true;
  incoming.completedAt = retryAt;
  const source = structuredClone(before);
  const merged = mergeLearningSessions([before], [incoming]);
  assert.equal(merged[0].records.length, 1);
  assert.equal(merged[0].records[0].answer, '3');
  assert.equal(merged[0].records[0].correct, false);
  assert.equal(merged[0].records[0].setupCorrect, false);
  assert.equal(merged[0].records[0].correction.stage, 'complete');
  assert.equal(merged[0].records[0].correction.attempts.length, 1);
  assert.equal(merged[0].completed, true);
  assert.deepEqual(before, source);
  assert.deepEqual(mergeLearningSessions(merged, [incoming]), merged);
});

test('conflicting first-answer backups reject atomically instead of upgrading the result', () => {
  const before = {id: 'synthetic-merge-conflict', section, questionIds: [questions[0].id], index: 0, drafts: {}, records: [originalRecord(questions[0], {answer: '3', correct: false})]};
  const source = structuredClone(before);
  const incoming = structuredClone(before);
  incoming.records[0].answer = '7';
  incoming.records[0].correct = true;
  assert.throws(() => mergeLearningSessions([before], [incoming]), /Conflicting first attempt/);
  assert.deepEqual(before, source);
});

test('correction UI withholds solutions in hint, retry and skipped stages',async()=>{
 const {correctionMarkup,confidenceMarkup,retentionMarkup}=await import('../dist/learning-ui.js');
 for(const stage of ['hint','retry','skipped']){
  const html=correctionMarkup({question:{id:'synthetic',section:'Math',answer:'B'},record:{answer:'A',correct:false},correction:{stage,attempts:[]},solutionHtml:'SOLUTION_MUST_STAY_HIDDEN'});
  assert.ok(!html.includes('SOLUTION_MUST_STAY_HIDDEN'));
 }
 const confidence=confidenceMarkup('');assert.ok(confidence.includes('required'));assert.ok(!confidence.includes('checked'));
 const blocked=retentionMarkup({items:[{id:'x',skill:'Linear Functions',status:'due',available:2}]});assert.ok(!blocked.includes('data-action="retention-start"'));
});

test('an already recorded delayed check cannot be re-finalized from a stale backup',()=>{
 const studio={};initializeLearning(studio);const q={section:'Math',skill:'Linear Functions'};
 const entry=scheduleRetention(studio,q,'2037-03-01T12:00:00Z');
 const session={id:'duplicate-check',type:'retention',completed:true,retentionKey:skillKey(q.section,q.skill),retentionDue:entry.due,questionIds:['fresh-a','fresh-b','fresh-c'],records:['fresh-a','fresh-b','fresh-c'].map(questionId=>({questionId,...q,correct:true,hintsUsed:0,revealed:false,setupCorrect:true}))};
 finishRetention(studio,session,'2037-03-04');const due=entry.due;
 delete session.retentionFinalized;assert.equal(finishRetention(studio,session,'2037-03-20'),null);assert.equal(entry.due,due);assert.equal(entry.checks.length,1);
});

test('a correct answer marked guessing stays raw correct but does not certify retention',()=>{
 const studio={};initializeLearning(studio);const q={section:'Math',skill:'Linear Functions'};
 const entry=scheduleRetention(studio,q,'2037-03-01T12:00:00Z');
 const session={id:'guessed-check',type:'retention',completed:true,retentionKey:skillKey(q.section,q.skill),retentionDue:entry.due,questionIds:['fresh-a','fresh-b','fresh-c'],records:['fresh-a','fresh-b','fresh-c'].map((questionId,i)=>({questionId,...q,correct:true,hintsUsed:0,revealed:false,setupCorrect:true,confidence:i?'sure':'guessing'}))};
 assert.equal(finishRetention(studio,session,'2037-03-04').passed,false);assert.ok(session.records.every(r=>r.correct));
});
