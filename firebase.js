
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAzaZw4CmNNcIosJdPlVoHf-bVu5vd6Vxo",
    authDomain: "twitter-clone-233a0.firebaseapp.com",
    projectId: "twitter-clone-233a0",
    storageBucket: "twitter-clone-233a0.appspot.com",
    messagingSenderId: "838827345425",
    appId: "1:838827345425:web:16b441a21a012bff5d93b0",
    measurementId: "G-7RK9GL09FR"
  };
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };