#!/usr/bin/env python3
"""Reject private runtime data and common secrets before publishing public source.

This is a release guard, not a guarantee that arbitrary text contains no personal data.
Review changes before pushing. Only tracked files are checked in a Git checkout.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def check():
    if (ROOT / '.git').exists():
        names = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).decode().split('\0')
        paths = [ROOT / name for name in names if name]
    else:
        paths = [p for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts]
    problems = []
    # Split source strings so the check does not match its own implementation.
    forbidden = [
        r'/Users' + r'/', r'/var/' + r'folders/', r'appg' + r'prj_',
        r'https://[^\s/"\']+\.' + r'chatgpt\.site',
        r'sk-' + r'(?:proj-)?[A-Za-z0-9_-]{20,}',
        r'gh[pousr]_' + r'[A-Za-z0-9]{20,}',
        r'github_' + r'pat_[A-Za-z0-9_]{20,}',
        r'-----BEGIN ' + r'(?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    ]
    for path in paths:
        rel = path.relative_to(ROOT)
        blocked = (
            rel.suffix.lower() in {'.pdf', '.zip', '.pyc', '.tar', '.gz'}
            or rel.name.startswith('.env')
            or '.openai' in rel.parts
            or str(rel).startswith(('dist/assets/questions/', 'dist/assets/keys/'))
            or rel.name in {'data.json', 'tutoring_state.json', 'sat_bank_index.json', 'profile.json'}
            or rel.name.endswith('.private.json')
        )
        if blocked:
            problems.append(f'{rel}: private/generated file')
            continue
        try:
            text = path.read_text()
        except UnicodeDecodeError:
            problems.append(f'{rel}: unexpected binary file; review before publishing')
            continue
        if any(re.search(pattern, text) for pattern in forbidden):
            problems.append(f'{rel}: possible local path, private hosting identifier, or credential')
    library = json.loads((ROOT / 'dist/data.example.json').read_text())
    for key in ('questions', 'history', 'diagnostics', 'foundationIds', 'readingFoundationIds'):
        if library.get(key) != []:
            problems.append(f'data.example.json: {key} must be empty')
    if library.get('questionCount') != 0 or any(v is not None for v in library.get('goal', {}).values()):
        problems.append('data.example.json: question count and profile must be empty')
    profile = json.loads((ROOT / 'profile.example.json').read_text())
    if any(v is not None for v in profile.get('goal', {}).values()):
        problems.append('profile.example.json: profile must be empty')
    config = json.loads((ROOT / 'dist/library-config.json').read_text())
    if config != {'data': 'data.example.json'}:
        problems.append('library-config.json: public app must load the empty example')
    if problems:
        raise SystemExit('\n'.join(problems))
    print(f'Public source check passed ({len(paths)} files; empty profiles and question bank).')


if __name__ == '__main__':
    check()
