// Student OS Firebase Web configuration.
// Firebase Web config is public client configuration, not a Gemini secret.
// Replace the PASTE_* values with the config from your Firebase Web App.
// Keep Gemini API keys out of this file.
window.FIREBASE_CONFIG = {
  apiKey: "// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdfWk9ZSJUUfOmrc2Bm9UqV0TYaVdKWqY",
  authDomain: "student-os-b0d4c.firebaseapp.com",
  projectId: "student-os-b0d4c",
  storageBucket: "student-os-b0d4c.firebasestorage.app",
  messagingSenderId: "204988489673",
  appId: "1:204988489673:web:b1afc66b04afd113cad218",
  measurementId: "G-JL5YYTPCHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID",
  appCheckSiteKey: "PASTE_RECAPTCHA_ENTERPRISE_SITE_KEY"
};
