import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1Ne8VJwX62xCUItgvRzCPszYeVW3Omvw",
  authDomain: "schatz-cards.firebaseapp.com",
  projectId: "schatz-cards",
  storageBucket: "schatz-cards.appspot.com", // FIXED: Changed from .firebasestorage.app
  messagingSenderId: "617343736847",
  appId: "1:617343736847:web:e81393e2f20247c80b577a",
  measurementId: "G-MZX3WJG4VM"
};

// Initialize Firebase with emulator support
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

export { db, auth };