# Start studying with Apple SAT

[Download Apple SAT](https://bobananaa.github.io/apple-study-sat/#download) · [Back to the overview](../README.md)

Apple SAT is a desktop app for Mac and Windows. No account, subscription, or AI key is needed. You can start with included lessons; official question practice requires your own compatible question library.

## 1. Install the app

On the download page, choose **Mac** for the universal `.dmg` (Apple Silicon and Intel) or **Windows** for the x64 `setup.exe` (Windows 10/11). Download installers from this project's GitHub Releases. Files named `.sig`, `latest.json`, and `.app.tar.gz` are update files, not the normal first-install route. GitHub's source ZIP is for development.

- **Mac:** open the disk image and copy Apple SAT to Applications, then open the app.
- **Windows:** run the setup installer and open Apple SAT from the installed shortcut.

These are early previews without Apple notarization or Windows publisher signing. Your operating system may block or warn about them. If you're uncomfortable installing a preview, wait for a signed release. No setup step requires disabling system security protections.

## 2. Finish your first lesson

You do not need a score report or question bank for this step.

1. Open **Practice** and choose **Math** or **Reading and Writing** in the section picker.
2. Expand **Lessons and study tools → Lessons**.
3. Open a lesson, read its method and worked example, then answer the check.
4. Look for **Lesson reviewed** after a correct answer. A retry is kept as assisted tutorial practice.

That is your first useful result: one method reviewed and saved locally. It is not a mastery certificate. For Math, the Desmos guides also include 32 original application exercises.

## 3. Make your daily roadmap

Open **Home** and use one official SAT or full-length Bluebook practice report:

- Choose the report source and date.
- Enter both section scores from that sitting.
- Enter the performance band shown for each of the four Math and four Reading and Writing domains.
- Add your target, section focus, and next SAT date if known. Choose study days and minutes in Settings.

Select **Save results and build my path**. Home shows your next step and, with a future test date, upcoming study days. Broad domain bands set the starting priorities; fresh practice helps identify specific skill needs. A superscore or a few unofficial diagnostic questions cannot replace this baseline.

If you haven't taken an official test yet, expand **Haven't taken an official test yet?** on Home and follow the Bluebook guidance. Return with the report afterward. Keep using lessons in the meantime.

At each planned official checkpoint, take a Bluebook test and enter its new report. Completing the lessons does not end the checkpoint cycle. You can adjust spacing or pause future checkpoints once you're satisfied with your practice score. A practice score is not a guarantee of a test-day result.

## 4. Add your own question bank

**Not included:** official question PDFs, question images, answer keys, or another student's information.

The current importer is a Python tool for a specific question-bank PDF layout; it does not accept arbitrary screenshots or every kind of SAT PDF. Follow the [supported format and import commands](DEVELOPMENT.md#load-your-own-pdf-question-bank). This preparation step needs a terminal and Python 3.10+.

Once the importer finishes:

1. In the desktop app, open **Settings → Desktop app → Import prepared question library**.
2. Choose the output folder containing **data.json** and **assets**. For the default importer output, that folder is the repository's **dist** directory.
3. After the app refreshes, expand **Question library and backups** to confirm the question count.
4. Open **Practice → Practice a skill**. Fresh questions have file, page, question number, and ID citations.

The library stays on your computer. The app does not upload it to GitHub. Importing a library keeps previous attempted IDs excluded; full scores and study history move separately through progress backups.

### When Question Rush unlocks

Timed rounds become available after **two completed sets of at least five questions**, each meeting the app's 80% independent accuracy and valid setup/reasoning requirement. Hard difficulty has its separate readiness check. The stopwatch is always available during untimed study.

Rush offers 5, 10, or 20 fresh questions. Each question has a deadline that continues if you leave the app; feedback stops the clock until you explicitly start the next question. Misses and ended unanswered questions go to Review. Stars and streaks measure a pacing round, not setup mastery or a predicted SAT score.

## 5. Back up and update

Export progress from **Settings → Question library and backups** before changing computers or clearing app data. A progress export does not package the question images or PDFs: import the matching prepared library on the destination first, then import the progress backup. Keep both in a private location.

The desktop app checks for updates on launch and every six hours. You can also use **Settings → Desktop app → Check for updates**. Updates wait while an exercise, form, or dialog is open; return to the Practice landing page to allow an available update to install and restart the app. Offline study continues if the check fails.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| No questions available | Included lessons still work. Prepare and import a compatible library for question practice. |
| No roadmap yet | Enter a complete official report: two section scores and all eight domain bands. A future SAT date enables calendar previews. |
| Test date has passed | Update the next SAT date in Settings before building more calendar days. |
| Rush or Hard is locked | Finish the required untimed sets and review each setup or reasoning check. A correct answer alone does not meet readiness. |
| Too few fresh questions | Widen the skill/difficulty filters, choose a shorter round, or import more material. Paused sessions reserve questions; repeated questions belong in Review. |
| Folder import fails | Select the folder containing data.json and assets, not the parent project folder or the PDF source folder. Use the supported PDF importer first. |
| Backup contains missing questions | Import its matching question library before importing progress. |
| An update is waiting | Leave the exercise and any open form/dialog. Return to Practice; if installation fails, keep using the current app and try the check again later. |

Still stuck? [Report a problem](https://github.com/boBananaa/apple-study-sat/issues/new/choose). Include the app version, operating system, reproduction steps, and error message with private details removed. Never attach personal reports, progress exports, keys, or question-bank files to a public issue.
