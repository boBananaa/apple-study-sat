#!/usr/bin/env python3
"""Build a local Apple Study: SAT library from the user's own question-bank PDFs."""
import argparse
import collections
import hashlib
import json
import re
import shutil
from pathlib import Path
from pypdf import PdfReader

ROW = re.compile(r'(\d+\.\d+?)\s*([0-9a-f]{8})(?=\s|$)')
ANSWER_ROW = re.compile(r'^\s*(\d+\.\d+?)\s*([0-9a-f]{8})\s+(.+?)\s*$', re.MULTILINE)

def math_question_text(text, ident):
    """Extract only the stem/choices before the answer section; never expose a rationale."""
    head=re.split(r'ID:\s*'+re.escape(ident)+r'\s+Answer\b|Correct Answer:|\bRationale\b',text,maxsplit=1)[0]
    head=re.sub(r'Question ID\s+[0-9a-f]{8}|ID:\s*[0-9a-f]{8}','',head)
    return ' '.join(head.split())[:12000]

def enrich_math_text(pdf_root, library_path):
    """Add source-only Math matching text to an existing library without rebuilding personal data/assets."""
    library=json.loads(library_path.read_text());by_id={q['id']:q for q in library['questions'] if q['section']=='Math'}
    count=0
    for path in sorted((pdf_root/'Question Bank (Unformatted)'/'Answer Keys').rglob('*.pdf')):
        if 'Reading and Writing' in path.parts:continue
        for page_number,page in enumerate(PdfReader(path).pages,1):
            text=page.extract_text();match=re.search(r'Question ID\s+([0-9a-f]{8})',text)
            if not match or match[1] not in by_id:continue
            q=by_id[match[1]];stem=math_question_text(text,q['id'])
            if stem:
                q['mathText']=stem;q['mathTextSource']={'file':path.name,'page':page_number};count+=1
    library_path.write_text(json.dumps(library,ensure_ascii=False,separators=(',',':')))
    print(json.dumps({'math_questions_with_source_text':count,'math_questions':len(by_id)}))
    return library

def build(pdf_root, out, check=False):
    formatted = pdf_root / 'Question Bank (Formatted)'
    if not formatted.is_dir():
        raise ValueError('Expected a Question Bank (Formatted) folder inside --pdf-root.')
    answers = {}
    for path in sorted((formatted / 'Answers').rglob('*.pdf')):
        for page in PdfReader(path).pages:
            for number, ident, answer in ANSWER_ROW.findall(page.extract_text()):
                answers[ident] = answer.strip()
    if not answers:
        raise ValueError('No answers were found in the formatted Answers folder.')

    questions = []
    seen = set()
    for section in ['Math', 'Reading and Writing']:
        for path in sorted((formatted / section).rglob('*.pdf')):
            parts = path.relative_to(formatted / section).parts
            if len(parts) < 3:
                continue
            domain, skill = parts[0], parts[-2]
            for page_number, page in enumerate(PdfReader(path).pages, 1):
                drawn = []
                def visit(op, args, cm, tm):
                    if op == b'Do':
                        drawn.append((str(args[0]).lstrip('/'), cm[5] + cm[3]))
                text = page.extract_text(visitor_operand_before=visit)
                rows = ROW.findall(text)
                if not rows:
                    continue
                images = {im.name.rsplit('.', 1)[0]: im for im in page.images}
                drawn.sort(key=lambda item: -item[1])
                rows.sort(key=lambda row: int(row[0].split('.')[1]))
                if len(rows) != len(drawn) or len(rows) != len(images):
                    raise ValueError(f'Image/question mismatch: {path.name}, page {page_number}')
                for (number, ident), (name, _) in zip(rows, drawn):
                    if ident in seen:
                        raise ValueError(f'Duplicate question ID: {ident}')
                    if ident not in answers:
                        raise ValueError(f'No answer key entry for {ident} in {path.name}')
                    seen.add(ident)
                    difficulty = {'1':'Easy','2':'Medium','3':'Hard'}.get(number.split('.')[0])
                    if not difficulty:
                        raise ValueError(f'Unrecognized difficulty group: {number}')
                    image_path = 'assets/questions/' + ident + '.webp'
                    if not check:
                        target = out / image_path
                        target.parent.mkdir(parents=True, exist_ok=True)
                        images[name].image.convert('RGB').save(target, quality=88, method=4)
                    questions.append(dict(id=ident,section=section,domain=domain,skill=skill,
                        difficulty=difficulty,file=path.name,page=page_number,number=number,
                        answer=answers[ident],accepted=[answers[ident]],image=image_path,key=None))

    by_id = {q['id']:q for q in questions}
    key_root = pdf_root / 'Question Bank (Unformatted)' / 'Answer Keys'
    for path in sorted(key_root.rglob('*.pdf')):
        asset = 'assets/keys/' + hashlib.sha256(str(path.relative_to(pdf_root)).encode()).hexdigest()[:12] + '.pdf'
        matched = False
        for page_number, page in enumerate(PdfReader(path).pages, 1):
            text = page.extract_text()
            match = re.search(r'Question ID\s+([0-9a-f]{8})', text)
            if not match or match[1] not in by_id:
                continue
            q = by_id[match[1]]
            key = dict(url=asset+'#page='+str(page_number),file=path.name,page=page_number)
            if q['section']=='Reading and Writing' and 'Rationale' in text:
                rationale = text.split('Rationale',1)[1]
                rationale = re.split(r'Question\s+Di[ﬃf]+culty:|Question Difficulty:|Assessment',rationale)[0]
                key['rationale'] = ' '.join(rationale.split())
            q['key'] = key
            if q['section']=='Math':
                stem=math_question_text(text,q['id'])
                if stem:q['mathText']=stem;q['mathTextSource']={'file':path.name,'page':page_number}
            matched = True
            answer_match = re.search(r'Correct Answer:\s*([^\n]+)', text)
            if answer_match:
                extra = [a.strip() for a in answer_match[1].split(',') if a.strip()]
                q['accepted'] = list(dict.fromkeys(q['accepted'] + extra))
        if matched and not check:
            (out/'assets/keys').mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path,out/asset)

    def foundation(section, skills):
        chosen=[]
        for skill in skills:
            match=next((q for q in questions if q['section']==section and q['skill']==skill and q['difficulty']=='Medium' and q['key']),None)
            if match:chosen.append(match['id'])
        for q in questions:
            if len(chosen)>=5:break
            if q['section']==section and q['difficulty']=='Medium' and q['id'] not in chosen:chosen.append(q['id'])
        return chosen[:5]

    library=dict(version=1,questionCount=len(questions),questions=questions,history=[],diagnostics=[],
        foundationIds=foundation('Math',['Linear Equations in One Variable','Linear Functions','Systems of Linear Equations','Percentages','Area and Volume']),
        readingFoundationIds=foundation('Reading and Writing',['Central Ideas and Details','Inferences','Command of Evidence','Transitions','Words in Context']),
        goal=dict(total=None,baseline=None,readingWriting=None,math=None,recentMath=None,testDate=None))
    if not check:
        out.mkdir(parents=True,exist_ok=True)
        (out/'data.json').write_text(json.dumps(library,ensure_ascii=False,separators=(',',':')))
        (out/'library-config.json').write_text(json.dumps({'data':'data.json'}))
    counts=collections.Counter(q['section'] for q in questions)
    print(json.dumps(dict(questions=len(questions),sections=dict(counts),verified_answer_keys=sum(bool(q['key']) for q in questions),check_only=check)))
    return library

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf-root',type=Path,required=True)
    parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[1]/'dist')
    parser.add_argument('--check',action='store_true',help='Validate question IDs, image mapping, and answers without writing assets.')
    parser.add_argument('--enrich-math-text',type=Path,help='Enrich an existing data.json with matching text; preserve its profile, history, and assets.')
    args=parser.parse_args()
    if args.enrich_math_text:
        enrich_math_text(args.pdf_root.expanduser().resolve(),args.enrich_math_text.expanduser().resolve())
    else:build(args.pdf_root.expanduser().resolve(),args.output.resolve(),args.check)
