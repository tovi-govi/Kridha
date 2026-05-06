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

// Set the email of the user(s) who can access /admin.
export const ADMIN_EMAILS = ["tarsieriscool@gmail.com"];
