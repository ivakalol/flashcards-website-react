import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  deleteDoc, 
  writeBatch,
  count
} from 'firebase/firestore';
import { auth } from '../firebase/config';

// Collection reference
const DECKS_COLLECTION = 'decks';

// Storage operations with Firebase
export const firebaseStorage = {
  // Get deck by ID
  getById: async (deckId) => {
    const docRef = doc(db, DECKS_COLLECTION, deckId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error(`Deck with ID ${deckId} not found`);
    }
  },
  
  // Get all decks for current user
  getAll: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];
    
    const decksRef = collection(db, DECKS_COLLECTION);
    const q = query(decksRef, where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data());
  },
  
  // Get count of child decks for a parent
  getChildCount: async (parentId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return 0;
    
    const decksRef = collection(db, DECKS_COLLECTION);
    const q = query(
      decksRef,
      where("userId", "==", currentUser.uid),
      where("parentId", "==", parentId)
    );
    
    // Use Firestore count aggregation if available
    // For some environments, you may need to get all docs and count them
    try {
      const countSnapshot = await getDocs(q);
      return countSnapshot.size;
    } catch (error) {
      console.error("Error counting child decks:", error);
      return 0;
    }
  },
  
  // Save a deck
  save: async (deck) => {
    const deckRef = doc(db, DECKS_COLLECTION, deck.id);
    await setDoc(deckRef, deck);
    return deck;
  },
  
  // Delete a deck
  delete: async (deckId) => {
    await deleteDoc(doc(db, DECKS_COLLECTION, deckId));
  },
  
  // Delete multiple decks
  deleteBatch: async (deckIds) => {
    const batch = writeBatch(db);
    
    deckIds.forEach(deckId => {
      const deckRef = doc(db, DECKS_COLLECTION, deckId);
      batch.delete(deckRef);
    });
    
    await batch.commit();
  },
  
  // Save multiple decks (for batch operations)
  saveBatch: async (decks) => {
    const batch = writeBatch(db);
    
    decks.forEach(deck => {
      const deckRef = doc(db, DECKS_COLLECTION, deck.id);
      batch.set(deckRef, deck);
    });
    
    await batch.commit();
  }
};