// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCg23XCPMd9b6IvwZ6kvZrzzvd9TysJXUo",
    authDomain: "birthday-generator.firebaseapp.com",
    projectId: "birthday-generator",
    storageBucket: "birthday-generator.firebasestorage.app",
    messagingSenderId: "9413118224",
    appId: "1:9413118224:web:7b92aee52a83405551fd95",
    measurementId: "G-NNMQKBBH9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
const db = getFirestore(app);

export { db };
