import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLFEtLGbfBV-kOxMxcJywzba2EMy6QTTw",
  authDomain: "agriconnect-b0ee0.firebaseapp.com",
  projectId: "agriconnect-b0ee0",
  storageBucket: "agriconnect-b0ee0.firebasestorage.app",
  messagingSenderId: "932410935541",
  appId: "1:932410935541:web:030fe638bfdd502e635dbc",
  measurementId: "G-HNZB5JZF8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in your components
export const auth = getAuth(app);
export const db = getFirestore(app);