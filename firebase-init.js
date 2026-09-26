// Student OS Firebase + Authentication + AI Logic bootstrap.
// This file intentionally contains no Gemini API key.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-ai.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js";

const cfg = window.FIREBASE_CONFIG || {};
const gate = document.getElementById("studentAuthGate");
const statusEl = document.getElementById("studentAuthStatus");

window.studentFirebase = {
  app: null,
  auth: null,
  currentUser: null,
  model: null,
  appCheck: null,
  configured: false,
  aiReady: false
};

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

function validConfig(c) {
  return ["apiKey", "authDomain", "projectId", "appId"]
    .every((k) => typeof c[k] === "string" && c[k] && !c[k].startsWith("PASTE_"));
}

function showGate(show) {
  document.body.classList.toggle("auth-locked", show);
  gate?.classList.toggle("hidden", !show);
}

function authError(e) {
  const map = {
    "auth/popup-closed-by-user": "Login dibatalkan.",
    "auth/popup-blocked": "Popup login diblokir browser. Izinkan popup untuk situs ini.",
    "auth/unauthorized-domain": "Domain ini belum ditambahkan ke Authorized Domains Firebase.",
    "auth/operation-not-allowed": "Provider login belum diaktifkan di Firebase.",
    "auth/email-already-in-use": "Email sudah terdaftar.",
    "auth/invalid-credential": "Email atau password tidak valid.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/weak-password": "Password minimal 6 karakter."
  };
  return map[e?.code] || e?.message || "Login gagal.";
}

async function loginGoogle() {
  if (!window.studentFirebase.auth) {
    setStatus("Firebase belum siap.");
    return;
  }

  setStatus("Membuka login Google...");
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    if (window.matchMedia("(max-width: 768px)").matches) {
      await signInWithRedirect(window.studentFirebase.auth, provider);
    } else {
      await signInWithPopup(window.studentFirebase.auth, provider);
    }
  } catch (e) {
    setStatus(authError(e));
  }
}

async function loginEmail(mode) {
  if (!window.studentFirebase.auth) {
    setStatus("Firebase belum siap.");
    return;
  }

  const email = document.getElementById("studentAuthEmail")?.value.trim();
  const password = document.getElementById("studentAuthPassword")?.value;

  if (!email || !password) {
    setStatus("Isi email dan password terlebih dahulu.");
    return;
  }

  setStatus(mode === "signup" ? "Membuat akun email..." : "Memproses login email...");
  try {
    if (mode === "signup") {
      await createUserWithEmailAndPassword(window.studentFirebase.auth, email, password);
    } else {
      await signInWithEmailAndPassword(window.studentFirebase.auth, email, password);
    }
  } catch (e) {
    setStatus(authError(e));
  }
}

window.studentLoginGoogle = loginGoogle;
window.studentLoginEmail = loginEmail;

try {
  showGate(true);

  if (!validConfig(cfg)) {
    setStatus("Firebase belum dikonfigurasi oleh developer. Lengkapi firebase-config.js.");
  } else {
    const app = initializeApp(cfg);
    const auth = getAuth(app);

    window.studentFirebase.app = app;
    window.studentFirebase.auth = auth;
    window.studentFirebase.configured = true;

    // Production App Check: fill cfg.appCheckSiteKey with the reCAPTCHA Enterprise
    // site key created for this Firebase Web app.
    if (cfg.appCheckSiteKey && !String(cfg.appCheckSiteKey).startsWith("PASTE_")) {
      window.studentFirebase.appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(cfg.appCheckSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    }

    try {
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      window.studentFirebase.model = getGenerativeModel(ai, {
        model: "gemini-3.8-flash"
      });
      window.studentFirebase.aiReady = true;
    } catch (e) {
      console.warn("Firebase AI Logic init failed:", e);
      window.studentFirebase.aiReady = false;
    }

    getRedirectResult(auth).catch((e) => setStatus(authError(e)));

    onAuthStateChanged(auth, (user) => {
      window.studentFirebase.currentUser = user || null;

      if (user) {
        showGate(false);
        setStatus("Login berhasil.");

        try {
          const profile = {
            name: user.displayName || "Mahasiswa",
            email: user.email || "",
            uid: user.uid,
            provider: user.providerData?.[0]?.providerId || ""
          };
          localStorage.setItem("studentos_user_profile", JSON.stringify(profile));
        } catch (_) {}
      } else {
        showGate(true);
        setStatus("Silakan login untuk melanjutkan.");
      }
    });
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
  showGate(true);
  setStatus("Inisialisasi Firebase gagal. Periksa konfigurasi project.");
}
