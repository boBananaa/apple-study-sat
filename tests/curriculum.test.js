import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS, CURRICULUM_REFERENCES} from '../dist/learning-content.js';
import {SKILLS} from '../dist/planner.js';

const byId = new Map(LESSONS.map(lesson => [lesson.id, lesson]));
const originalIds = ['area-volume','circles','equivalent-expressions','statistical-claims','one-variable-equations','two-variable-equations','linear-functions','linear-inequalities','angles-triangles','nonlinear-equations','nonlinear-functions','one-variable-data','percentages','probability','rates-units','right-triangles','sampling-margin','linear-systems','two-variable-data','boundaries','central-ideas','command-evidence','cross-text','form-structure-sense','inferences','rhetorical-synthesis','text-structure','transitions','words-context'];
const focusCoverage = {
  'Linear Equations in One Variable': ['equations-multi-step','equations-solution-count','equations-parameters'],
  'Linear Equations in Two Variables': ['lines-standard-form','lines-parallel-perpendicular'],
  'Linear Functions': ['functions-tables-notation'],
  'Systems of Linear Equations': ['systems-elimination','systems-solution-count','systems-parameters'],
  'Linear Inequalities': ['inequalities-negative','inequalities-plane'],
  'Equivalent Expressions': ['expressions-exponents','expressions-radicals','expressions-polynomials','expressions-factoring','expressions-rational'],
  'Nonlinear Equations and Systems': ['quadratic-formula','quadratic-discriminant','radical-equations','rational-equations','nonlinear-intersections','exponential-equations','polynomial-roots','formulas-rearrangement'],
  'Nonlinear Functions': ['quadratic-features','function-transformations','exponential-intervals','nonlinear-domains'],
  'Ratios, Rates, Proportions, and Units': ['ratios-part-whole','unit-conversions','density-rates'],
  'Percentages': ['reverse-percent','percent-comparison'],
  'One-Variable Data': ['weighted-mean','data-spread-transformations','data-distributions'],
  'Two-Variable Data': ['scatterplot-models'],
  'Probability': ['probability-two-way-tables'],
  'Sample Statistics and Margin of Error': ['sample-population-estimates'],
  'Evaluating Statistical Claims': ['sampling-bias','experiment-inference'],
  'Area and Volume': ['composite-area','solid-volume','geometry-scale-factors','perimeter-surface-area'],
  'Lines, Angles, and Triangles': ['parallel-line-angles','similar-triangles','triangle-congruence'],
  'Right Triangles and Trigonometry': ['special-right-triangles','trigonometric-ratios'],
  'Circles': ['circle-arcs-sectors','circle-radians','circle-completing-square','circle-angles-tangents'],
  'Central Ideas and Details': ['central-ideas-scope','literary-details'],
  'Command of Evidence': ['evidence-textual','evidence-strengthen-weaken','evidence-quantitative','evidence-graphic-limits'],
  'Inferences': ['inferences-scientific','inferences-literary'],
  'Words in Context': ['words-multiple-meanings','words-precision'],
  'Text Structure and Purpose': ['text-purpose','text-structure-shifts'],
  'Cross-Text Connections': ['cross-text-response','cross-text-agreement'],
  'Rhetorical Synthesis': ['synthesis-audience-goal','synthesis-comparisons'],
  'Transitions': ['transitions-concession-result','transitions-addition-clarification'],
  'Boundaries': ['boundaries-dependent-clauses','boundaries-nonessential','boundaries-colons-dashes','boundaries-coordination','boundaries-conjunctive-adverbs'],
  'Form, Structure, and Sense': ['grammar-verb-forms','grammar-tense-aspect','grammar-modifiers','grammar-pronouns','grammar-possessives'],
};

test('stable original lesson IDs remain in order and every exact bank skill gains focused follow-ups', () => {
  assert.deepEqual(LESSONS.slice(0, originalIds.length).map(lesson => lesson.id), originalIds);
  assert.equal(byId.size, LESSONS.length);
  assert.deepEqual(Object.keys(focusCoverage).sort(), Object.values(SKILLS).flat().sort());
  for (const [section, skills] of Object.entries(SKILLS)) {
    assert.deepEqual([...new Set(LESSONS.filter(lesson => lesson.section === section).map(lesson => lesson.skill))].sort(), [...skills].sort());
    for (const skill of skills) {
      for (const id of focusCoverage[skill]) {
        assert.equal(byId.get(id)?.skill, skill, id);
        assert.equal(byId.get(id)?.section, section, id);
      }
    }
  }
});

test('every lesson has teachable content, an answerable check, and an acyclic prerequisite graph', () => {
  const complete = new Set();
  function visit(id, path = new Set()) {
    assert.ok(!path.has(id), `prerequisite cycle at ${id}`);
    if (complete.has(id)) return;
    const lesson = byId.get(id);
    assert.ok(lesson, `missing prerequisite ${id}`);
    const next = new Set([...path, id]);
    for (const prerequisite of lesson.prerequisites) {
      assert.equal(byId.get(prerequisite)?.section, lesson.section, `${id} prerequisite section`);
      visit(prerequisite, next);
    }
    complete.add(id);
  }
  for (const lesson of LESSONS) {
    assert.ok(SKILLS[lesson.section]?.includes(lesson.skill), lesson.id);
    for (const field of ['title','intro','rule']) assert.ok(typeof lesson[field] === 'string' && lesson[field].trim(), `${lesson.id}: ${field}`);
    assert.ok(Number.isFinite(lesson.minutes) && lesson.minutes >= 3 && lesson.minutes <= 15, lesson.id);
    assert.ok(Array.isArray(lesson.steps) && lesson.steps.length >= 3 && lesson.steps.every(step => typeof step === 'string' && step.trim()), lesson.id);
    for (const field of ['prompt','setup','solution','trap']) assert.ok(lesson.worked[field]?.trim(), `${lesson.id}: worked.${field}`);
    for (const field of ['prompt','answer','explanation']) assert.ok(typeof lesson.check[field] === 'string' && lesson.check[field].trim(), `${lesson.id}: check.${field}`);
    visit(lesson.id);
  }
  assert.equal(complete.size, LESSONS.length);
});

// Recompute the numerical answers from the examples' quantities. These fixtures
// validate instructional content, rather than simply restating the stored key.
const numericalChecks = {
  'area-volume': () => 72/(6*4),
  circles: () => Math.sqrt(36),
  'equivalent-expressions': () => 4*3-5,
  'statistical-claims': () => 0,
  'one-variable-equations': () => (66-24)/6,
  'two-variable-equations': () => (49-8*3)/5,
  'linear-functions': () => 45+12*0,
  'linear-inequalities': () => Math.floor((35-5)/6),
  'angles-triangles': () => 180-35-85,
  'nonlinear-equations': () => 2+3,
  'nonlinear-functions': () => -2*(3-3)**2+20,
  'one-variable-data': () => (6+8+10+12)/4,
  percentages: () => 500*.9*.8,
  probability: () => 5/(3+5+2),
  'rates-units': () => 150/3*2,
  'right-triangles': () => Math.sqrt(13**2-5**2),
  'sampling-margin': () => 62+3,
  'linear-systems': () => (10*.38-10*.2)/(.5-.2),
  'two-variable-data': () => 14-(3*5+2),
  'equations-multi-step': () => (3*2+2*4)/(3-2),
  'equations-parameters': () => 29-4*3,
  'lines-standard-form': () => 20/4,
  'lines-parallel-perpendicular': () => 11-3*2,
  'functions-tables-notation': () => 5+(17-5)/(4-1)*(6-1),
  'inequalities-negative': () => Math.floor((7-1)/3)+1,
  'inequalities-plane': () => 2*1+1,
  'systems-elimination': () => (22+8)/(3+3),
  'systems-parameters': () => 6/2,
  'expressions-exponents': () => 8-5,
  'expressions-radicals': () => 16**(3/4),
  'expressions-polynomials': () => -5+2,
  'expressions-factoring': () => Math.sqrt(16),
  'expressions-rational': () => 2+3,
  'quadratic-formula': () => 3/2,
  'quadratic-discriminant': () => 8**2/4,
  'radical-equations': () => (1+Math.sqrt(1+4*2))/2,
  'rational-equations': () => 8/2-2,
  'nonlinear-intersections': () => [-Math.sqrt(4),Math.sqrt(4)].length,
  'quadratic-features': () => 29-(10/2)**2,
  'function-transformations': () => 2*9-3,
  'exponential-intervals': () => 640*(1/2)**(6/3),
  'exponential-equations': () => (Math.log(27)/Math.log(3)+1)/2,
  'ratios-part-whole': () => 45/(2+7)*2,
  'unit-conversions': () => 90*1000/3600,
  'density-rates': () => 1200/8,
  'reverse-percent': () => 150/1.25,
  'percent-comparison': () => (80-60)/80*100,
  'weighted-mean': () => (2*3+3*8)/(2+3),
  'data-spread-transformations': () => 4,
  'data-distributions': () => 3+7,
  'probability-two-way-tables': () => 1-.35,
  'sample-population-estimates': () => 18/50*2000,
  'composite-area': () => (5+9)/2*4,
  'solid-volume': () => 4/3*3**3,
  'geometry-scale-factors': () => 3**2,
  'parallel-line-angles': () => (65-5)/4,
  'similar-triangles': () => 4*2.5,
  'special-right-triangles': () => (Math.hypot(5,5)/5)**2,
  'trigonometric-ratios': () => 90-28,
  'circle-arcs-sectors': () => 90/360*4**2,
  'circle-radians': () => 150/180,
  'circle-completing-square': () => Math.sqrt(16+(-4/2)**2+(-8/2)**2),
  'circle-angles-tangents': () => 90,
  'polynomial-roots': () => 1-3+4,
  'nonlinear-domains': () => Math.abs(1-4)+2,
  'formulas-rearrangement': () => 45/(3**2),
  'perimeter-surface-area': () => 2*(7+3),
};
const conceptualMathChecks = {
  'equations-solution-count': 'infinitely many',
  'systems-solution-count': 'infinitely many',
  'scatterplot-models': 'linear',
  'sampling-bias': 'seniors',
  'experiment-inference': 'association',
  'triangle-congruence': 'SSS',
};
const asNumber = answer => {
  const parts = answer.split('/').map(Number);
  return parts.length === 2 ? parts[0]/parts[1] : parts[0];
};

test('all math lesson checks have independently verified numerical or conceptual keys', () => {
  const checked = new Set([...Object.keys(numericalChecks), ...Object.keys(conceptualMathChecks)]);
  assert.deepEqual([...checked].sort(), LESSONS.filter(lesson => lesson.section === 'Math').map(lesson => lesson.id).sort());
  for (const [id, calculate] of Object.entries(numericalChecks)) {
    assert.ok(Math.abs(asNumber(byId.get(id).check.answer)-calculate()) < 1e-9, id);
  }
  for (const [id, answer] of Object.entries(conceptualMathChecks)) assert.equal(byId.get(id).check.answer, answer, id);
});

test('worked examples preserve algebraic equivalence, domains, roots, geometry, and statistics', () => {
  // Independently verify the nontrivial calculations and domain exclusions in the worked lessons.
  for (const x of [-5,-1,0,2,8]) {
    assert.equal((x+4)*(x-3), x*x+x-12);
    assert.equal((x-4)*(x-5), x*x-9*x+20);
    assert.equal((x-4)**2+7, x*x-8*x+23);
    if (x !== 3) assert.equal((x*x-9)/(x-3),x+3);
  }
  for (const root of [2-Math.sqrt(5),2+Math.sqrt(5)]) assert.ok(Math.abs(root*root-4*root-1)<1e-10);
  assert.equal(Math.sqrt(3+6),3);
  assert.notEqual(Math.sqrt(-2+6),-2); // extraneous root after squaring
  for (const x of [3,-2]) assert.equal(x*x,x+6);
  assert.equal(400*1.25**(4/2),625);
  assert.equal(640*.5**(6/3),160);
  assert.equal((4*6+6*11)/(4+6),9);
  assert.equal((120/360)*(2*6),4); // coefficient of pi in arc length
  assert.equal((1/3)*3**2*8,24); // coefficient of pi in cone volume
  assert.equal(2*(5*4+5*3+4*3),94);
  assert.equal(Math.sqrt(12+9+4),5); // completed-square circle radius
  const standardDeviation = values => {
    const mean = values.reduce((a,b)=>a+b)/values.length;
    return Math.sqrt(values.reduce((sum,value)=>sum+(value-mean)**2,0)/values.length);
  };
  const values = [2,4,6,8];
  assert.equal(standardDeviation(values.map(x=>x+9)),standardDeviation(values));
  assert.equal(standardDeviation(values.map(x=>2*x+5)),2*standardDeviation(values));
});

test('Reading and Writing checks give a unique requested choice and retain separate textual and quantitative evidence', () => {
  for (const lesson of LESSONS.filter(lesson => lesson.section === 'Reading and Writing')) {
    assert.ok(lesson.check.prompt.toLowerCase().includes(lesson.check.answer.toLowerCase()), `${lesson.id}: key must be one of the named choices`);
  }
  assert.equal(byId.get('evidence-textual').skill,'Command of Evidence');
  assert.equal(byId.get('evidence-quantitative').skill,'Command of Evidence');
  assert.match(byId.get('grammar-possessives').intro,/possessive/);
  assert.match(byId.get('grammar-verb-forms').intro,/finite/);
  assert.match(byId.get('grammar-modifiers').intro,/subject/);
});

test('reference metadata links official courses and accurately attributes the partnership', () => {
  assert.equal(new URL(CURRICULUM_REFERENCES.partnership).hostname,'satsuite.collegeboard.org');
  assert.equal(new URL(CURRICULUM_REFERENCES.khanMath).hostname,'www.khanacademy.org');
  assert.equal(new URL(CURRICULUM_REFERENCES.khanReadingWriting).hostname,'www.khanacademy.org');
  assert.match(CURRICULUM_REFERENCES.description,/Khan Academy provides Official SAT Prep developed in partnership with College Board/);
  assert.match(CURRICULUM_REFERENCES.description,/independent app is not affiliated with or endorsed/);
});
