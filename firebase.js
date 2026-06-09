import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "vizag-fisherman-tracker.firebaseapp.com",
  projectId: "vizag-fisherman-tracker",
  storageBucket: "vizag-fisherman-tracker.firebasestorage.app",
  messagingSenderId: "39728715949",
  appId: "1:39728715949:web:594959d9b33998e8a134e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.getDocs = getDocs;

console.log("Firebase Connected Successfully");