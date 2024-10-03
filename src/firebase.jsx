import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import {getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import "firebase/compat/firestore";

firebase.initializeApp({  apiKey: "AIzaSyDDrc6HraOb3MiA5y4o6squuzBRzEaxKeo",
  authDomain: "light-spot-mens-wear.firebaseapp.com",
  projectId: "light-spot-mens-wear",
  storageBucket: "light-spot-mens-wear.appspot.com",
  messagingSenderId: "365046866216",
  appId: "1:365046866216:web:86613c10c6958ff7d6f01d",
  measurementId: "G-1QJYWMP95E"});

const firebaseConfig = {
 //enter firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore=firebase.firestore();


export { auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,firestore };