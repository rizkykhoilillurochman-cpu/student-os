# Student OS Android APK

The repository now contains a native Android WebView shell under `android/`.

## Build
GitHub Actions builds an installable APK automatically on pushes to `main`.
Workflow: `.github/workflows/android-apk.yml`.

The APK opens the public Student OS web app:
https://rizkykhoilillurochman-cpu.github.io/student-os/

## Important
The APK is installable, but production authentication/AI still depend on the Firebase project configuration in `firebase-config.js` and the deployed GitHub Pages site being configured.

No Gemini API secret belongs in this repository.
