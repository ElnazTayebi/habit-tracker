import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoA2NyWdGZGoJIwhK2hTloDMpmoz_xSj4",
  authDomain: "habit-tracker-c678a.firebaseapp.com",
  projectId: "habit-tracker-c678a",
  storageBucket: "habit-tracker-c678a.firebasestorage.app",
  messagingSenderId: "196201128216",
  appId: "1:196201128216:web:33f10661deb1de22cffe6d"
};

const app = initializeApp(firebaseConfig);

// Export auth instance
export const auth = getAuth(app);