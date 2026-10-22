/* Learning views. State, scoring, persistence, and events belong to the caller. */
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
const confidenceOptions = [['sure', 'Sure'], ['unsure', 'Unsure'], ['guessing', 'Guessing']];
const confidenceLabel = value => confidenceOptions.find(([key]) => key === value)?.[1] || 'Not recorded';
const action = (label, name, primary = false, attributes = '') => `<button type="button" class="${primary ? 'primary' : 'text-button'}" data-action="${name}" ${attributes}>${escapeText(label)}</button>`;

/** Native radio group with no default answer. Timed assessments can omit this view. */
export function confidenceMarkup(value, {name = 'confidence', disabled = false, required = true, timingCaption = ''} = {}) {
  return `<fieldset class="learning-confidence" ${disabled ? 'disabled' : ''}>
    <legend>How sure are you?${required ? '' : ' <span>Optional</span>'}</legend>
    <div class="learning-confidence-options">${confidenceOptions.map(([key, label]) => `<label class="learning-confidence-option"><input type="radio" name="${escapeText(name)}" value="${key}" data-confidence="${key}" ${value === key ? 'checked' : ''} ${required ? 'required' : ''}><span>${label}</span></label>`).join('')}</div>${timingCaption ? `<p class="learning-field-note">${escapeText(timingCaption)}</p>` : ''}
  </fieldset>`;
}

function correctionAnswer(question, value, prefix) {
  const multipleChoice = question.type === 'multiple-choice' || question.format === 'multiple-choice' || /^[A-D]$/.test(String(question.answer || '').trim());
  if (multipleChoice) return `<fieldset class="learning-retry-choices"><legend>Your new answer</legend><div>${['A', 'B', 'C', 'D'].map(letter => `<label><input type="radio" name="retryAnswer" value="${letter}" ${value === letter ? 'checked' : ''} required><span>${letter}</span></label>`).join('')}</div></fieldset>`;
  return `<label for="${prefix}-answer">Your new answer<input id="${prefix}-answer" name="retryAnswer" type="text" value="${escapeText(value)}" placeholder="Number, decimal, or fraction" autocomplete="off" required></label>`;
}

/**
 * solutionHtml must be trusted, caller-rendered markup. It is never included in hint/retry.
 * correction: {stage, attempts, draft?: {correctedSetup,retryAnswer,recognitionRule,errorType,methodChoice}}
 */
export function correctionMarkup({question = {}, record = {}, correction = {}, hint = '', setupPrompt = '', error = '', solutionHtml = '', continueLabel = 'Next question', allowContinue = true} = {}) {
  const stage = ['hint', 'retry', 'complete', 'revealed', 'skipped'].includes(correction.stage) ? correction.stage : 'hint';
  const reading = question.section === 'Reading and Writing';
  const prefix = `learning-correction-${String(question.id || 'question').replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const draft = correction.draft || correction;
  const attempts = Array.isArray(correction.attempts) ? correction.attempts : [];
  const lastAttempt = attempts.at(-1) || {};
  const current = (field, legacyField) => draft[field] ?? lastAttempt[field] ?? (legacyField ? lastAttempt[legacyField] : '') ?? '';
  const title = stage === 'complete' ? 'Correction complete' : stage === 'revealed' ? 'Review the solution' : stage === 'retry' ? 'Try the reasoning again' : 'Take another look';
  const firstAnswer = record.answer == null || record.answer === '' ? 'Not recorded' : record.answer;
  const initialNote = `<p class="learning-first-answer">First answer: <strong>${escapeText(firstAnswer)}</strong>${record.correct === true ? ' <span>(correct answer; reasoning needs review)</span>' : ''}${record.confidence ? ` <span>(${escapeText(confidenceLabel(record.confidence))})</span>` : ''}. It remains recorded.</p>`;
  const continuation = allowContinue ? action(continueLabel, 'next', true) : '';

  if (stage === 'skipped') return `<section class="learning-correction" aria-labelledby="${prefix}-title"><h3 id="${prefix}-title">Saved for later</h3><p class="learning-correction-note" role="status">You can return to this correction from review.</p>${initialNote}<div class="learning-correction-actions">${continuation}${action('Return to correction', 'correction-retry')}</div></section>`;

  if (stage === 'complete' || stage === 'revealed') {
    return `<section class="learning-correction ${stage === 'complete' ? 'learning-correction-complete' : ''}" aria-labelledby="${prefix}-title">
      <div class="learning-correction-heading"><h3 id="${prefix}-title">${title}</h3><span class="learning-result-label">${stage === 'complete' ? 'Assisted practice' : 'Solution revealed'}</span></div>
      <p class="learning-correction-note" role="status">${stage === 'complete' ? 'You worked through a correction. This is assisted practice; your first answer remains recorded.' : 'Use the solution to compare each step with your own. This question is recorded as assisted practice.'}</p>
      ${initialNote}
      ${lastAttempt.method ? `<p class="learning-correction-note">Method used: ${escapeText(({algebra:'Algebra',desmos:'Desmos',mental:'Mental reasoning',evidence:'Text evidence',grammar:'Grammar rule',other:'Other'})[lastAttempt.method]||lastAttempt.method)}</p>` : ''}
      ${solutionHtml ? `<div class="learning-worked-solution">${solutionHtml}</div>` : '<p class="learning-correction-note">A worked solution is not available for this question. Review the skill lesson for the method.</p>'}
      ${current('recognitionRule', 'rule') ? `<div class="learning-recognition"><strong>Your rule for next time</strong><p>${escapeText(current('recognitionRule', 'rule'))}</p></div>` : ''}
      <p class="learning-correction-note">A fresh question after a gap can check what you remember.</p>
      ${continuation ? `<div class="learning-correction-actions">${continuation}</div>` : ''}
    </section>`;
  }

  const hintMarkup = `<div class="learning-small-hint"><strong>A small hint</strong><p>${escapeText(hint || (reading ? 'Return to the exact words the question asks about. Which evidence or rule supports your choice?' : 'Name the quantity you need to find. Check that each term in your setup represents the right quantity and units.'))}</p></div>`;
  const skip = allowContinue ? action('Continue later', 'correction-skip') : '';
  if (stage === 'hint') return `<section class="learning-correction" aria-labelledby="${prefix}-title"><h3 id="${prefix}-title">${title}</h3><p class="learning-correction-note">${record.correct === true ? 'Your answer matched the key. Revisit the reasoning before moving on.' : 'Your first answer needs another look. Use the hint, then try a corrected setup and answer.'}</p>${initialNote}${hintMarkup}<div class="learning-correction-actions">${action('Try a correction', 'correction-retry', true)}${action('Show solution', 'correction-reveal')}${skip}</div></section>`;

  const errorTypes = ['Translation / model', 'Requested quantity', 'Concept / rule', 'Algebra / arithmetic', 'Evidence / meaning', 'Pacing', 'Unknown'];
  const methods = reading ? [['evidence', 'Text evidence'], ['grammar', 'Grammar rule'], ['mental', 'Mental reasoning']] : [['algebra', 'Algebra'], ['desmos', 'Desmos'], ['mental', 'Mental reasoning']];
  return `<section class="learning-correction" aria-labelledby="${prefix}-title">
    <h3 id="${prefix}-title">${title}</h3>${initialNote}${hintMarkup}
    <form id="correction-form" class="learning-correction-form" data-question-id="${escapeText(question.id || '')}">
      <label for="${prefix}-setup">${reading ? 'Corrected reasoning' : 'Corrected setup'}<textarea id="${prefix}-setup" name="correctedSetup" rows="3" required aria-describedby="${prefix}-setup-help">${escapeText(current('correctedSetup', 'setup'))}</textarea></label>
      <p id="${prefix}-setup-help" class="learning-field-note">${escapeText(setupPrompt || (reading ? 'Name the evidence or rule that now supports your choice.' : 'Write the equation or relationship, including what your variables mean.'))}</p>
      ${correctionAnswer(question, current('retryAnswer', 'answer'), prefix)}
      <div class="learning-correction-fields"><label for="${prefix}-error">What went wrong?<select id="${prefix}-error" name="errorType" required><option value="">Choose a reason</option>${errorTypes.map(value => `<option value="${escapeText(value)}" ${current('errorType') === value ? 'selected' : ''}>${escapeText(value)}</option>`).join('')}</select></label><label for="${prefix}-method">Method used <span class="learning-optional">Optional</span><select id="${prefix}-method" name="methodChoice"><option value="">Choose a method</option>${methods.map(([value, label]) => `<option value="${value}" ${current('methodChoice', 'method') === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label></div>
      <label for="${prefix}-rule">What will you recognize next time?<textarea id="${prefix}-rule" name="recognitionRule" rows="2" required placeholder="When I see…, I will…">${escapeText(current('recognitionRule', 'rule'))}</textarea></label>
      <p id="correction-error" class="learning-correction-error" role="alert">${escapeText(error)}</p>
      <div class="learning-correction-actions"><button type="submit" class="primary">Check correction</button>${action('Show solution', 'correction-reveal')}${skip}</div>
    </form>
  </section>`;
}

function retentionRow(item) {
  const due = item.status === 'due';
  const available = item.available === true || (typeof item.available === 'number' && item.available >= 3);
  const verified = item.status === 'verified';
  const unavailable = item.status === 'needs-library' || item.status === 'unavailable' || (due && !available);
  const timing = item.dueLabel || (unavailable ? 'Needs a fresh question' : due ? 'Due now' : verified ? 'Checked after a gap' : item.due ? `Due ${item.due}` : 'Scheduled');
  const missingCopy = typeof item.available === 'number' ? `This check needs 3 fresh questions; ${count(item.available)} available. Add more questions to check recall.` : 'This check needs 3 fresh questions. Add more questions to check recall.';
  return `<li class="learning-retention-row"><div><h4>${escapeText(item.skill || 'Skill check')}</h4>${item.section ? `<p>${escapeText(item.section)}</p>` : ''}<span class="learning-retention-timing ${verified ? 'learning-retention-verified' : ''}">${escapeText(timing)}</span>${item.passed === true ? '<span class="learning-retention-timing learning-retention-verified">Passed last delayed check</span>' : ''}${unavailable ? `<p class="learning-retention-unavailable">${missingCopy}</p>` : ''}</div>${due && available ? action('Start check', 'retention-start', false, `data-id="${escapeText(item.id || '')}"`) : ''}</li>`;
}

/** Due status is explicit: the view does not read the clock or select questions. */
export function retentionMarkup({dueCount = 0, pendingCount = 0, blockedCount = 0, verifiedCount = 0, items = [], nextDueLabel = '', emptyReason = ''} = {}) {
  const rows = Array.isArray(items) ? items : [];
  const due = count(dueCount), pending = count(pendingCount), blocked = count(blockedCount), verified = count(verifiedCount);
  const headingNote = due ? `${due} ${due === 1 ? 'check' : 'checks'} due` : blocked ? `${blocked} ${blocked === 1 ? 'check needs' : 'checks need'} questions` : pending ? `${pending} scheduled` : '';
  const emptyCopy = emptyReason || (blocked ? 'Each check needs 3 fresh questions. Add more questions for the skills ready to check.' : pending ? `Your checks are scheduled${nextDueLabel ? ` for ${nextDueLabel}` : ''}. Keep practicing while the gap gives you time to test recall.` : verified ? 'No checks are due right now. Keep practicing; skills can return for another check.' : 'Complete practice with a valid setup or reasoning. A fresh question after a gap will help check what you remember.');
  return `<section class="learning-retention"><div class="learning-section-heading"><h3>Check what stuck</h3>${headingNote ? `<span>${headingNote}</span>` : ''}</div><p class="learning-section-intro">Fresh questions after a gap check whether you can use the skill again.</p>${rows.length ? `<ul class="learning-retention-list">${rows.map(retentionRow).join('')}</ul>` : `<p class="learning-empty-note">${escapeText(emptyCopy)}</p>`}${verified ? `<p class="learning-evidence-note">Skills with a passed delayed check: <strong>${verified}</strong>. A few checks provide limited evidence; keep checking over time.</p>` : ''}</section>`;
}

/** Counts must describe first answers; corrected answers do not belong in calibration. */
export function calibrationMarkup({total = 0, unrated, medianSeconds = null, groups = [], message = '', focusSkills = []} = {}) {
  const source = Array.isArray(groups) ? groups : [];
  const rows = confidenceOptions.map(([confidence, label]) => {
    const group = source.find(item => item.confidence === confidence) || {};
    const attempted = count(group.total), correct = Math.min(attempted, count(group.correct));
    return {confidence, label, total: attempted, correct, helped: Math.min(attempted, count(group.helped)), independent: Math.min(correct, count(group.independent))};
  });
  const recorded = rows.reduce((sum, row) => sum + row.total, 0);
  const unratedCount = unrated == null ? Math.max(0, count(total) - recorded) : count(unrated);
  const helped = rows.reduce((sum, row) => sum + row.helped, 0), independent = rows.reduce((sum, row) => sum + row.independent, 0);
  const assistanceKnown = source.some(group => Number.isFinite(group.helped) || Number.isFinite(group.independent));
  const assistanceNote = assistanceKnown ? `<p class="learning-evidence-note">First-answer accuracy includes ${helped} ${helped === 1 ? 'answer' : 'answers'} with help. ${independent} ${independent === 1 ? 'answer was' : 'answers were'} independently correct with a valid setup or reasoning.</p>` : '';
  const timed = Number.isFinite(medianSeconds) && medianSeconds >= 0;
  const seconds = timed ? Math.round(medianSeconds) : 0;
  const duration = seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const timingMarkup = `<div class="learning-active-time"><span>Active study time median</span><strong>${timed ? `${duration} <small>per question</small>` : 'No timing data yet'}</strong><p>Visible, focused practice only; time away and older unrated answers are excluded.</p></div>`;
  const focus = (Array.isArray(focusSkills) ? focusSkills : []).filter(item => item.skill && (count(item.sureMisses) || count(item.uncertainCorrect)));
  const focusMarkup = focus.length ? `<div class="learning-confidence-focus"><div class="learning-section-heading"><h4>Skills to look at</h4><a href="#review">Review questions</a></div><ul>${focus.map(item => `<li><strong>${escapeText(item.skill)}</strong><span>${[count(item.sureMisses) ? `${count(item.sureMisses)} sure but incorrect` : '', count(item.uncertainCorrect) ? `${count(item.uncertainCorrect)} correct while unsure or guessing` : ''].filter(Boolean).join('; ')}</span></li>`).join('')}</ul></div>` : '';
  if (!recorded) return `<section class="learning-calibration"><h3>Confidence and accuracy</h3><p class="learning-empty-note">Choose Sure, Unsure, or Guessing before checking an answer. After a few questions, compare how each choice lined up with your first answer.</p>${unratedCount ? `<p class="learning-evidence-note">${unratedCount} ${unratedCount === 1 ? 'answer has' : 'answers have'} no confidence choice yet.</p>` : ''}${timingMarkup}${focusMarkup}</section>`;
  return `<section class="learning-calibration"><div class="learning-section-heading"><h3>Confidence and accuracy</h3><span>${recorded} ${recorded === 1 ? 'answer' : 'answers'} with confidence</span></div><p class="learning-section-intro">Compare how you felt with whether your first answer was correct.</p><div class="learning-calibration-table-wrap"><table class="learning-calibration-table"><caption class="sr-only">First-answer accuracy by confidence</caption><thead><tr><th scope="col">You felt</th><th scope="col">Correct / answered</th><th scope="col">Accuracy</th></tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${row.label}</th><td>${row.total ? `${row.correct} / ${row.total}` : 'No answers yet'}</td><td>${row.total ? `${Math.round(row.correct / row.total * 100)}%` : '<span aria-label="Not available">—</span>'}</td></tr>`).join('')}</tbody></table></div>${assistanceNote}<p class="learning-evidence-note">${escapeText(message || (recorded < 10 ? 'This is a small sample. Look for a pattern as you answer more questions.' : 'Use the pattern to decide when to double-check your reasoning. Confidence does not change your score.'))}</p>${unratedCount ? `<p class="learning-evidence-note">${unratedCount} ${unratedCount === 1 ? 'answer without a confidence choice is' : 'answers without a confidence choice are'} excluded from this comparison.</p>` : ''}${timingMarkup}${focusMarkup}</section>`;
}
