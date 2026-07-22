import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDla8hJ2QRTogeTacX7w6ibX4-YFSuddVc",
  authDomain: "ai-study-planner-76265.firebaseapp.com",
  projectId: "ai-study-planner-76265",
  storageBucket: "ai-study-planner-76265.firebasestorage.app",
  messagingSenderId: "748172574385",
  appId: "1:748172574385:web:e850a875b6246e24872c90",
  measurementId: "G-BCRDN4BP4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;
