# Desktop releases

The app source is `dist/`; GitHub Pages serves only `site/`. Tauri packages the frontend locally. Its stable application identifier keeps browser-local study progress and the imported library directory across updates.

## What a push does

The Desktop release workflow runs on app-source pushes to main. It tests learning behavior and public-source privacy, stamps version `0.2.<workflow run number>`, runs native tests, and builds a universal Mac DMG plus a Windows NSIS installer. Tauri generates signed updater archives and `latest.json`.

After checks pass, the workflow creates an exact source tag while the commit is still the branch head. The release stays a draft until both platform builds pass. Superseded source pushes stay unpublished. A failed build never replaces the last published update. The app reads the latest published release manifest over HTTPS and verifies its signature with the embedded public key. It installs only outside practice, Question Rush, and tests and when no form or dialog is open, then restarts. A check also runs every six hours. No progress is uploaded during this check.

A workflow rerun uses the same version; an additional push gets a later version. Download links on Pages are discovered from the verified GitHub release API with a release-page fallback.

## Signing in a fork

Generate a fresh updater key with the official Tauri CLI:

```sh
npm run tauri -- signer generate -w /a/private/location/apple-sat.key
```

Put the **public** key in `src-tauri/tauri.conf.json`. Store the private key as an encrypted repository Actions secret named `TAURI_SIGNING_PRIVATE_KEY`; set `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` if you chose a password and wire that secret into the workflow. Never put a private key in a commit, issue, release asset, screenshot, or log. Back it up securely: losing it prevents updates from reaching already installed copies. Existing users cannot silently switch to a different key.

Change the identifier, updater endpoint, release-page links, and repository references for a separate fork. A fork should build its own audience and signing trust.

## Operating-system signing

Updater signatures establish update origin and integrity. They do not replace Apple Developer ID signing/notarization or Windows publisher signing. Preview installers currently disclose the absence of those identities. Follow Tauri's official platform signing documentation when valid developer certificates are available; store those credentials only in encrypted secrets. Do not weaken OS security protections in installation scripts.

## Native library import

The app imports a prepared folder containing `data.json` and the referenced image/PDF assets from the repository's PDF importer. It copies only validated relative assets into the application's local data directory, keeps previous library editions, and rejects external URLs, traversal paths, executable assets, or out-of-folder references. Scores and full tutoring histories are imported separately as progress; attempted IDs from a library are retained as exposure exclusions.

## Checks

Run `npm test`, `python scripts/check_public_source.py`, the Python importer tests, and `cargo test --manifest-path src-tauri/Cargo.toml --lib`. Before a release, review the app with an example profile and verify the update manifest contains both Mac architectures and Windows, signature files, and the intended release version. Real end-to-end update testing requires two installed signed versions; a successful build alone is not proof of an installation upgrade on a user's machine.
