/* Pure views for the daily path. The caller supplies dates, recommendations and actions. */
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const list = value => Array.isArray(value) ? value : [];
const states = new Set(['available', 'current', 'done', 'upcoming', 'blocked']);
const stateOf = value => states.has(value) ? value : value === 'complete' ? 'done' : 'available';
const icons = {
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  book: '<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
  pencil: '<path d="m15 5 4 4M4 20l5-1L20 8a3 3 0 0 0-4-4L5 15l-1 5Z"/>',
  review: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6M12 8v5l3 2"/>',
  test: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 9h6m-6 4h6m-6 4h3"/>',
  flag: '<path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  library: '<path d="M4 4v16h5V4Zm9-1 7 15-4 2L9 5Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.pencil}</svg>`;
const button = (label, action, className = 'path-text-button', id = '') => `<button type="button" class="${className}" data-action="${esc(action)}"${id ? ` data-id="${esc(id)}"` : ''}>${esc(label)}</button>`;
const taskIcon = task => task.kind === 'lesson' ? 'book' : /review|correction|retention/.test(task.kind || '') ? 'review' : /exam|test|diagnostic/.test(task.kind || '') ? 'test' : 'pencil';

function taskRow(task, index, preview = false) {
  const state = preview ? 'upcoming' : stateOf(task.state ?? task.status);
  const clickable = !preview && state !== 'blocked' && state !== 'upcoming' && task.id;
  const status = {done:'Complete',current:'Next',blocked:'Needs attention',upcoming:'Planned',available:''}[state];
  const content = `<span class="path-task-symbol" aria-hidden="true">${icon(state === 'done' ? 'check' : taskIcon(task))}</span><span class="path-task-copy"><span class="path-task-topline"><strong>${esc(task.title || 'Study task')}</strong>${status ? `<span class="path-task-status">${status}</span>` : ''}</span>${task.description ? `<span class="path-task-description">${esc(task.description)}</span>` : ''}${task.meta ? `<span class="path-task-meta">${esc(task.meta)}</span>` : ''}</span>${clickable ? `<span class="path-task-open" aria-hidden="true">${icon('chevron')}</span>` : ''}`;
  return `<li class="path-task path-task-${state}">${clickable ? `<button type="button" data-action="path-task" data-id="${esc(task.id)}"${state === 'current' ? ' aria-current="step"' : ''}>${content}</button>` : `<div class="path-task-static">${content}</div>`}</li>`;
}

function resumeMarkup(resume) {
  if (!resume) return '';
  return `<aside class="path-resume" aria-label="Unfinished study session"><div><strong>${esc(resume.title || 'Pick up where you left off')}</strong>${resume.description || resume.meta ? `<p>${esc(resume.description || resume.meta)}</p>` : ''}</div>${button('Resume', 'path-resume', 'path-text-button', resume.id)}</aside>`;
}

function libraryMarkup(library, compact = false) {
  if (!library || !['empty', 'depleted', 'blocked'].includes(library.state)) return '';
  const empty = library.state === 'empty';
  return `<aside class="path-library${compact ? ' path-library-compact' : ''}"><span class="path-library-symbol">${icon('library')}</span><div><strong>${esc(empty ? 'Add questions to start practicing' : 'You need more fresh questions')}</strong><p>${esc(library.message || (empty ? 'Lessons are ready. Add your question library for official practice.' : 'You’ve used the available questions. Add more for fresh practice, or revisit earlier questions in Review.'))}</p>${button(empty ? 'Add question library' : 'Add more questions', 'library-open')}</div></aside>`;
}

function previewDay(day) {
  const state = stateOf(day.state ?? day.status);
  return `<li class="path-preview-day${state === 'done' ? ' path-preview-done' : ''}"><span class="path-preview-date">${esc(day.dateLabel || '')}</span><div><strong>${esc(day.title || 'Practice and review')}</strong>${day.description ? `<p>${esc(day.description)}</p>` : ''}${list(day.tasks).length ? `<ul class="path-preview-tasks">${day.tasks.map(task => `<li>${esc(task.title || 'Study task')}${task.meta ? `<span>${esc(task.meta)}</span>` : ''}</li>`).join('')}</ul>` : ''}</div>${state === 'done' ? `<span class="path-preview-check" aria-label="Complete">${icon('check')}</span>` : ''}</li>`;
}

function weekMarkup(week, index) {
  const days = list(week.days);
  if (!days.length) return '';
  return `<li class="path-week-stop"><span class="path-line-node" aria-hidden="true"></span><details class="path-week"${week.open === true ? ' open' : ''}><summary><span><strong>${esc(week.label || (index ? 'Later on your path' : 'Coming up'))}</strong>${week.dateLabel ? `<span class="path-week-dates">${esc(week.dateLabel)}</span>` : ''}</span><span class="path-week-expander">Preview ${icon('chevron')}</span></summary><ol class="path-preview-days">${days.map(previewDay).join('')}</ol><p class="path-preview-note">Your next steps can change as you practice.</p></details></li>`;
}

/**
 * {goalLabel,testDateLabel,setupNeeded,today:{dateLabel,title,description,tasks},
 *  weeks:[{label,dateLabel,days:[{dateLabel,title,description,tasks,state}]}],
 *  resume?,library?:{state,message},continueLabel?,continueDisabled?,continueNote?}
 * Task: {id,kind,title,description,meta,state:available|current|done|upcoming|blocked}.
 * Future days are previews only. No dates are inferred by this renderer.
 */
export function homePathMarkup(model = {}) {
  const today = model.today || {};
  const tasks = list(today.tasks);
  const dated = Boolean(model.testDateLabel) && !model.setupNeeded;
  const canContinue = model.continueDisabled !== true && tasks.some(task => ['available', 'current'].includes(stateOf(task.state ?? task.status)));
  const note = model.continueNote || (tasks.length && tasks.every(task => stateOf(task.state ?? task.status) === 'done') ? 'Today’s steps are complete. Come back for your next study day.' : '');
  return `<div class="path-home"><header class="path-page-heading"><div><h1>${dated ? 'Your path to test day' : 'Your study path'}</h1>${model.sectionLabel ? `<p>${esc(model.sectionLabel)}</p>` : ''}</div>${model.goalLabel || model.testDateLabel ? `<div class="path-goal">${model.goalLabel ? `<span>${esc(model.goalLabel)}</span>` : ''}${model.testDateLabel ? `<span>SAT ${esc(model.testDateLabel)}</span>` : ''}${button('Edit', 'path-setup')}</div>` : ''}</header>
    ${resumeMarkup(model.resume)}
    <div class="path-workspace"><div class="path-current"><ol class="study-path path-current-day" aria-label="Today’s study path"><li class="path-today-stop"><span class="path-line-node path-line-node-today" aria-hidden="true"></span><section class="path-today" aria-labelledby="path-today-title"><header class="path-today-header"><div class="path-today-date"><span>Today</span>${today.dateLabel ? `<span>${esc(today.dateLabel)}</span>` : ''}</div><h2 id="path-today-title">${esc(today.title || 'A little progress, one step at a time')}</h2>${today.description ? `<p>${esc(today.description)}</p>` : ''}</header>
    ${tasks.length ? `<ol class="path-task-list" aria-label="Today’s recommendations">${tasks.slice(0,3).map((task,index) => taskRow(task,index)).join('')}</ol>` : `<p class="path-empty">${esc(today.emptyMessage || 'Choose a lesson in Practice, or set your routine to get a daily recommendation.')}</p>`}
    <footer class="path-today-footer">${note ? `<p>${esc(note)}</p>` : '<span></span>'}${canContinue ? button(model.continueLabel || 'Continue', 'path-continue', 'primary path-continue') : ''}</footer></section></li>
    </ol>${tasks.some(task => task.kind === 'bank-setup') ? '' : libraryMarkup(model.library, true)}</div>
    <aside class="path-upcoming" aria-label="Upcoming study"><h2>${dated ? 'Your roadmap' : 'Your routine'}</h2>${dated ? `<p class="path-upcoming-intro">A look at what’s ahead. Your path adapts as you practice.</p><ol class="study-path" aria-label="Upcoming study path">${list(model.weeks).map(weekMarkup).join('')}` : ''}
    ${dated ? `<li class="path-finish"><span class="path-line-node path-line-node-finish" aria-hidden="true">${icon('flag')}</span><div><strong>Your SAT</strong><span>${esc(model.testDateLabel)}</span></div></li>` : ''}${dated ? '</ol>' : ''}
    ${!dated ? `<aside class="path-setup"><div><strong>Set up your routine</strong><p>Add your test date and study days to see the path ahead.</p></div>${button('Set up routine', 'path-setup', 'secondary')}</aside>` : ''}
    </aside></div>
  </div>`;
}

function practiceRow(item) {
  const state = stateOf(item.state ?? item.status);
  return `<li class="practice-entry"><button type="button" data-action="practice-open" data-id="${esc(item.id)}"${state === 'blocked' ? ' disabled' : ''}><span class="practice-entry-icon">${icon(item.icon || ({skills:'pencil',review:'review',tests:'test'})[item.id] || 'book')}</span><span><strong>${esc(item.title)}</strong>${item.description ? `<span class="practice-entry-description">${esc(item.description)}</span>` : ''}${item.meta ? `<span class="practice-entry-meta">${esc(item.meta)}</span>` : ''}</span><span class="practice-entry-arrow">${icon('chevron')}</span></button></li>`;
}

/** {sectionLabel,resume?,library?,items:[{id,title,description,meta,state}],tools:[{id,title,description}]} */
export function practiceHubMarkup(model = {}) {
  const items = Array.isArray(model.items) ? model.items : [
    {id:'skills',title:'Practice a skill',description:'Choose what you want to work on.'},
    {id:'review',title:'Review your mistakes',description:'Return to earlier questions and check what stuck.'},
    {id:'tests',title:'Take a practice test',description:'Try a diagnostic or a timed assessment.'}
  ];
  const tools = Array.isArray(model.tools) ? model.tools : [
    {id:'lessons',title:'Lessons',description:'Work through a method and an example.'},
    {id:'desmos',title:'Desmos guides',description:'Learn when the calculator can help.'},
    {id:'vocabulary',title:'Vocabulary',description:'Practice words and roots.'}
  ];
  return `<div class="practice-hub"><header class="path-page-heading"><div><h1>Practice</h1><p>${esc(model.sectionLabel || 'Choose what to work on today.')}</p></div></header>${resumeMarkup(model.resume)}${libraryMarkup(model.library)}<ul class="practice-entry-list">${items.map(practiceRow).join('')}</ul>${tools.length ? `<details class="practice-study-tools"><summary><span>Lessons and study tools</span>${icon('chevron')}</summary><ul>${tools.map(practiceRow).join('')}</ul></details>` : ''}<p class="practice-home-note">For a recommended next step, return to <a href="#home">Home</a>.</p></div>`;
}
