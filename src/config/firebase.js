import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCXMDxa_lKkjY1dOyEaXG_OV0Uxp1pFYzk",
  authDomain: "mobilestore-fc956.firebaseapp.com",
  projectId: "mobilestore-fc956",
  storageBucket: "mobilestore-fc956.firebasestorage.app",
  messagingSenderId: "672832475196",
  appId: "1:672832475196:web:e2d796834cf55542f07339",
  measurementId: "G-GDYFNZ33BE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;