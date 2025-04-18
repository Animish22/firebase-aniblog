// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GithubAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGFpO2RosFj8lfsWfXDm1XTwW3jtu4bWk",
  authDomain: "practice-805f6.firebaseapp.com",
  projectId: "practice-805f6",
  storageBucket: "practice-805f6.firebasestorage.app",
  messagingSenderId: "391817437042",
  appId: "1:391817437042:web:2bd7191d74a7263f6087eb",
  measurementId: "G-J3YWH1RE7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app) ;  
export const db = getFirestore(app) ; 
export const provider = new GithubAuthProvider();