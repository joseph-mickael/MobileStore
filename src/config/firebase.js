import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with your actual project credentials
const firebaseConfig = {
  apiKey: "AIzaSyCXMDxa_lKkjY1dOyEaXG_OV0Uxp1pFYzk",
  authDomain: "mobilestore-fc956.firebaseapp.com",
  projectId: "mobilestore-fc956",
  storageBucket: "mobilestore-fc956.firebasestorage.app",
  messagingSenderId: "672832475196",
  appId: "1:672832475196:web:e2d796834cf55542f07339",
  measurementId: "G-GDYFNZ33BE"
};

let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Create mock objects to prevent app crashes
  auth = null;
  db = null;
}

export { auth, db };
export default app;