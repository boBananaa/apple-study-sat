import {DESMOS_TIPS} from './desmos-content.js?v=7';
const clean=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[‐‑–—]/g,'-');
const aliases={'one-variable data: distributions and measures of center and spread':'one-variable data','two-variable data: models and scatterplots':'two-variable data','linear equations in 1 variable':'linear equations in one variable','linear equations in 2 variables':'linear equations in two variables'};
export const normalizedSkill=value=>aliases[clean(value)]||clean(value);
export function questionMathText(q){return [q?.mathText,q?.questionText,q?.stem,q?.text].filter(x=>typeof x==='string').join(' ').slice(0,18000);}
export function matchDesmosTips(q){
 if(q?.section!=='Math')return {suggested:[],related:[],hasText:false,disabled:true};
 const text=questionMathText(q),skill=normalizedSkill(q.skill),knownSkill=DESMOS_TIPS.some(t=>t.skills.some(s=>normalizedSkill(s)===normalizedSkill(q.skill))),hasOverrides=Array.isArray(q.desmosTipIds),explicit=new Set(hasOverrides?q.desmosTipIds:[]);
 if(q.desmosDisabled===true||hasOverrides&&!explicit.size)return {suggested:[],related:[],hasText:!!text,disabled:true};
 const scored=DESMOS_TIPS.map(tip=>{
  const topic=tip.skills.some(s=>normalizedSkill(s)===skill);
  const signal=!!text&&tip.patterns.some(pattern=>{try{return new RegExp(pattern,'i').test(text);}catch{return false;}});
  const tagged=explicit.has(tip.id);
  return {tip,topic,signal,tagged,score:tagged?100:topic&&signal?60:signal&&!knownSkill?30:topic?10:0,reason:tagged?'Imported technique tag':topic&&signal?'Question wording + skill':signal?'Question wording':'Skill reference'};
 }).filter(item=>hasOverrides?item.tagged:item.score>0).sort((a,b)=>b.score-a.score||a.tip.seconds-b.tip.seconds);
 return {suggested:scored.filter(x=>x.tagged||x.signal).slice(0,5),related:scored.filter(x=>!x.tagged&&!x.signal&&x.topic).slice(0,8),hasText:!!text,disabled:false};
}
export function searchDesmosTips({query='',chapter='all',skill='all'}={}){
 const words=clean(query).split(/\s+/).filter(Boolean);
 return DESMOS_TIPS.filter(t=>(chapter==='all'||t.chapterId===chapter)&&(skill==='all'||t.skills.some(s=>normalizedSkill(s)===normalizedSkill(skill)))&&words.every(word=>clean([t.title,t.recognition,t.caution,...t.skills,...t.searchTerms,...t.steps,...t.example.lines].join(' ')).includes(word)));
}
export function addDesmosAssistance(draft,tipId){
 if(!draft||!DESMOS_TIPS.some(t=>t.id===tipId))return false;
 draft.desmosTipIds=Array.isArray(draft.desmosTipIds)?draft.desmosTipIds:[];
 if(draft.desmosTipIds.includes(tipId))return false;
 draft.desmosTipIds.push(tipId);return true;
}
export function desmosAssistanceCount(draft){return new Set((Array.isArray(draft?.desmosTipIds)?draft.desmosTipIds:[]).filter(id=>DESMOS_TIPS.some(t=>t.id===id))).size;}
