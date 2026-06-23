import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTxI8FoxYiqADUnxIujbRBqsZPyXQhN4E",
  authDomain: "loteriavirtual.firebaseapp.com",
  projectId: "loteriavirtual",
  storageBucket: "loteriavirtual.firebasestorage.app",
  messagingSenderId: "849350780395",
  appId: "1:849350780395:web:3fc68fe50287107c5e65ae"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
};
