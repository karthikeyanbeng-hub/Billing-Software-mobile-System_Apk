import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project config values
const firebaseConfig = {
  apiKey: "AIzaSyCmLlenX3GDycDiKrrQdTCqejZE7kqdChw",
  authDomain: "mob-app-66fcd.firebaseapp.com",
  projectId: "mob-app-66fcd",
  storageBucket: "mob-app-66fcd.firebasestorage.app",
  messagingSenderId: "1049155036350",
  appId: "1:1049155036350:web:62135bdd8776490efeeaef",
  measurementId: "G-VMFMEWYVEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
};
