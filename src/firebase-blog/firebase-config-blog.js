
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBXjcYYlOWy3Dn-e2IL8USP7ftp0LW3agQ",
  authDomain: "blogging-556e1.firebaseapp.com",
  projectId: "blogging-556e1",
  storageBucket: "blogging-556e1.appspot.com",
  messagingSenderId: "808378860318",
  appId: "1:808378860318:web:0f9ccefdbd36901697bf0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)