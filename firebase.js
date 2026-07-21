// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2q0mbXpWW2npF7twfmK2V93h766K_PIE",
  authDomain: "barbakpur-madrasatul-banat.firebaseapp.com",
  projectId: "barbakpur-madrasatul-banat",
  storageBucket: "barbakpur-madrasatul-banat.firebasestorage.app",
  messagingSenderId: "409129992513",
  appId: "1:409129992513:web:db5b84a32c641e36dba1c0",
  measurementId: "G-QWCVJP7MNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

export { db };
