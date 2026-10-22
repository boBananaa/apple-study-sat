import test from 'node:test';
import assert from 'node:assert/strict';
import {VIDEO,CHAPTERS,DESMOS_TIPS} from '../dist/desmos-content.js';
import {matchDesmosTips,searchDesmosTips,addDesmosAssistance,desmosAssistanceCount} from '../dist/desmos-matching.js';
import {isIndependent} from '../dist/studio-logic.js';
import {SKILLS} from '../dist/planner.js';
test('video coverage retains every instructional chapter with source times and guarded original methods',()=>{
 assert.equal(VIDEO.id,'jCT0jTVzKy0');assert.equal(VIDEO.durationSeconds,2017);assert.equal(CHAPTERS.length,10);assert.ok(DESMOS_TIPS.length>=28);
 assert.equal(new Set(DESMOS_TIPS.map(t=>t.id)).size,DESMOS_TIPS.length);
 for(const chapter of CHAPTERS)assert.ok(DESMOS_TIPS.some(t=>t.chapterId===chapter.id),chapter.title);
 for(const t of DESMOS_TIPS){assert.ok(CHAPTERS.some(c=>c.id===t.chapterId));assert.ok(t.seconds>=60&&t.seconds<2017);assert.ok(t.steps.length>=3&&t.caution&&t.recognition&&t.example.lines.length&&t.example.result);assert.ok(t.skills.every(s=>SKILLS.Math.includes(s)));assert.ok(t.docs.every(u=>/^https:\/\/(help\.desmos\.com|www\.desmos\.com|satsuite\.collegeboard\.org)\//.test(u)));for(const p of t.patterns)new RegExp(p,'i');}
});
test('new unseen Math questions receive matching methods without an ID list or a data rebuild',()=>{
 const question={id:'brand-new-imported-id',section:'Math',skill:'One-Variable Data',mathText:'What is the median of this list of data values?'};
 const result=matchDesmosTips(question);assert.ok(result.suggested.length);assert.ok(result.suggested.some(x=>x.tip.skills.includes('One-Variable Data')));assert.ok(result.hasText);
 const metadata=matchDesmosTips({id:'new-without-text',section:'Math',skill:'Circles'});assert.equal(metadata.hasText,false);assert.equal(metadata.suggested.length,0);assert.ok(metadata.related.length);
 const english=matchDesmosTips({...question,section:'Reading and Writing'});assert.equal(english.suggested.length+english.related.length,0);
});
test('import tags can assign or suppress methods, while unknown tags never invent a technique',()=>{
 const tip=DESMOS_TIPS[0],q={section:'Math',skill:'Unknown future skill',desmosTipIds:[tip.id]};
 assert.deepEqual(matchDesmosTips(q).suggested.map(x=>x.tip.id),[tip.id]);
 assert.equal(matchDesmosTips({...q,desmosTipIds:[]}).suggested.length,0);assert.equal(matchDesmosTips({...q,desmosTipIds:['nonexistent']}).suggested.length,0);
 assert.equal(matchDesmosTips({...q,desmosDisabled:true}).suggested.length,0);
});
test('search combines chapter, skill, and words without losing access to the full library',()=>{
 assert.equal(searchDesmosTips().length,DESMOS_TIPS.length);
 const chapter=CHAPTERS.find(c=>DESMOS_TIPS.some(t=>t.chapterId===c.id)),found=searchDesmosTips({chapter:chapter.id});assert.ok(found.length);assert.ok(found.every(t=>t.chapterId===chapter.id));
 assert.ok(searchDesmosTips({query:'median'}).length);assert.equal(searchDesmosTips({query:'definitely-not-a-math-word-abc'}).length,0);
 const skill='Systems of Linear Equations';assert.ok(searchDesmosTips({skill}).every(t=>t.skills.includes(skill)));
});
test('opening a method counts as help once and excludes the answer from independent mastery',()=>{
 const draft={hints:0},id=DESMOS_TIPS[0].id;assert.equal(desmosAssistanceCount(draft),0);assert.equal(addDesmosAssistance(draft,id),true);assert.equal(addDesmosAssistance(draft,id),false);assert.equal(addDesmosAssistance(draft,'invalid'),false);assert.equal(desmosAssistanceCount(draft),1);
 const record={correct:true,setupCorrect:true,revealed:false,hintsUsed:draft.hints+desmosAssistanceCount(draft)};assert.equal(isIndependent(record),false);assert.equal(isIndependent({...record,hintsUsed:0}),true);
 const restored=JSON.parse(JSON.stringify(draft));assert.equal(desmosAssistanceCount(restored),1);
});
