import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(true);

  useEffect(() => {
    if (!auth) {
      setFirebaseAvailable(false);
      setLoading(false);
      return;
    }
    
    // Test Firebase connection
    const testConnection = async () => {
      try {
        // Try to get current user state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setFirebaseAvailable(true);
          setLoading(false);
          unsubscribe(); // Clean up this test listener
        });
      } catch (error) {
        console.error('Firebase connection test failed:', error);
        setFirebaseAvailable(false);
        setLoading(false);
      }
    };
    
    testConnection();
  }, []);
  const signup = async (email, password, displayName) => {
    if (!auth) {
      throw new Error('Firebase authentication is not available. Please check your Firebase configuration.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  };

  const login = (email, password) => {
    if (!auth) {
      throw new Error('Firebase authentication is not available. Please check your Firebase configuration.');
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) {
      throw new Error('Firebase authentication is not available. Please check your Firebase configuration.');
    }
    return signOut(auth);
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    firebaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};