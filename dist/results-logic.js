// Official score reports guide broad domains. They do not provide per-skill accuracy.
import {SECTIONS,SKILLS,validDate,localDate,addDays,rankSkills} from './planner.js?v=10';
export const PERFORMANCE_BANDS={
 Math:[[200,360],[370,410],[420,460],[470,540],[550,600],[610,670],[680,800]],
 'Reading and Writing':[[200,360],[370,410],[420,480],[490,540],[550,600],[610,670],[680,800]]
};
// Each section contains {name,weight,skills}; weight is the approximate test share.
export const OFFICIAL_DOMAINS={
 Math:[
  {name:'Algebra',weight:.35,skills:['Linear Equations in One Variable','Linear Equations in Two Variables','Linear Functions','Systems of Linear Equations','Linear Inequalities']},
  {name:'Advanced Math',weight:.35,skills:['Equivalent Expressions','Nonlinear Equations and Systems','Nonlinear Functions']},
  {name:'Problem-Solving and Data Analysis',weight:.15,skills:['Ratios, Rates, Proportions, and Units','Percentages','One-Variable Data','Two-Variable Data','Probability','Sample Statistics and Margin of Error','Evaluating Statistical Claims']},
  {name:'Geometry and Trigonometry',weight:.15,skills:['Area and Volume','Lines, Angles, and Triangles','Right Triangles and Trigonometry','Circles']}
 ],
 'Reading and Writing':[
  {name:'Information and Ideas',weight:.26,skills:['Central Ideas and Details','Inferences','Command of Evidence']},
  {name:'Craft and Structure',weight:.28,skills:['Words in Context','Text Structure and Purpose','Cross-Text Connections']},
  {name:'Expression of Ideas',weight:.20,skills:['Rhetorical Synthesis','Transitions']},
  {name:'Standard English Conventions',weight:.26,skills:['Boundaries','Form, Structure, and Sense']}
 ]
};
export const OFFICIAL_PRACTICE_URL='https://satsuite.collegeboard.org/practice/practice-tests/bluebook';
export const CHECKPOINT_POLICY={intervalDays:14,minGapDays:7,stopBeforeExamDays:3};
const SOURCES=['official-sat','official-bluebook'];
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v)&&[Object.prototype,null].includes(Object.getPrototypeOf(v));
const score=v=>Number.isInteger(v)&&v>=200&&v<=800&&v%10===0;
const copy=v=>JSON.parse(JSON.stringify(v));
export const bandLabel=band=>`${band.lower}–${band.upper}`;
function cleanBand(value,section){
 let lower,upper;
 if(typeof value==='string'){const match=value.trim().match(/^(\d{3})\s*[-–]\s*(\d{3})$/);if(match)[,lower,upper]=match.map(Number);}
 else if(plain(value)){lower=value.lower;upper=value.upper;}
 const index=PERFORMANCE_BANDS[section].findIndex(pair=>pair[0]===lower&&pair[1]===upper);
 if(index<0)throw Error('Choose the score band shown on your official report for every content domain.');
 return {lower,upper,band:index+1};
}
export function normalizeOfficialReport(input,{today=localDate()}={}){
 if(!plain(input)||!SOURCES.includes(input.source))throw Error('Choose an actual SAT score report or an official Bluebook SAT practice report.');
 if(!validDate(input.date)||input.date>today)throw Error('Enter the date you took this test, on or before today.');
 if(!score(Number(input.math))||!score(Number(input.readingWriting)))throw Error('Enter both section scores from the same test, in steps of 10 from 200 to 800.');
 if(input.total!=null&&Number(input.total)!==Number(input.math)+Number(input.readingWriting))throw Error('The total must equal the two section scores from this test.');
 if(input.superscore===true)throw Error('Use one test report, not a superscore.');
 const domains={};
 for(const section of SECTIONS){
  if(!plain(input.domains?.[section]))throw Error('Add all eight content-domain score bands from this test report.');
  domains[section]={};
  for(const domain of OFFICIAL_DOMAINS[section])domains[section][domain.name]=cleanBand(input.domains[section][domain.name],section);
 }
 const testName=String(input.testName||'').trim().slice(0,120);
 const id=String(input.id||`${input.source}-${input.date}-${testName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`).slice(0,200);
 if(!/^[\w-]{1,200}$/.test(id))throw Error('Invalid official report identifier.');
 return {id,source:input.source,date:input.date,testName,math:Number(input.math),readingWriting:Number(input.readingWriting),total:Number(input.math)+Number(input.readingWriting),domains,enteredAt:typeof input.enteredAt==='string'&&Number.isFinite(Date.parse(input.enteredAt))?input.enteredAt:today+'T12:00:00Z',reportedBy:'user'};
}
export function validateOfficialResults(value,{today=localDate()}={}){
 if(value==null)return {version:1,reports:[],happyWithPracticeScore:false};
 if(!plain(value)||value.version!==1||!Array.isArray(value.reports)||value.reports.length>200||value.happyWithPracticeScore!=null&&typeof value.happyWithPracticeScore!=='boolean')throw Error('Invalid official score reports in backup.');
 const reports=value.reports.map(report=>normalizeOfficialReport(report,{today}));
 if(new Set(reports.map(report=>report.id)).size!==reports.length)throw Error('Duplicate official score report in backup.');
 let checkpointPolicy;
 if(value.checkpointPolicy!=null){
  const p=value.checkpointPolicy;
  if(!plain(p)||!Number.isInteger(p.intervalDays)||p.intervalDays<7||p.intervalDays>60||!Number.isInteger(p.minGapDays)||p.minGapDays<7||p.minGapDays>p.intervalDays||!Number.isInteger(p.stopBeforeExamDays)||p.stopBeforeExamDays<1||p.stopBeforeExamDays>14)throw Error('Invalid official practice checkpoint policy.');
  checkpointPolicy={intervalDays:p.intervalDays,minGapDays:p.minGapDays,stopBeforeExamDays:p.stopBeforeExamDays};
 }
 return {version:1,reports,happyWithPracticeScore:!!value.happyWithPracticeScore,...(checkpointPolicy?{checkpointPolicy}:{})};
}
export function mergeOfficialResults(existing,incoming,options){
 const a=validateOfficialResults(existing,options);if(incoming==null)return a;
 const b=validateOfficialResults(incoming,options),reports=new Map(a.reports.map(r=>[r.id,r]));
 for(const r of b.reports){const previous=reports.get(r.id);if(!previous||Date.parse(r.enteredAt)>=Date.parse(previous.enteredAt))reports.set(r.id,r);}
 return {...a,...b,reports:[...reports.values()].sort((a,b)=>a.date.localeCompare(b.date)||Date.parse(a.enteredAt)-Date.parse(b.enteredAt))};
}
function validReports(state,today){
 return (state.studio?.officialResults?.reports||[]).flatMap(input=>{try{return [normalizeOfficialReport(input,{today})];}catch{return [];}}).sort((a,b)=>b.date.localeCompare(a.date)||Date.parse(b.enteredAt)-Date.parse(a.enteredAt));
}
export function resultsGate(state,{today=localDate()}={}){
 const report=validReports(state,today)[0]||null;
 return report?{ready:true,reason:null,report,nextAction:null}:{ready:false,reason:'official-results-required',report:null,nextAction:'official-baseline',message:'Take an official full-length SAT practice test in Bluebook, then enter its section scores and all eight domain bands. If you already have a recent actual SAT or Bluebook report, enter that report.'};
}
export function saveOfficialReport(state,input,{today=localDate()}={}){
 const report=normalizeOfficialReport(input,{today});
 state.studio??={};const saved=validateOfficialResults(state.studio.officialResults,{today});
 if(typeof input.enteredAt!=='string'||!Number.isFinite(Date.parse(input.enteredAt))){
  // Fast consecutive saves can share a clock millisecond. Preserve their entry order.
  const previousTime=Math.max(0,...saved.reports.map(item=>Date.parse(item.enteredAt)));
  report.enteredAt=new Date(Math.max(Date.now(),previousTime+1)).toISOString();
 }
 saved.reports=[...saved.reports.filter(r=>r.id!==report.id),report];
 // A new practice report resumes checkpoints unless the user marks this score satisfactory.
 if(report.source==='official-bluebook')saved.happyWithPracticeScore=false;
 state.studio.officialResults=saved;return copy(report);
}
export function setPracticeScoreSatisfied(state,happy,{today=localDate()}={}){
 if(typeof happy!=='boolean')throw Error('Choose whether you are happy with your practice score.');
 if(happy&&!validReports(state,today).some(r=>r.source==='official-bluebook'))throw Error('Add an official Bluebook SAT practice report before marking its score satisfactory.');
 state.studio??={};state.studio.officialResults??={version:1,reports:[]};state.studio.officialResults.happyWithPracticeScore=happy;return happy;
}
export function rankRoadmapSkills({state,section,questions=[],today=localDate()}){
 const report=resultsGate(state,{today}).report;
 if(!report)return [];
 const ranks=rankSkills({section,diagnostics:state.diagnostics||[],sessions:state.sessions||[],questions});
 return ranks.map(rank=>{
  const domain=OFFICIAL_DOMAINS[section].find(d=>d.skills.includes(rank.skill));
  if(!domain)return {...rank,domain:null,domainBand:null,uncertainty:'No official domain mapping; confirm with fresh practice.'};
  const band=report.domains[section][domain.name],domainNeed=(7-band.band)/6;
  const observed=rank.practiceCount>0||rank.diagnosticCount>0;
  return {...rank,domain:domain.name,domainBand:band,priority:observed?.7*domainNeed+.3*rank.priority:domainNeed,
   reason:`${domain.name}: ${bandLabel(band)} on your ${report.source==='official-sat'?'actual SAT':'official Bluebook practice'} report. This broad band does not identify which skill needs work.${observed?' '+rank.reason:' Use fresh practice to check this skill.'}`,
   uncertainty:'Domain evidence applies to several skills; no per-skill accuracy is inferred.'};
 }).sort((a,b)=>b.priority-a.priority||a.skill.localeCompare(b.skill));
}
export function buildResultsRoadmap({state,today=localDate(),testDate=state.profile?.testDate||state.routine?.testDate,scope=state.routine?.scope||state.studio?.preferences?.scope||state.section||'Math'}={}){
 const gate=resultsGate(state,{today}),report=gate.report,sections=scope==='Both'?SECTIONS:SECTIONS.includes(scope)?[scope]:['Math'];
 const calendarEnabled=validDate(testDate)&&testDate>today;
 if(!report)return {ready:false,sections:[],checkpoints:[],nextCheckpoint:null,checkpointDue:false,calendarEnabled:false,needsTestDate:!calendarEnabled};
 const targetTotal=Number(state.profile?.total),totalGap=Number.isInteger(targetTotal)&&targetTotal>=400&&targetTotal<=1600?Math.max(0,targetTotal-report.total):null;
 const room=1600-report.total;
 const priorities=sections.map(section=>{
  const current=section==='Math'?report.math:report.readingWriting;
  const explicitTarget=state.profile?.[section==='Math'?'targetMath':'targetReadingWriting'];
  const target=score(explicitTarget)?explicitTarget:totalGap==null?null:Math.round((current+(room?totalGap*(800-current)/room:0))/10)*10;
  const weakest=OFFICIAL_DOMAINS[section].map(d=>({...d,band:report.domains[section][d.name]})).sort((a,b)=>a.band.band-b.band.band||b.weight-a.weight||a.name.localeCompare(b.name));
  return {section,currentScore:current,targetScore:target,gap:target==null?null:Math.max(0,target-current),weakestDomains:weakest,priority:(target==null?(800-current):Math.max(0,target-current))+.01*(7-weakest[0].band.band)};
 }).sort((a,b)=>b.priority-a.priority||a.section.localeCompare(b.section));
 let policy={...CHECKPOINT_POLICY};
 try{policy={...policy,...validateOfficialResults(state.studio?.officialResults,{today}).checkpointPolicy};}catch{/* Imported invalid optional policy cannot create a repeating checkpoint loop. */}
 const happy=!!state.studio?.officialResults?.happyWithPracticeScore,checkpoints=[];
 const dueDate=addDays(report.date,policy.intervalDays),latestDate=calendarEnabled?addDays(testDate,-policy.stopBeforeExamDays):null;
 if(!happy&&calendarEnabled){
  const first=dueDate<today?today:dueDate;
  for(let date=first;date<=latestDate&&checkpoints.length<60;date=addDays(date,policy.intervalDays)){
   if(date<addDays(report.date,policy.minGapDays))continue;
   checkpoints.push({id:'official-checkpoint-'+date,date,source:'official-bluebook',official:true,title:'Take an official Bluebook SAT practice test',description:'Take a fresh full-length SAT test in Bluebook, then enter its report to update your roadmap.'});
  }
 }
 const nextCheckpoint=checkpoints[0]||null;
 return {ready:true,reportId:report.id,reportDate:report.date,sections:priorities,checkpoints,nextCheckpoint,checkpointDue:!!nextCheckpoint&&nextCheckpoint.date<=today,calendarEnabled,needsTestDate:!calendarEnabled,happyWithPracticeScore:happy,policy,policyNote:'A 14-day interval, at least 7 days between tests, and no full test in the last 3 days are adjustable app planning defaults, not a College Board prescription.',scoreNote:'Practice and actual scores can differ in either direction. These results are a checkpoint, not a score prediction.'};
}
