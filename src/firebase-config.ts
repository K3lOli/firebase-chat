// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCvaKo8oY4WOhfSe5kW4Lb_5XTVFg7y3BE",
  authDomain: "chat-firebase-fefb5.firebaseapp.com",
  projectId: "chat-firebase-fefb5",
  storageBucket: "chat-firebase-fefb5.appspot.com",
  messagingSenderId: "102642790029",
  appId: "1:102642790029:web:63d89c0732ddaf2653bcc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();