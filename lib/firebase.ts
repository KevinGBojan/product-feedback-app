import { getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config for firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDH4SXaT0nB_P7pI2AmOmnnco1jAkEYuug",
  authDomain: "product-feedback-app-b53a5.firebaseapp.com",
  projectId: "product-feedback-app-b53a5",
  storageBucket: "product-feedback-app-b53a5.appspot.com",
  messagingSenderId: "482688556458",
  appId: "1:482688556458:web:9b05d5c98128feba4a9fd3",
  measurementId: "G-6SG2YH4BJF",
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);

export const app = getApp();
export const auth = getAuth();
export const db = getFirestore();
export const provider = new GoogleAuthProvider();

export default Firebase;
