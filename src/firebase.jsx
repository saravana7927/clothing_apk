import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import {getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import "firebase/compat/firestore";

firebase.initializeApp({  //api details
  });

const firebaseConfig = {
 //enter firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore=firebase.firestore();


export { auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,firestore };
