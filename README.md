# Apple Study: SAT

A free, open-source practice room for Digital SAT Math and Reading and Writing. It runs as a static website with no API key, database, or AI service required.

[Open the public app](https://bobananaa.github.io/apple-study-sat/)

The public app includes lessons, vocabulary, planning, and a stopwatch. Official practice questions are not bundled. Clone the repository and import your own supported PDF bank for question practice.

## Features

- One question at a time, with a setup or reasoning prompt before answering.
- Answer checks, optional hints, recognition rules, and linked official explanations when supplied in the user's answer keys.
- A stopwatch with start, pause, and reset, available during untimed practice.
- Separate progress for Math and Reading and Writing, including assisted and independent answers.
- Search and filters by skill and difficulty. Earlier attempted question IDs are excluded.
- Browser-local profiles, tutoring-history import, and progress export/import.
- Responsive layout and keyboard-accessible controls.

## Start locally

Use Python 3.10 or later. No JavaScript installation or build step is needed.

```sh
python -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Select **Study profile** to enter scores, a goal, and a test date. The clean edition starts without personal information or question material.

## Load your own PDF question bank

The importer supports this folder layout:

```text
SAT Question Bank PDFs/
  Question Bank (Formatted)/
    Math/<domain>/<skill>/*.pdf
    Reading and Writing/<domain>/<skill>/*.pdf
    Answers/Math/*~Key.pdf
    Answers/Reading and Writing/*~Key.pdf
  Question Bank (Unformatted)/
    Answer Keys/...
```

Question files must have question-number and eight-character ID labels, with one embedded question image per label. Formatted answer keys must contain question numbers, IDs, and answers. The unformatted answer keys are optional; when present, their IDs are checked before linking a worked solution.

```sh
python -m pip install -r requirements.txt
python scripts/import_pdf_bank.py --pdf-root "/path/to/SAT Question Bank PDFs" --check
python scripts/import_pdf_bank.py --pdf-root "/path/to/SAT Question Bank PDFs"
```

The importer replaces `dist/data.json` and writes question assets under `dist/assets/`. It does not import a personal profile or tutoring history. Set up the profile through the website, and import history there if desired. Refresh after importing a library.

The app uses supplied answer keys rather than generated answers. Most setups and all Reading and Writing reasoning use a self-check against the provided solution; free-form reasoning is not automatically graded. Generic hints are skill guidance, not live AI tutoring.

## Import your study information

Open **Study profile → Import profile JSON**. Either upload a `tutoring_state.json` file with a `goal`, `diagnostic.responses`, and `targeted_sessions[].responses`, or use this simple shape:

```json
{
  "goal": {
    "math": null,
    "readingWriting": null,
    "total": null,
    "testDate": null
  }
}
```

Replace null values with your own information. Section scores range from 200 to 800, the target ranges from 400 to 1600, and the date uses `YYYY-MM-DD`. Recognized earlier question IDs are excluded from fresh practice. Export progress from **Your progress** to move website sessions to another browser or share them with a tutor.

## Privacy and publishing

Profiles, hints, setups, and new results are stored in the current browser's local storage. They do not automatically sync across devices or into a tutoring chat. Use exports for backups. Clearing browser storage removes local progress.

Before publishing a repository, keep your personal scores, histories, exports, original PDFs, generated question images, and answer-key files out of Git. The clean distribution contains an empty library and no hosting identifiers or credentials. Generated assets are ignored by default. A hosted static question library is accessible to visitors who can access that site, so use private hosting for a personal collection.

Only upload or redistribute question material you have permission to use. The software license does not grant rights to College Board questions or other third-party material. Apple Study: SAT is not affiliated with College Board.

## Tests and hosting

JavaScript logic tests use Node.js 20 or later:

```sh
node --test tests/*.test.js
```

For hosting, serve the `dist/` directory with any static host. No secrets are required. The clean copy has no preconfigured hosting provider or private project ID.

## Adaptive study routines

Open **Study plan** to enter diagnostic correct/total counts for Math or Reading and Writing, select study days and minutes, and enter your next SAT date. New installations start with no diagnostic or personal data. Diagnostic JSON import uses the downloadable template on that page. Screenshots and PDFs are not automatically read.

Plans use the most recent diagnostic per skill and up to ten subsequent practice answers. An answer counts as independent only when correct, without hints/reveal, and with a valid setup or self-checked reasoning. Small diagnostic samples are shrunk toward 50%; priorities spread practice among weak and untested skills. No scaled-score prediction is made. Hard practice requires stable skill results and a completed stable set; pace targets require two stable sets.

Calendar sessions respect weekdays and the test deadline and allocate practice, review, and breaks. The next 28 sessions (up to 12 weeks) refresh as results change. A paused set reserves its questions; attempted IDs and IDs scheduled elsewhere are excluded. Each session launches real questions from the local library. Plan estimates may differ from actual study time.

Routine preferences, diagnostics, and session results remain in browser storage and are included in progress exports/imports. No AI service, API key, or cloud progress sync is used. Editing or deleting a diagnostic rebuilds future recommendations; completed sessions are retained.

## Learning studio

The interface includes an adaptive learning path, 29 original skill lessons, worked examples and checks, a correction queue with spaced review, saved questions and scratch notes, persistent question highlights and eliminated choices, calculator and a local arithmetic graph plotter, 60 vocabulary cards, 18 roots, a seven-day Desmos challenge, personal XP/streaks/milestones, and light/dark/focus modes. Tutorial content is explicitly separate from official PDF question-bank material. Unlimited practice is limited only by the unused questions in the user's library.

**Assessments:** a 12-question diagnostic per selected section; Math or Reading and Writing simulations with two modules; full 98-question SAT simulation (four modules plus a 10-minute break); standard, 1.5x, or 2x practice timing. Timers use persisted deadlines and continue across reloads. Answers may be revisited within the current module and flagged for review; submitting or timing out locks a module. Module 2 uses this app's 65% accuracy threshold to select a harder or support question mix. Questions are balanced approximately by domain and never reused in fresh practice or other reserved assessments.

These are assembled practice simulations, not College Board tests or calibrated SAT scores. Reports show raw accuracy and per-skill diagnostics; setups are not collected during assessments and do not unlock setup mastery. Use Bluebook for official full-length checkpoints. Official/self-reported score checkpoints can be entered manually in Analytics; screenshots and PDFs are not automatically parsed.

**Persistence:** progress exports include all study tools, notes, saved items, vocabulary spacing, lessons, exams and routines. Imports validate question IDs and preserve distinct work. Everything is browser-local. Personal best weeks are a personal leaderboard; there is no fabricated global competition or multi-user cloud service.

**AI:** live AI is intentionally deferred. Core study logic and authored content are separate ES modules, allowing a future provider integration without rewriting the learning engine. No API keys, provider SDK, or credential fields are shipped. A future bring-your-own-key edition should use an appropriate secure provider connection or server proxy, with explicit user consent and usage controls.

**Access:** all implemented study features are available without subscription gates. This project has its own identity and original code/content; it does not include Dolphin code, branding, media, question content, native iOS app blocking, or commercial subscription machinery.

## Navigation

The six main sections are Learn, Practice, Review, Progress, Vocabulary, and Practice tests. Learn groups Today, Lessons, Study plan, Desmos tips, and Desmos week. Practice groups the current session and Question bank. Progress groups Overview, History, and Milestones. Settings holds profile, theme, export, and backup access. Practice tools and optional guidance open when needed.

## Desmos question tips

Learn → Desmos tips contains 32 original methods covering all ten instructional chapters of LearnSATMath’s [33:37 guide](https://www.youtube.com/watch?v=jCT0jTVzKy0). The full auto-caption transcript was reviewed October 22, 2026; entries link to source timestamps and official Desmos/College Board documentation. Examples are original study material, not official questions. Video shortcuts are qualified for domains, precision, parameter constraints, root counts and regression limits.

Math practice questions, rework questions, and completed assessment reviews have a Desmos tips button. Search by words, chapter, or Math skill. The referenced methods use [SAT Desmos](https://www.desmos.com/testing/collegeboard), not the limited local graph plotter. Opening the question’s list alone does not count as help; expanding a method before submitting a practice answer records the unique tip ID and increments assistance. Review methods mark the rework assisted. Active assessments keep instructional tips out of the test player; methods are available in the completed review. Progress exports retain the tip IDs and assistance.

### Additional official question imports

The PDF importer now extracts Math stem/choice text before the answer section when available, storing `mathText` and its source file/page. It never copies a rationale into the matching text. Newly imported Math questions automatically use the same runtime matcher; there is no fixed question-ID assignment list. Known-skill suggestions require both a matching skill and wording signal. Items without usable text offer clearly labeled skill references, not a claim of reviewed question-specific applicability.

For an existing library, enrich its Math matching text without rebuilding assets or clearing its profile/history:

```sh
python scripts/import_pdf_bank.py --pdf-root "/path/to/SAT Question Bank PDFs" --enrich-math-text dist/data.json
```

Custom library builders may supply `mathText`, `questionText`, `stem`, or `text`. Use an array `desmosTipIds` of IDs from `desmos-content.js` to assign explicit method tags, an empty array to suppress suggested methods, or `desmosDisabled: true` when none applies. These optional tags are reference metadata, not official-source evidence. Existing required file/page/question/ID source checks still apply. The matcher uses no AI service or network requests.

Application checks: `node --test tests/*.test.js`. Import-text checks (requires the Python requirements): `python -m unittest discover -s tests -p 'test_*.py'`.

## GitHub Pages

This repository includes a Pages workflow that tests the app, checks the public source for private data, and publishes `dist/`. In a fork, select **Settings → Pages → Source → GitHub Actions**, then run **Deploy Pages**. Each visitor starts with an empty profile; study data entered in the app stays in that visitor’s browser.

Do not commit an imported question bank to a public fork. The privacy check intentionally rejects generated libraries, personal profiles, and question assets. For a customized personal question library, run locally or use private hosting.

## Contributing

Run `npm test`, `python scripts/check_public_source.py`, and the Python tests before submitting changes. Use synthetic test fixtures. Keep personal study exports, screenshots, PDFs, credentials, and generated assets out of commits. The interface and study logic work without a paid service or AI API key.
