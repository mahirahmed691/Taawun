import { initializeApp } from "firebase/app";
import { getFirestore, collection, add, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC5PS_j3x0PZ9aS2e58j6F_WTQEtjDrNmo",
  authDomain: "boycott-40766.firebaseapp.com",
  projectId: "boycott-40766",
  storageBucket: "boycott-40766.appspot.com",
  messagingSenderId: "1028183178959",
  appId: "1:1028183178959:web:75bd9dccc5ea8feb5101ba",
  measurementId: "G-RDM6PMJJJC"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore, collection, add, serverTimestamp };
