// Constants
const STORAGE_KEY = 'flashcards_decks';

// Sample initial data with nested deck structure
const initialDecks = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Fundamental concepts of JavaScript programming',
    parentId: null, // Top-level deck
    color: '#ffcb91', // Default color (light orange)
    cards: [
      { id: '101', question: 'What is JavaScript?', answer: 'A programming language that enables interactive web pages' },
      { id: '102', question: 'What is a variable?', answer: 'A container that stores a value' }
    ]
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Core concepts of the React library',
    parentId: null, // Top-level deck
    color: '#a8dadc', // Default color (light blue)
    cards: [
      { id: '201', question: 'What is JSX?', answer: 'A syntax extension for JavaScript that looks similar to HTML' },
      { id: '202', question: 'What is a React component?', answer: 'A reusable piece of code that returns React elements describing what should appear on the screen' }
    ]
  }
];

// Utility functions for storage operations
const storage = {
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDecks));
    }
  },
  
  getAll: () => {
    storage.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  
  save: (decks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }
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
  return storage.getAll();
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
  const decks = await getDecks();
  return decks.find(deck => deck.id === deckId) || null;
};

// Create a new deck
export const createDeck = async (deckData, parentId = null) => {
  const decks = await getDecks();
  const newDeck = {
    ...deckData,
    id: deckUtils.generateId(),
    parentId: parentId,
    color: deckData.color || '#ffcb91', // Default color if not provided
    cards: []
  };
  
  storage.save([...decks, newDeck]);
  return newDeck;
};

// Add a card to a deck
export const addCardToDeck = async (deckId, cardData) => {
  const decks = await getDecks();
  const deckIndex = deckUtils.findDeckIndex(decks, deckId);
  
  const newCard = {
    ...cardData,
    id: deckUtils.generateId()
  };
  
  const updatedDeck = {
    ...decks[deckIndex],
    cards: [...decks[deckIndex].cards, newCard]
  };
  
  const updatedDecks = deckUtils.updateDeckInList(decks, deckIndex, updatedDeck);
  storage.save(updatedDecks);
  
  return updatedDeck;
};

// Update a deck
export const updateDeck = async (deckId, deckData) => {
  const decks = await getDecks();
  const deckIndex = deckUtils.findDeckIndex(decks, deckId);
  
  const updatedDeck = {
    ...decks[deckIndex],
    ...deckData,
    // Preserve these properties unless explicitly provided
    parentId: deckData.parentId !== undefined ? deckData.parentId : decks[deckIndex].parentId,
    cards: deckData.cards || decks[deckIndex].cards,
    color: deckData.color || decks[deckIndex].color, // Preserve color if not provided
    id: deckId // Ensure ID doesn't change
  };
  
  const updatedDecks = deckUtils.updateDeckInList(decks, deckIndex, updatedDeck);
  storage.save(updatedDecks);
  
  return updatedDeck;
};

// Delete a deck (and all child decks)
export const deleteDeck = async (deckId) => {
  const decks = await getDecks();
  
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
  
  // Filter out the decks to delete
  const updatedDecks = decks.filter(deck => !allDeckIdsToDelete.includes(deck.id));
  storage.save(updatedDecks);
};

// Delete a card from a deck
export const deleteCardFromDeck = async (deckId, cardId) => {
  const decks = await getDecks();
  const deckIndex = deckUtils.findDeckIndex(decks, deckId);
  
  const updatedDeck = {
    ...decks[deckIndex],
    cards: decks[deckIndex].cards.filter(card => card.id !== cardId)
  };
  
  const updatedDecks = deckUtils.updateDeckInList(decks, deckIndex, updatedDeck);
  storage.save(updatedDecks);
  
  return updatedDeck;
};

// Update a card in a deck
export const updateCardInDeck = async (deckId, cardId, cardData) => {
  const decks = await getDecks();
  const deckIndex = deckUtils.findDeckIndex(decks, deckId);
  const deck = decks[deckIndex];
  
  const cardIndex = deck.cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) {
    throw new Error(`Card with ID ${cardId} not found in deck ${deckId}`);
  }
  
  const updatedCards = [...deck.cards];
  updatedCards[cardIndex] = {
    ...updatedCards[cardIndex],
    question: cardData.question,
    answer: cardData.answer
  };
  
  const updatedDeck = {
    ...deck,
    cards: updatedCards
  };
  
  const updatedDecks = deckUtils.updateDeckInList(decks, deckIndex, updatedDeck);
  storage.save(updatedDecks);
  
  return updatedDeck;
};

// Get count of child decks for a parent deck
export const getChildDecksCount = async (parentId) => {
  const decks = await getDecks();
  return decks.filter(deck => deck.parentId === parentId).length;
};