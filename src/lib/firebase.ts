import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-4xsyv1cIiTolipu4rWt4Pf23K4mM1FA",
  authDomain: "kridha-xyz.firebaseapp.com",
  projectId: "kridha-xyz",
  storageBucket: "kridha-xyz.firebasestorage.app",
  messagingSenderId: "14134216393",
  appId: "1:14134216393:web:7cbc737de4fae6e1da2f18",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

const DEFAULT_ADMIN_EMAILS = ["tarsieriscool@gmail.com"];

function parseAdminEmails(value?: string) {
  return (value ? value.split(",") : DEFAULT_ADMIN_EMAILS)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

// Comma-separated emails allowed to access /admin. Set VITE_ADMIN_EMAILS in .env.local.
export const ADMIN_EMAILS = parseAdminEmails(import.meta.env.VITE_ADMIN_EMAILS);
