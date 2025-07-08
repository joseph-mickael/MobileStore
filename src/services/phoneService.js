import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'phones';

// Create a new phone
export const createPhone = async (phoneData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...phoneData,
      price: parseFloat(phoneData.price),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...phoneData };
  } catch (error) {
    console.error('Error creating phone:', error);
    throw error;
  }
};

// Read all phones with timeout
export const getAllPhones = async () => {
  try {
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firebase request timeout')), 10000);
    });

    const dataPromise = getDocs(collection(db, COLLECTION_NAME));
    
    const querySnapshot = await Promise.race([dataPromise, timeoutPromise]);
    const phones = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      phones.push({ 
        id: doc.id, 
        ...data,
        // Convert Firestore timestamps to dates if needed
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
      });
    });
    
    return phones;
  } catch (error) {
    console.error('Error getting phones:', error);
    throw error;
  }
};

// Read a single phone by ID
export const getPhoneById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
      };
    } else {
      throw new Error('Phone not found');
    }
  } catch (error) {
    console.error('Error getting phone:', error);
    throw error;
  }
};

// Update a phone
export const updatePhone = async (id, phoneData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...phoneData,
      price: parseFloat(phoneData.price),
      updatedAt: serverTimestamp()
    });
    return { id, ...phoneData };
  } catch (error) {
    console.error('Error updating phone:', error);
    throw error;
  }
};

// Delete a phone
export const deletePhone = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Error deleting phone:', error);
    throw error;
  }
};