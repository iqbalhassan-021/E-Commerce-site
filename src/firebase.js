
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
//  apiKey: "AIzaSyA4HVgg92nNrk0nM2sneT0ojFb0HFmOVT4",
//   authDomain: "thehairlocs-94374.firebaseapp.com",
//   projectId: "thehairlocs-94374",
//   storageBucket: "thehairlocs-94374.firebasestorage.app",
//   messagingSenderId: "358707840743",
//   appId: "1:358707840743:web:fe0a61952debef020c8442",
//   measurementId: "G-23H15FBP4S"


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
