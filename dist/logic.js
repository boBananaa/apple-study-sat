export function calculate(input,vars={}) {
  const source=String(input).replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/[$,\s]/g,'').toLowerCase();
  const tokens=source.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[()+\-*/^%]/g)||[];
  if(!source||tokens.join('')!==source) throw Error('Use numbers, variables, and arithmetic symbols.');
  let i=0;
  const peek=()=>tokens[i];
  function primary(){
    let token=tokens[i++],value;
    if(token==='('){value=expression();if(tokens[i++]!==')')throw Error('Check your parentheses.');}
    else if(/^(?:\d|\.)/.test(token||''))value=Number(token);
    else if(Object.hasOwn(vars,token))value=vars[token];
    else throw Error('Check your numbers and variables.');
    while(peek()==='%'){i++;value/=100;}
    return value;
  }
  function power(){let value=primary();if(peek()==='^'){i++;value=value**unary();}return value;}
  function unary(){if(peek()==='+'){i++;return unary();}if(peek()==='-'){i++;return -unary();}return power();}
  function term(){let value=unary();while(i<tokens.length){const t=peek();if(t==='*'||t==='/'){i++;const rhs=unary();value=t==='*'?value*rhs:value/rhs;}else if(t==='('||/^(?:\d|\.|[a-z])/.test(t)){value*=unary();}else break;}return value;}
  function expression(){let value=term();while(peek()==='+'||peek()==='-'){const op=tokens[i++],rhs=term();value=op==='+'?value+rhs:value-rhs;}return value;}
  const result=expression();if(i!==tokens.length||!Number.isFinite(result))throw Error('Check the expression.');return result;
}

export function gradeAnswer(question,input){
  const clean=String(input).trim().replace(/\$/g,'').toUpperCase();
  if(!clean)return false;
  for(const value of question.accepted||[question.answer]){
    if(clean===String(value).trim().toUpperCase())return true;
    try{if(Math.abs(calculate(clean)-calculate(value))<=1e-6)return true;}catch{}
  }
  return false;
}

function residual(equation,vars){const parts=equation.split('=');if(parts.length!==2)throw Error('Include an equals sign.');return calculate(parts[0],vars)-calculate(parts[1],vars);}
function equivalentEquation(candidate,model){
  const samples=[{x:0,t:0,y:0},{x:1,t:1,y:3},{x:2,t:4,y:7},{x:9,t:11,y:-2},{x:-3,t:-5,y:4},{x:7,t:5,y:19}];
  let ratio=null;
  for(const vars of samples){const a=residual(candidate,vars),b=residual(model,vars);if(Math.abs(b)>1e-8){if(ratio===null)ratio=a/b;if(Math.abs(a-ratio*b)>1e-6*Math.max(1,Math.abs(a)))return false;}else if(Math.abs(a)>1e-7)return false;}
  return ratio!==null&&Math.abs(ratio)>1e-8;
}
export function checkSetup(){return null;}
export function stableSession(session){return session.completed&&session.records.length>=5&&session.records.filter(r=>r.correct&&r.hintsUsed===0&&!r.revealed&&r.setupCorrect===true).length/session.records.length>=.8;}
export function usedIds(history,sessions){return new Set([...history.map(r=>r.questionId),...sessions.flatMap(s=>s.records.map(r=>r.questionId))]);}
export function advanceSession(session){
  if(session.completed||!session.records.some(r=>r.questionId===session.questionIds[session.index]))return false;
  if(session.index===session.questionIds.length-1){session.completed=true;session.completedAt=new Date().toISOString();}
  else session.index++;
  return true;
}
