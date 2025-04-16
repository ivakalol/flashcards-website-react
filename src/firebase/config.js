import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1Ne8VJwX62xCUItgvRzCPszYeVW3Omvw",
  authDomain: "schatz-cards.firebaseapp.com",
  projectId: "schatz-cards",
  storageBucket: "schatz-cards.firebasestorage.app",
  messagingSenderId: "617343736847",
  appId: "1:617343736847:web:e81393e2f20247c80b577a",
  measurementId: "G-MZX3WJG4VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable local persistence to allow offline access (optional)
// enableIndexedDbPersistence(db).catch((err) => console.error("Firestore persistence error:", err));

export { db, auth };