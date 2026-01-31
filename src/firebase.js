import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5GFWVVXkXIrDnxUZUSl9CZ0ZVGW8PkaI",
  authDomain: "smart-agri-ef4ac.firebaseapp.com",
  projectId: "smart-agri-ef4ac",
  storageBucket: "smart-agri-ef4ac.firebasestorage.app",
  messagingSenderId: "289495927819",
  appId: "1:289495927819:web:6390bc090482ce56598b0e",
  measurementId: "G-2B4ZHFSJDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in your components
export const auth = getAuth(app);
export const db = getFirestore(app);