# Contributing to Apple SAT

[Project overview](README.md) · [Developer guide](docs/DEVELOPMENT.md) · [Open issues](https://github.com/boBananaa/apple-study-sat/issues)

Useful contributions include reproducible bug fixes, clearer original lessons, accessibility improvements, and checks of Mac or Windows behavior. For a large feature or a change to the study flow, open an issue to discuss the scope before building it. There is no promised review or response time.

## Local setup

Use Node.js 22+, Rust, and the [Tauri platform prerequisites](https://v2.tauri.app/start/prerequisites/). Run these from the repository root:

```sh
npm ci
npm test
npm run desktop:dev
```

The development window opens with an empty question library and included lessons. For a browser-only frontend preview, use `python -m http.server 8000 --directory dist`, then open `http://localhost:8000`. Native import and update commands require the desktop app. Python importer instructions are in the [developer guide](docs/DEVELOPMENT.md#load-your-own-pdf-question-bank).

## Find the right files

| Path | Purpose |
| --- | --- |
| `dist/` | Frontend and original learning content; these are source files despite the directory name. |
| `src-tauri/` | Native desktop shell, bounded local import, and signed updater. |
| `tests/` | JavaScript learning-state tests and Python importer tests using synthetic fixtures. |
| `scripts/` | PDF preparation, public-source checks, and release/page preparation. |
| `site/` | GitHub Pages download page, separate from the study app. |
| `docs/` | First-use, developer, release, and screenshot notes. |

## Before a pull request

- Explain the user problem, the change, and the checks you actually performed. For a bug fix, include reproduction steps and a regression test when useful.
- Keep first answers immutable, hinted work distinct, exact-skill records intact, and fresh questions free of repeats. Speed scores must not imply setup mastery or an SAT score.
- Write original tutorial material. An official-question label needs verified PDF provenance; do not commit licensed question files or another service's content.
- Use sample profiles in screenshots. Never commit personal scores, tutoring history, progress exports, imported libraries, local account paths, API keys, or signing keys.
- Check relevant UI changes at a narrow width and in light/dark app themes. State what was checked, not a general accessibility claim.

The checks used by CI include:

```sh
npm test
python -m pip install -r requirements.txt
python -m unittest discover -s tests -p 'test_*.py'
python scripts/check_public_source.py
cargo test --manifest-path src-tauri/Cargo.toml --lib
```

The privacy check examines tracked files in a checkout, so stage intended files and review the staged diff before running it. Passing that check does not replace reviewing the contents yourself. Packaging and signing are described in [release setup](docs/RELEASING.md); contributors do not need the maintainer's update key.

## Report bugs or suggest improvements

Use [GitHub Issues](https://github.com/boBananaa/apple-study-sat/issues/new/choose). Describe the operating system and app version, what you expected, what happened, and a minimal way to reproduce it. Screenshots should use sample data and omit question content. Do not attach raw progress backups, score reports, credentials, or PDFs.

Code uses the existing [MIT license](LICENSE); imported question material and font notices retain their separate terms. Keep those notices intact.
