import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXEedkrLZbE3o5ktkICnU1ixyUqgGLWZM",
  authDomain: "vizag-fisherman-tracker.firebaseapp.com",
  projectId: "vizag-fisherman-tracker",
  storageBucket: "vizag-fisherman-tracker.firebasestorage.app",
  messagingSenderId: "39728715949",
  appId: "1:39728715949:web:594959d9b33998e8a134e4",
  measurementId: "G-HE52Y2LQ7Y"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.getDocs = getDocs;
window.addDoc = addDoc;

console.log("Firebase Connected Successfully");
async function loadFirebaseBoats() {

    try {

        const querySnapshot =
            await getDocs(collection(db, "boats"));

        boats.length = 0;

        querySnapshot.forEach((doc) => {

            boats.push(doc.data());

        });

        console.log("Firebase Boats Loaded:", boats);

        updateDashboard();
        loadBoatRegistry();
        loadReports();

    } catch(error) {

        console.error("Firestore Error:", error);

    }

}

window.addEventListener("load", () => {

    setTimeout(() => {

        loadFirebaseBoats();

    }, 1000);

});