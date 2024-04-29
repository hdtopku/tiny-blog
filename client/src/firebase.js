// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tiny-blog-1a77f.firebaseapp.com",
  projectId: "tiny-blog-1a77f",
  storageBucket: "tiny-blog-1a77f.appspot.com",
  messagingSenderId: "939090339976",
  appId: "1:939090339976:web:d9a5e5885f48c676a6173d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
