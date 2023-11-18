// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5PS_j3x0PZ9aS2e58j6F_WTQEtjDrNmo",
  authDomain: "boycott-40766.firebaseapp.com",
  projectId: "boycott-40766",
  storageBucket: "boycott-40766.appspot.com",
  messagingSenderId: "1028183178959",
  appId: "1:1028183178959:web:75bd9dccc5ea8feb5101ba",
  measurementId: "G-RDM6PMJJJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);