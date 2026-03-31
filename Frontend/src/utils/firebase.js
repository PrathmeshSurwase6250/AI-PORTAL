// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-portal-49808.firebaseapp.com",
  projectId: "ai-portal-49808",
  storageBucket: "ai-portal-49808.firebasestorage.app",
  messagingSenderId: "876686847893",
  appId: "1:876686847893:web:d2cbc134ece9b6eea5109c",
  measurementId: "G-2S3DZLLZEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider() 

export { auth , provider }
