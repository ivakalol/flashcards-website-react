import { firebaseStorage } from './firebaseService.js';
import { getCurrentUser } from './authService.js';

// Constants
const DEFAULT_COLORS = {
  DEFAULT: '#ffcb91', // Default folder color
  SECONDARY: '#a8dadc' // Secondary default color
};

// Utility functions for deck operations
const deckUtils = {
  findDeckIndex: (decks, deckId) => {
    const index = decks.findIndex(deck => deck.id === deckId);
    if (index === -1) {
      throw new Error(`Deck with ID ${deckId} not found`);
    }
    return index;
  },
  
  updateDeckInList: (decks, deckIndex, updatedDeck) => [
    ...decks.slice(0, deckIndex),
    updatedDeck,
    ...decks.slice(deckIndex + 1)
  ],
  
  generateId: () => Date.now().toString()
};

// Get all decks
export const getDecks = async () => {
  return firebaseStorage.getAll();
};

// Get decks by parent ID (null for top-level decks)
export const getDecksByParentId = async (parentId = null) => {
  const decks = await getDecks();
  return decks.filter(deck => deck.parentId === parentId);
};

// Get parent deck path (breadcrumbs data)
export const getDeckPath = async (deckId) => {
  const decks = await getDecks();
  const path = [];
  
  let currentDeckId = deckId;
  while (currentDeckId) {
    const currentDeck = decks.find(deck => deck.id === currentDeckId);
    if (!currentDeck) break;
    
    path.unshift({
      id: currentDeck.id,
      title: currentDeck.title
    });
    
    currentDeckId = currentDeck.parentId;
  }
  
  return path;
};

// Get a specific deck by ID
export const getDeck = async (deckId) => {
  try {
    // First try to get a specific deck directly from Firestore
    const deck = await firebaseStorage.getById(deckId);
    return deck;
  } catch (error) {
    console.error("Error getting deck directly:", error);
    
    // Fall back to getting all decks and filtering
    const decks = await getDecks();
    return decks.find(deck => deck.id === deckId) || null;
  }
};

// Create a new deck
export const createDeck = async (deckData, parentId = null) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User must be logged in to create a deck');
  
  const newDeck = {
    ...deckData,
    id: deckUtils.generateId(),
    parentId: parentId,
    color: deckData.color || DEFAULT_COLORS.DEFAULT,
    userId: currentUser.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: []
  };
  
  await firebaseStorage.save(newDeck);
  return newDeck;
};

// Add a card to a deck
export const addCardToDeck = async (deckId, cardData) => {
  const deck = await getDeck(deckId);
  if (!deck) throw new Error(`Deck with ID ${deckId} not found`);
  
  // Verify ownership
  const currentUser = getCurrentUser();
  if (!currentUser || deck.userId !== currentUser.uid) {
    throw new Error('You do not have permission to modify this deck');
  }
  
  const newCard = {
    ...cardData,
    id: deckUtils.generateId(),
    createdAt: new Date().toISOString()
  };
  
  const updatedDeck = {
    ...deck,
    cards: [...deck.cards, newCard],
    updatedAt: new Date().toISOString()
  };
  
  await firebaseStorage.save(updatedDeck);
  return updatedDeck;
};

// Update a deck
export const updateDeck = async (deckId, deckData) => {
  const deck = await getDeck(deckId);
  if (!deck) throw new Error(`Deck with ID ${deckId} not found`);
  
  // Verify ownership
  const currentUser = getCurrentUser();
  if (!currentUser || deck.userId !== currentUser.uid) {
    throw new Error('You do not have permission to modify this deck');
  }
  
  const updatedDeck = {
    ...deck,
    ...deckData,
    // Preserve these properties unless explicitly provided
    parentId: deckData.parentId !== undefined ? deckData.parentId : deck.parentId,
    cards: deckData.cards || deck.cards,
    color: deckData.color || deck.color,
    userId: deck.userId, // Never change the owner
    id: deckId, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  await firebaseStorage.save(updatedDeck);
  return updatedDeck;
};

// Delete a deck (and all child decks)
export const deleteDeck = async (deckId) => {
  const decks = await getDecks();
  const deckToDelete = decks.find(d => d.id === deckId);
  
  if (!deckToDelete) {
    throw new Error(`Deck with ID ${deckId} not found`);
  }
  
  // Verify ownership
  const currentUser = getCurrentUser();
  if (!currentUser || deckToDelete.userId !== currentUser.uid) {
    throw new Error('You do not have permission to delete this deck');
  }
  
  // Find all child deck IDs (recursive)
  const findChildDeckIds = (parentId) => {
    const childDecks = decks.filter(deck => deck.parentId === parentId);
    let allChildIds = childDecks.map(deck => deck.id);
    
    // Recursively find children of children
    for (const childDeck of childDecks) {
      const grandchildIds = findChildDeckIds(childDeck.id);
      allChildIds = [...allChildIds, ...grandchildIds];
    }
    
    return allChildIds;
  };
  
  // Get all deck IDs to delete (including children)
  const childDeckIds = findChildDeckIds(deckId);
  const allDeckIdsToDelete = [deckId, ...childDeckIds];
  
  // Delete all decks at once using a batch operation
  try {
    await firebaseStorage.deleteBatch(allDeckIdsToDelete);
  } catch (error) {
    console.error('Error deleting decks:', error);
    throw new Error('Failed to delete deck and its children. Please try again.');
  }
};

// Delete a card from a deck
export const deleteCardFromDeck = async (deckId, cardId) => {
  const deck = await getDeck(deckId);
  if (!deck) throw new Error(`Deck with ID ${deckId} not found`);
  
  // Verify ownership
  const currentUser = getCurrentUser();
  if (!currentUser || deck.userId !== currentUser.uid) {
    throw new Error('You do not have permission to modify this deck');
  }
  
  const updatedDeck = {
    ...deck,
    cards: deck.cards.filter(card => card.id !== cardId),
    updatedAt: new Date().toISOString()
  };
  
  await firebaseStorage.save(updatedDeck);
  return updatedDeck;
};

// Update a card in a deck
export const updateCardInDeck = async (deckId, cardId, cardData) => {
  const deck = await getDeck(deckId);
  if (!deck) throw new Error(`Deck with ID ${deckId} not found`);
  
  // Verify ownership
  const currentUser = getCurrentUser();
  if (!currentUser || deck.userId !== currentUser.uid) {
    throw new Error('You do not have permission to modify this deck');
  }
  
  const cardIndex = deck.cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) {
    throw new Error(`Card with ID ${cardId} not found in deck ${deckId}`);
  }
  
  const updatedCards = [...deck.cards];
  updatedCards[cardIndex] = {
    ...updatedCards[cardIndex],
    question: cardData.question,
    answer: cardData.answer,
    updatedAt: new Date().toISOString()
  };
  
  const updatedDeck = {
    ...deck,
    cards: updatedCards,
    updatedAt: new Date().toISOString()
  };
  
  await firebaseStorage.save(updatedDeck);
  return updatedDeck;
};

// Get count of child decks for a parent deck
export const getChildDecksCount = async (parentId) => {
  try {
    // Try to get count directly from Firestore (more efficient)
    const count = await firebaseStorage.getChildCount(parentId);
    return count;
  } catch (error) {
    console.error("Error getting child count directly:", error);
    
    // Fall back to getting all decks and counting
    const decks = await getDecks();
    return decks.filter(deck => deck.parentId === parentId).length;
  }
};

// Data migration - one-time function to migrate data from localStorage to Firestore
export const migrateFromLocalStorage = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User must be logged in to migrate data');
  
  // Get decks from localStorage
  const STORAGE_KEY = 'flashcards_decks';
  let localDecks = [];
  
  try {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      localDecks = JSON.parse(localData);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    throw new Error('Failed to read local data');
  }
  
  if (localDecks.length === 0) {
    console.log('No local data to migrate');
    return { migrated: 0 };
  }
  
  // Add user ID and timestamps to all decks
  const timestamp = new Date().toISOString();
  const preparedDecks = localDecks.map(deck => ({
    ...deck,
    userId: currentUser.uid,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
  
  // Save all decks to Firestore
  try {
    await firebaseStorage.saveBatch(preparedDecks);
    
    // Clear localStorage after successful migration
    localStorage.removeItem(STORAGE_KEY);
    
    return { 
      migrated: preparedDecks.length,
      success: true
    };
  } catch (error) {
    console.error('Error migrating to Firestore:', error);
    throw new Error('Failed to migrate data to cloud storage');
  }
};

// Backup all user decks to a downloadable JSON file
export const backupDecks = async () => {
  const decks = await getDecks();
  
  const dataStr = JSON.stringify(decks, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileName = `flashcards_backup_${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();
  
  return { success: true, count: decks.length };
};

// Restore decks from a backup file
export const restoreDecks = async (backupData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User must be logged in to restore data');
  
  try {
    let decksToRestore = [];
    
    if (typeof backupData === 'string') {
      decksToRestore = JSON.parse(backupData);
    } else {
      decksToRestore = backupData;
    }
    
    // Ensure all decks have user ID and timestamps
    const timestamp = new Date().toISOString();
    const preparedDecks = decksToRestore.map(deck => ({
      ...deck,
      userId: currentUser.uid, // Assign to current user
      updatedAt: timestamp
    }));
    
    // Save all decks to Firestore
    await firebaseStorage.saveBatch(preparedDecks);
    
    return { 
      restored: preparedDecks.length,
      success: true
    };
  } catch (error) {
    console.error('Error restoring data:', error);
    throw new Error('Failed to restore backup data');
  }
};