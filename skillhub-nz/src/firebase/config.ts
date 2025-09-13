// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEXwf9SCerk1XUSeWBlduL7nU-VbMxWu8",
  authDomain: "kiwispark-80e5d.firebaseapp.com",
  projectId: "kiwispark-80e5d",
  storageBucket: "kiwispark-80e5d.firebasestorage.app",
  messagingSenderId: "287274562407",
  appId: "1:287274562407:web:1fac7d76f212e3843035c2",
  measurementId: "G-933NXHTVY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics, firebaseConfig };
