import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYuOc7Otzc-5WI3xSFcxg6Kg5kYjhImB0",
  authDomain: "task-management-aa496.firebaseapp.com",
  databaseURL: "https://task-management-aa496-default-rtdb.firebaseio.com/",
  projectId: "task-management-aa496",
  storageBucket: "task-management-aa496.firebasestorage.app",
  messagingSenderId: "485774163985",
  appId: "1:485774163985:web:939ec4cb3ce4e685fef1b0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app); // Initialize Realtime Database
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Export the app object explicitly
export { app };
