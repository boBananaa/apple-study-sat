# Developer guide

Apple SAT is a free desktop study app for Digital SAT Math and Reading and Writing, built with a local web frontend and Tauri. No AI service, API key, database, or study-progress server is required.

[Download the desktop app](https://bobananaa.github.io/apple-study-sat/#download) · [First-use guide](GETTING_STARTED.md) · [Contribute](../CONTRIBUTING.md)

GitHub Pages serves the download page in `site/`. The study app frontend is `dist/`; it can also be served locally for frontend development. Native library import and signed updates require the desktop app. The clean source includes original lessons and an empty question library.

## Features

- One question at a time, with a setup or reasoning prompt before answering.
- Answer checks, optional hints, recognition rules, and linked official explanations when supplied in the user's answer keys.
- A stopwatch with start, pause, and reset, available during untimed practice.
- Separate progress for Math and Reading and Writing, including assisted and independent answers.
- Search and filters by skill and difficulty. Earlier attempted question IDs are excluded.
- Browser-local profiles, tutoring-history import, and progress export/import.
- Responsive layout and keyboard-accessible controls.

## Start locally

For desktop development, install Node.js 22+, Rust, and the [Tauri platform prerequisites](https://v2.tauri.app/start/prerequisites/). From the repository root:

```sh
npm ci
npm test
npm run desktop:dev
```

The expected result is a desktop window with included lessons and an empty question bank. See [release setup](RELEASING.md) for platform packaging, signing, and updates.

For a browser-only frontend preview, use Python 3.10 or later. This route does not provide native import or update commands:

```sh
python -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Open **Home** to enter an official report, or **Practice** to browse included lessons. The clean edition starts without personal information or question material.

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

The importer replaces `dist/data.json` and writes question assets under `dist/assets/`. It does not import a personal profile or tutoring history. For a desktop library, choose this output folder (`dist` by default) in **Settings → Desktop app → Import prepared question library**. The app copies the validated data and assets into its local data directory. For a browser preview, refresh after preparing the library. Personal profiles and full history move through the separate progress flow.

The app uses supplied answer keys rather than generated answers. Most setups and all Reading and Writing reasoning use a self-check against the provided solution; free-form reasoning is not automatically graded. Generic hints are skill guidance, not live AI tutoring.

## Import your study information

Open **Settings → Question library and backups → Import or edit a profile → Import profile JSON**. Either upload a `tutoring_state.json` file with a `goal`, `diagnostic.responses`, and `targeted_sessions[].responses`, or use this simple shape:

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

This profile import restores preferences and earlier attempted IDs; it does not satisfy the complete official-report requirement for a roadmap. Enter the two section scores and eight domain bands in Home. Replace null values with your own information. Section scores range from 200 to 800, the target ranges from 400 to 1600, and the date uses `YYYY-MM-DD`. Recognized earlier question IDs are excluded from fresh practice. Export progress from **Settings → Question library and backups** to move website sessions to another browser or share them with a tutor.

## Privacy and publishing

Profiles, hints, setups, and new results are stored in the current browser's local storage. They do not automatically sync across devices or into a tutoring chat. Use exports for backups. Clearing browser storage removes local progress.

Before publishing a repository, keep your personal scores, histories, exports, original PDFs, generated question images, and answer-key files out of Git. The clean distribution contains an empty library and no hosting identifiers or credentials. Generated assets are ignored by default. A hosted static question library is accessible to visitors who can access that site, so use private hosting for a personal collection.

Only upload or redistribute question material you have permission to use. The software license does not grant rights to College Board questions or other third-party material. Apple SAT is not affiliated with College Board.

## Tests and hosting

JavaScript logic tests use Node.js 22 or later:

```sh
node --test tests/*.test.js
```

For hosting, serve the `dist/` directory with any static host. No secrets are required. The clean copy has no preconfigured hosting provider or private project ID.

## Adaptive study routines

Home requires the latest single-sitting report from an actual SAT or full-length official Bluebook SAT practice test: source, date, two section scores, and eight domain bands. Official reports are entered manually; screenshots and PDFs are not parsed. A profile, superscore, or unofficial skill diagnostic does not substitute for this baseline. Included lessons remain accessible before a report is added.

The eight domain bands set broad starting priorities. `results-logic.js` combines domain weakness with observed practice or optional skill-diagnostic evidence, rather than inventing exact-skill accuracy from a domain band. Subsequent fresh practice helps choose specific skills and difficulty. An independent practice answer must be correct, unassisted, supported by a valid setup or self-checked reasoning, and not a guess. Hard readiness and timed readiness are separate checks.

Home presents a short lesson/practice/review sequence and one Continue action. Study days, minutes, target, and section focus are controlled in Settings. A future test date enables calendar previews; no date yields an undated starting point. On or after the test date, update it before generating more calendar days. Future previews are tentative and reserve no questions until practice starts. Completed work remains intact.

Official practice checkpoints default to about every 14 days and can be spaced 7, 14, 21, or 28 days apart. A full checkpoint occupies its own day with 144 minutes including the break; it is not squeezed into an ordinary short study session. Checkpoints continue after lessons are reviewed, until the next test date or until the user pauses them after becoming satisfied with a practice score. New official results refresh priorities. No full test is scheduled in the final three days.

Additional skill diagnostics can inform follow-up practice but remain distinct from official reports. Routine preferences, reports, diagnostics, and progress stay in local storage and are included in progress backups. There is no calibrated SAT-score prediction or automatic cloud sync.

## Learning studio

The interface includes an adaptive learning path, 111 original lessons across all 29 question-bank skills, worked examples and checks, a correction queue with spaced review, saved questions and scratch notes, persistent question highlights and eliminated choices, calculator and a local arithmetic graph plotter, 60 vocabulary cards, 18 roots, a seven-day Desmos challenge, personal XP/streaks/milestones, and light/dark/focus modes. Tutorial content is explicitly separate from official PDF question-bank material. Unlimited practice is limited only by the unused questions in the user's library.

**Assessments:** a 12-question diagnostic per selected section; Math or Reading and Writing simulations with two modules; full 98-question SAT simulation (four modules plus a 10-minute break); standard, 1.5x, or 2x practice timing. Timers use persisted deadlines and continue across reloads. Answers may be revisited within the current module and flagged for review; submitting or timing out locks a module. Module 2 uses this app's 65% accuracy threshold to select a harder or support question mix. Questions are balanced approximately by domain and never reused in fresh practice or other reserved assessments.

These are assembled practice simulations, not College Board tests or calibrated SAT scores. Reports show raw accuracy and per-skill diagnostics; setups are not collected during assessments and do not unlock setup mastery. Use Bluebook for official full-length checkpoints. Complete official report checkpoints are entered through Home or Settings. Legacy self-reported Analysis checkpoints do not satisfy the official-report gate; screenshots and PDFs are not automatically parsed.

**Persistence:** progress exports include all study tools, notes, saved items, vocabulary spacing, lessons, exams and routines. Imports validate question IDs and preserve distinct work. Everything is browser-local. Personal best weeks are a personal leaderboard; there is no fabricated global competition or multi-user cloud service.

**AI:** live AI is intentionally deferred. Core study logic and authored content are separate ES modules, allowing a future provider integration without rewriting the learning engine. No API keys, provider SDK, or credential fields are shipped. A future bring-your-own-key edition should use an appropriate secure provider connection or server proxy, with explicit user consent and usage controls.

**Access:** all implemented study features are available without subscription gates. This project has its own identity and original code/content; it does not include Dolphin code, branding, media, question content, native iOS app blocking, or commercial subscription machinery.

## Navigation

The four main tabs are **Home**, **Practice**, **Analysis**, and **Settings**. Home is the guided daily path. Practice offers skill practice, Question Rush, review, and assessments, with lessons, Desmos guides, and vocabulary under a closed study-tools section. Analysis contains performance, attempt history, and milestones. Settings holds the routine, diagnostics, profile, theme, library setup, and backups. The stopwatch stays available across the app.

## Desmos question tips

Practice → Lessons and study tools → Desmos guides contains 32 original methods covering all ten instructional chapters of LearnSATMath’s [33:37 guide](https://www.youtube.com/watch?v=jCT0jTVzKy0). The full auto-caption transcript was reviewed October 22, 2026; entries link to source timestamps and official Desmos/College Board documentation. Examples are original study material, not official questions. Video shortcuts are qualified for domains, precision, parameter constraints, root counts and regression limits.

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

## Correction, confidence, and delayed checks

- **Correct the reasoning:** an incorrect first answer opens a small hint and a retry with a corrected setup, an error category, and a recognition rule. The key and supplied explanation open after a correct retry or an explicit reveal. Retries remain assisted and never replace the original answer, confidence, or accuracy. Completing a correction schedules same-question review for the next day; that rework stays separate from fresh practice.
- **Check what stuck:** practice schedules a check three calendar days later. A check uses three unused, previously unexposed Easy/Medium questions from the same section and skill. All three first answers must be correct without help or guessing and have valid approaches (model-checked where supported, otherwise self-checked) to pass. A passed check returns in seven days; a failed check returns the next day with fresh questions. No question is recycled to fill a shortage. These are app practice rules, not validated mastery or score predictions.
- **Confidence and time:** new practice asks for Sure, Unsure, or Guessing before feedback. Progress compares first-answer accuracy, help used, and median active study time by section, with skills to revisit. Guessed correct answers keep their raw correctness but do not count toward readiness or a passed delayed check. Older unrated records remain unrated. Active time is approximate visible, focused time; it is separate from the optional stopwatch and assessment deadlines.
- **Honest lesson completion:** completing an original lesson check means the lesson was reviewed. A miss gives a hint before an optional worked-answer reveal. The lesson alone does not certify skill mastery.

Delayed checks appear on Home when due and under Practice → Review. Their dates are independent of the calendar routine. Merely displaying a question marks it exposed for future fresh selection, including in an assessment that is later archived. Progress backups include this exposure history, correction attempts, confidence, and delayed-check evidence. Equal-length session imports can merge correction progress while preserving first attempts.

Without an imported question library, the app clearly offers bank setup instead of promising a five-question practice session. Lessons and vocabulary remain available. Both Math and Reading and Writing use the same learning evidence rules.

## Question Rush

`rush-logic.js` and `rush-ui.js` implement 5-, 10-, and 20-question pacing rounds in either section. Two stable untimed practice sets unlock timing; Hard retains its separate gate. Per-question deadlines persist across reloads and absences. A timeout enters feedback without starting another clock; Next is explicit. Correct answers earn speed stars, while wrong answers, skips, and timeouts reset the streak. Focused view hides game details.

Rounds live in `studio.rushRounds`, outside ordinary practice sessions and mastery calculations. Active rounds reserve their selected IDs; ended rounds retain exposure exclusions and release unseen questions. Results preserve first answers and source citations, feed missed or ended unanswered items into Review, and validate/merge through progress backups. Speed results appear separately in Analysis.
