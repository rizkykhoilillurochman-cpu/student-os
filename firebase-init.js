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
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-ai.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js";

const cfg = window.FIREBASE_CONFIG || {};
const gate = document.getElementById('studentAuthGate');
const statusEl = document.getElementById('studentAuthStatus');

window.studentFirebase = {
  app: null,
  auth: null,
  currentUser: null,
  model: null,
  appCheck: null,
  configured: false
};

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

function valid(c) {
  return ['apiKey', 'authDomain', 'projectId', 'appId'].every(
    k => typeof c[k] === 'string' && c[k] && !c[k].startsWith('PASTE_')
  );
}

function showGate(v) {
  document.body.classList.toggle('auth-locked', v);
  gate?.classList.toggle('hidden', !v);
}

function authError(e) {
  const m = {
    'auth/popup-closed-by-user': 'Login dibatalkan.',
    'auth/popup-blocked': 'Popup login diblokir browser. Izinkan popup untuk situs ini.',
    'auth/unauthorized-domain': 'Domain ini belum ditambahkan ke Authorized Domains Firebase.',
    'auth/operation-not-allowed': 'Provider login belum diaktifkan di Firebase.',
    'auth/email-already-in-use': 'Email sudah terdaftar.',
    'auth/invalid-credential': 'Email atau password tidak valid.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/weak-password': 'Password minimal 6 karakter.'
  };
  return m[e?.code] || e?.message || 'Login gagal.';
}

async function loginGoogle() {
  if (!window.studentFirebase.auth) return setStatus('Firebase belum siap.');
  setStatus('Membuka login Google...');
  try {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    if (matchMedia('(max-width: 768px)').matches) {
      await signInWithRedirect(window.studentFirebase.auth, p);
    } else {
      await signInWithPopup(window.studentFirebase.auth, p);
    }
  } catch (e) {
    setStatus(authError(e));
  }
}

async function loginEmail(mode) {
  if (!window.studentFirebase.auth) return setStatus('Firebase belum siap.');
  const email = document.getElementById('studentAuthEmail')?.value.trim();
  const pw = document.getElementById('studentAuthPassword')?.value;
  if (!email || !pw) return setStatus('Email dan password wajib diisi.');
  setStatus(mode === 'signup' ? 'Membuat akun email...' : 'Memproses login email...');
  try {
    if (mode === 'signup') {
      await createUserWithEmailAndPassword(window.studentFirebase.auth, email, pw);
    } else {
      await signInWithEmailAndPassword(window.studentFirebase.auth, email, pw);
    }
  } catch (e) {
    setStatus(authError(e));
  }
}

window.studentLoginGoogle = loginGoogle;
window.studentLoginEmail = loginEmail;

try {
  showGate(true);
  if (!valid(cfg)) {
    setStatus('Firebase belum dikonfigurasi oleh developer. Login dikunci sampai config Firebase aktif.');
  } else {
    const app = initializeApp(cfg);
    const auth = getAuth(app);
    window.studentFirebase.app = app;
    window.studentFirebase.auth = auth;
    window.studentFirebase.configured = true;

    try {
      if (cfg.appCheckSiteKey && !String(cfg.appCheckSiteKey).startsWith('PASTE_')) {
        window.studentFirebase.appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(cfg.appCheckSiteKey),
          isTokenAutoRefreshEnabled: true
        });
      }
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      window.studentFirebase.model = getGenerativeModel(ai, { model: 'gemini-3.8-flash' });
    } catch (e) {
      console.warn('Firebase AI Logic init failed', e);
    }

    getRedirectResult(auth).catch(e => setStatus(authError(e)));

    onAuthStateChanged(auth, user => {
      window.studentFirebase.currentUser = user || null;
      if (user) {
        showGate(false);
        setStatus('Login berhasil.');
        try {
          safeSetStorage('studentos_user_profile', JSON.stringify({
            name: user.displayName || 'Mahasiswa',
            email: user.email || '',
            uid: user.uid,
            provider: user.providerData?.[0]?.providerId || ''
          }));
        } catch (e) {}
      } else {
        showGate(true);
        setStatus('Silakan login untuk melanjutkan.');
      }
    });
  }
} catch (e) {
  showGate(true);
  setStatus('Inisialisasi Firebase gagal. Periksa konfigurasi project.');
}
