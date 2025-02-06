// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcbySbYvGwEnxkVBZeJ7QZ5uYCniNvux4",
  authDomain: "cw2project-31d03.firebaseapp.com",
  databaseURL: "https://cw2project-31d03-default-rtdb.firebaseio.com",
  projectId: "cw2project-31d03",
  storageBucket: "cw2project-31d03.firebasestorage.app",
  messagingSenderId: "1075315305003",
  appId: "1:1075315305003:web:26b34bc952e4481d17986e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app)
export default app