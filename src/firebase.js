
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrjzinNQRazdAQNOj47Fiqm4CzWZr0Iys",
  authDomain: "ishaprints-627a7.firebaseapp.com",
  projectId: "ishaprints-627a7",
  storageBucket: "ishaprints-627a7.firebasestorage.app",
  messagingSenderId: "179048998584",
  appId: "1:179048998584:web:9012695ce7ee0b255fb64d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);