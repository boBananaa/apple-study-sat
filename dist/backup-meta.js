import {validDate} from './planner.js?v=10';
const score=(v,min,max)=>{if(v==null||v==='')return null;if(!Number.isInteger(v)||v<min||v>max||v%10)throw Error('Invalid score in progress backup.');return v;};
export function normalizeBackupMetadata(backup){
 let profile=null;
 if(backup.goal!=null){const g=backup.goal;if(!g||typeof g!=='object'||Array.isArray(g))throw Error('Invalid profile in backup.');const math=score(g.math,200,800),readingWriting=score(g.readingWriting,200,800),total=score(g.total,400,1600),testDate=g.testDate||null;if(testDate&&!validDate(testDate))throw Error('Invalid SAT date in backup.');profile={math,readingWriting,total,testDate,baseline:math!=null&&readingWriting!=null?math+readingWriting:null};}
 const source=backup.history||backup.importedHistory||[];
 if(!Array.isArray(source)||source.length>50000)throw Error('Invalid earlier attempt history.');
 const history=source.map(r=>{if(!r||typeof r.questionId!=='string'||!/^[\w-]{1,100}$/.test(r.questionId)||!['Math','Reading and Writing'].includes(r.section))throw Error('Invalid earlier attempt in backup.');return {questionId:r.questionId,section:r.section,skill:typeof r.skill==='string'?r.skill.slice(0,200):'',correct:typeof r.correct==='boolean'?r.correct:null,assistance:['hinted','unassisted'].includes(r.assistance)?r.assistance:'unknown',answer:typeof r.answer==='string'?r.answer.slice(0,100):'',source:'Imported tutoring history'};});
 let stopwatch=null;
 if(backup.stopwatch!=null){const w=backup.stopwatch;if(!w||typeof w!=='object'||!Number.isFinite(w.elapsed)||w.elapsed<0||w.elapsed>31536000000||w.runningSince!=null&&(!Number.isFinite(w.runningSince)||w.runningSince<0))throw Error('Invalid stopwatch in backup.');const at=Date.parse(backup.exportedAt);stopwatch={elapsed:Math.min(31536000000,w.elapsed+(w.runningSince&&Number.isFinite(at)?Math.max(0,at-w.runningSince):0)),runningSince:null};}
 return {profile,history,stopwatch,section:['Math','Reading and Writing'].includes(backup.section)?backup.section:null};
}
export function mergeImportedHistory(existing=[],incoming=[]){return [...new Map([...incoming,...existing].map(r=>[r.questionId,r])).values()];}
