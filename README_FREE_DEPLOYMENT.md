# Student OS — Free architecture

Student OS is prepared for a no-cost public setup using GitHub Pages + Firebase Spark + Firebase AI Logic.

## AI
The app uses Firebase AI Logic with the Gemini Developer API. Users do not enter or store a Gemini API key.

## Authentication
The app has a mandatory login gate for Google, Apple, and Email/Password.

## Firebase setup
1. Create a Firebase project on the Spark plan.
2. Enable Google and Email/Password in Authentication.
3. Configure Apple only when Apple Developer credentials are available.
4. Register the Web app and copy its client config into firebase-config.js.
5. In AI Services > AI Logic, choose Gemini Developer API.
6. Configure Web App Check using reCAPTCHA Enterprise and place its site key in firebase-config.js.

## Hosting
GitHub Pages is the free static host target for this repository. The included workflow publishes the repository root.

Apple Sign In is not inherently free because Apple Developer Program membership currently has a USD 99 annual fee. Google + Email/Password can stay on Firebase's no-cost Spark path.

Never commit Gemini API secrets to the repository.
