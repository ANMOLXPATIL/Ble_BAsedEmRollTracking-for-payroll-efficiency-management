// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmA7B_mNFf-gFc38iqJ8NGYB-agCFoeco",
    authDomain: "emprolltracking.firebaseapp.com",
    databaseURL: "https://emprolltracking-default-rtdb.firebaseio.com",
    projectId: "emprolltracking",
    storageBucket: "emprolltracking.firebasestorage.app",
    messagingSenderId: "822716527493",
    appId: "1:822716527493:web:645c363f54adf8c767caec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);