// Browser-local, deterministic planning. No score prediction or AI service.
export const SECTIONS=['Math','Reading and Writing'];
export const SKILLS={
 Math:['Area and Volume','Circles','Equivalent Expressions','Evaluating Statistical Claims','Linear Equations in One Variable','Linear Equations in Two Variables','Linear Functions','Linear Inequalities','Lines, Angles, and Triangles','Nonlinear Equations and Systems','Nonlinear Functions','One-Variable Data','Percentages','Probability','Ratios, Rates, Proportions, and Units','Right Triangles and Trigonometry','Sample Statistics and Margin of Error','Systems of Linear Equations','Two-Variable Data'],
 'Reading and Writing':['Boundaries','Central Ideas and Details','Command of Evidence','Cross-Text Connections','Form, Structure, and Sense','Inferences','Rhetorical Synthesis','Text Structure and Purpose','Transitions','Words in Context']
};
const ALIASES={'Area & Volume':'Area and Volume','Rates':'Ratios, Rates, Proportions, and Units','Ratios & Proportions':'Ratios, Rates, Proportions, and Units','Radicals & Absolute Values':'Nonlinear Equations and Systems','Systems of Equations':'Systems of Linear Equations','Equations With Two Variables':'Linear Equations in Two Variables','Equations With One Variable':'Linear Equations in One Variable','Lines, Angles, & Triangles':'Lines, Angles, and Triangles','Graphing Functions':'Nonlinear Functions','Polynomial Equations':'Nonlinear Equations and Systems','Quadratic Equations':'Nonlinear Equations and Systems','Center, Shape, & Spread of Data':'One-Variable Data'};
export function localDate(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function validDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
export function addDays(value,n){const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function normalizeDiagnostic(input){
 if(!input||!SECTIONS.includes(input.section))throw Error('Choose Math or Reading and Writing for the diagnostic.');
 if(!validDate(input.date))throw Error('Enter a valid diagnostic date.');
 if(!Array.isArray(input.rows)||!input.rows.length||input.rows.length>100)throw Error('Add at least one skill result (up to 100 rows).');
 const rows=input.rows.map(row=>{
  const reported=String(row.reportedSkill||row.skill||'').trim(),skill=ALIASES[row.skill]||row.skill;
  if(!SKILLS[input.section].includes(skill))throw Error('Unrecognized skill: '+String(row.skill)+'. Use a skill listed for this section.');
  const correct=Number(row.correct),total=Number(row.total);
  if(row.correct===''||row.total===''||row.correct==null||row.total==null||!Number.isInteger(correct)||!Number.isInteger(total)||total<1||total>1000||correct<0||correct>total)throw Error('Each result needs whole numbers with 0 ≤ correct ≤ total and total at least 1.');
  return {skill,reportedSkill:reported.slice(0,120),correct,total};
 });
 return {id:String(input.id||'').slice(0,120),section:input.section,date:input.date,label:String(input.label||'Diagnostic').slice(0,120),rows};
}
export function seedDiagnostics(items=[]){
 return items.flatMap((d,i)=>{
  const rows=(d.skill_results||[]).map(r=>({skill:ALIASES[r.reported_skill]||r.reported_skill,reportedSkill:r.reported_skill,correct:r.correct,total:r.total})).filter(r=>SKILLS.Math.includes(r.skill));
  return rows.length?[normalizeDiagnostic({id:d.record_id||'imported-'+i,section:'Math',date:d.test_date||d.received_on,label:'Saved diagnostic summary',rows})]:[];
 });
}
export function normalizeRoutine(input){
 if(!input||!['Math','Reading and Writing','Both'].includes(input.scope))throw Error('Choose which SAT section to study.');
 const minutes=Number(input.minutes),days=[...new Set(input.days||[])].map(Number).sort();
 if(!Number.isInteger(minutes)||minutes<15||minutes>120)throw Error('Choose 15–120 minutes per study day.');
 if(!days.length||days.some(d=>!Number.isInteger(d)||d<0||d>6))throw Error('Choose at least one study day.');
 if(!validDate(input.startDate)||!validDate(input.testDate)||input.testDate<=input.startDate)throw Error('Your SAT date must be after the routine start date. Update the dates to build a calendar.');
 return {scope:input.scope,minutes,days,startDate:input.startDate,testDate:input.testDate};
}
const independent=r=>r.correct===true&&r.hintsUsed===0&&!r.revealed&&r.setupCorrect===true;
export function rankSkills({section,diagnostics=[],sessions=[],questions=[]}){
 const skills=[...new Set([...SKILLS[section],...questions.filter(q=>q.section===section).map(q=>q.skill)])];
 const all=sessions.filter(s=>s.section===section).flatMap(s=>s.records||[]).filter(r=>r.setupAssessment!=='exam_answer_only');
 return skills.map(skill=>{
  const diagnostic=diagnostics.filter(d=>d.section===section&&d.rows.some(r=>r.skill===skill)).reverse().sort((a,b)=>b.date.localeCompare(a.date)).at(0);
  const rows=diagnostic?.rows.filter(r=>r.skill===skill)||[],n=rows.reduce((a,r)=>a+r.total,0),correct=rows.reduce((a,r)=>a+r.correct,0);
  const recent=all.filter(r=>r.skill===skill&&(!diagnostic||String(r.submittedAt||'').slice(0,10)>=diagnostic.date)).sort((a,b)=>String(a.submittedAt||'').localeCompare(String(b.submittedAt||''))).slice(-10);
  const successes=recent.filter(independent).length,rate=recent.length?successes/recent.length:null;
  // Small samples are shrunk toward 50%; subskill misses remain visible.
  const diagnosticRate=(correct+2)/(n+4),weakest=rows.length?Math.min(...rows.map(r=>(r.correct+2)/(r.total+4))):.5;
  const diagnosticNeed=Math.max(.7*(1-diagnosticRate)+.3*(1-weakest),rows.some(r=>r.correct/r.total<.6)?.52:0),weight=Math.min(.85,recent.length/10);
  const need=(1-weight)*diagnosticNeed+weight*(recent.length?1-rate:.5);
  const stable=recent.length>=5&&rate>=.8;
  const weakRow=rows.find(r=>r.correct/r.total<.6&&r.reportedSkill!==skill);
  const reason=recent.length?`${successes}/${recent.length} recent answers independent with valid setup or reasoning${stable?'; ready to stretch':'; accuracy or approach needs practice'}.`:n?`${correct}/${n} correct on the diagnostic${n<5?'; small sample, confirm with practice':''}.${weakRow?' Includes '+weakRow.reportedSkill+' at '+weakRow.correct+'/'+weakRow.total+'; follow up on that gap.':''}`:'No skill evidence yet; start with a short check.';
  return {section,skill,priority:need,diagnosticCount:n,diagnosticCorrect:correct,diagnosticDate:diagnostic?.date||null,reportedSkills:rows.map(r=>r.reportedSkill),practiceCount:recent.length,independent:successes,stable,reason};
 }).sort((a,b)=>b.priority-a.priority||a.skill.localeCompare(b.skill));
}
export function buildPlan({routine,diagnostics=[],sessions=[],questions=[],history=[],today=localDate()}){
 const settings=normalizeRoutine(routine),start=settings.startDate>today?settings.startDate:today;
 const sections=settings.scope==='Both'?SECTIONS:[settings.scope],ranks=sections.flatMap(section=>rankSkills({section,diagnostics,sessions,questions}));
 const taken=new Set([...history.map(r=>r.questionId),...sessions.flatMap(s=>(s.records||[]).map(r=>r.questionId)),...sessions.filter(s=>!s.completed).flatMap(s=>s.questionIds||[])]);
 const planned=new Set(),allocation=new Map(),sectionAllocation=new Map(),days=[];
 const end=[addDays(start,83),addDays(settings.testDate,-1)].sort()[0];
 const completed=sessions.filter(s=>s.type==='routine'&&s.completed&&sections.includes(s.section));
 for(let date=start;date<=end&&days.length<28;date=addDays(date,1)){
  if(!settings.days.includes(new Date(date+'T12:00:00Z').getUTCDay()))continue;
  const existing=sessions.find(s=>s.type==='routine'&&s.planDate===date&&sections.includes(s.section));
  if(existing){days.push({date,existingId:existing.id,completed:existing.completed,section:existing.section,count:existing.questionIds.length});continue;}
  const candidates=ranks.map(r=>({...r,adjusted:r.priority-(allocation.get(r.section+'|'+r.skill)||0)*.1})).sort((a,b)=>b.adjusted-a.adjusted||a.skill.localeCompare(b.skill));
  // In a combined routine, alternate sections so neither disappears.
  const eligibleSections=sections.length===2&&days.filter(d=>d.skills).length%2===1?[...sections].sort((a,b)=>(sectionAllocation.get(a)||0)-(sectionAllocation.get(b)||0)).slice(0,1):sections;
  let chosen=null;
  for(const candidate of candidates){
   if(!eligibleSections.includes(candidate.section))continue;
   const stableSets=sessions.filter(s=>s.section===candidate.section&&s.completed&&(s.records||[]).length>=5&&s.records.filter(independent).length/s.records.length>=.8).length;
   const timed=candidate.stable&&stableSets>=2;
   const preferred=candidate.stable&&stableSets>=1?'Hard':'Medium';
   const reviewMinutes=Math.max(5,Math.round(settings.minutes*.3)),breakMinutes=settings.minutes>=50?5:0;
   const count=Math.max(3,Math.min(12,Math.floor((settings.minutes-reviewMinutes-breakMinutes)/3)));
   const pool=questions.filter(q=>q.section===candidate.section&&q.skill===candidate.skill&&!taken.has(q.id)&&!planned.has(q.id));
   const ids=pool.filter(q=>q.difficulty===preferred).concat(pool.filter(q=>q.difficulty!==preferred&&(preferred==='Hard'||q.difficulty!=='Hard'))).slice(0,count).map(q=>q.id);
   if(ids.length<3)continue;
   const actualDifficulties=[...new Set(ids.map(id=>pool.find(q=>q.id===id).difficulty))];
   chosen={date,section:candidate.section,skills:[candidate.skill],questionIds:ids,count:ids.length,difficulty:actualDifficulties.length===1?actualDifficulties[0]:'Mixed '+actualDifficulties.join(' / ').toLowerCase(),timed,minutes:settings.minutes,reviewMinutes,breakMinutes,practiceMinutes:settings.minutes-reviewMinutes-breakMinutes,target:'80% independent with a valid setup or reasoning',reason:candidate.reason};break;
  }
  if(!chosen)break;
  chosen.questionIds.forEach(id=>planned.add(id));
  for(const skill of chosen.skills)allocation.set(chosen.section+'|'+skill,(allocation.get(chosen.section+'|'+skill)||0)+1);
  sectionAllocation.set(chosen.section,(sectionAllocation.get(chosen.section)||0)+1);days.push(chosen);
 }
 return {days,ranks,completedCount:completed.length,hasMore:end<addDays(settings.testDate,-1),endDate:end};
}
