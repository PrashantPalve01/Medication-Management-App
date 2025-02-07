import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXY3VpjYNkoSjvAUDzjkGgKouXD1HKfZ4",
  authDomain: "ecommerceproduct-9a052.firebaseapp.com",
  databaseURL: "https://ecommerceproduct-9a052-default-rtdb.firebaseio.com",
  projectId: "ecommerceproduct-9a052",
  storageBucket: "ecommerceproduct-9a052.firebasestorage.app",
  messagingSenderId: "461380073535",
  appId: "1:461380073535:web:d77c4b20860c9aa4a5608a",
  measurementId: "G-QSSND729T2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export default app;
