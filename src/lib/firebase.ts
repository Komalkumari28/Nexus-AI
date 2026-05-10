import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Using environment variables for production security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "PLACEHOLDER"
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "PLACEHOLDER" && 
  firebaseConfig.apiKey.length > 10;

// Initialize Firebase only if config is valid to avoid initialization errors
let app;
if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  // Mock app for development if Firebase is not yet set up
  app = { name: 'mock-app' } as any;
  console.warn("Nexus AI: Firebase is not configured. Running in Demo Mode with Mock Authentication.");
}

export const auth = isFirebaseConfigured ? getAuth(app) : ({} as any);
export const db = isFirebaseConfigured ? getFirestore(app) : ({} as any);
export const storage = isFirebaseConfigured ? getStorage(app) : ({} as any);
