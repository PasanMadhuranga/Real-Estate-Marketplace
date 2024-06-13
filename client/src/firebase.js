// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Vite, a build tool, uses import.meta.env to access environment variables. This is part of its design to work efficiently with modern ES modules.
  authDomain: "real-estate-marketplace-f7384.firebaseapp.com",
  projectId: "real-estate-marketplace-f7384",
  storageBucket: "real-estate-marketplace-f7384.appspot.com",
  messagingSenderId: "539282515955",
  appId: "1:539282515955:web:e876e620b0bb34b2951486"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);