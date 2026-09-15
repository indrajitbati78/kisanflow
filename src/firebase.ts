import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

// User's provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBvaFl5r4nUrc-QiyIIVwXEqN_x6iHi53s",
  authDomain: "kisanflow-4a75e.firebaseapp.com",
  projectId: "kisanflow-4a75e",
  storageBucket: "kisanflow-4a75e.firebasestorage.app",
  messagingSenderId: "590681823634",
  appId: "1:590681823634:web:e2a991c3234b9408ce094b"
};

// Initialize Firebase App & Authentication
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
};

export type { FirebaseUser };

