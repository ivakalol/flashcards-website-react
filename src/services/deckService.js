// This service would interact with your backend if you have one.
// For now, we'll use localStorage to store deck data.

// Sample initial data
const initialDecks = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Fundamental concepts of JavaScript programming',
    cards: [
      { id: '101', question: 'What is JavaScript?', answer: 'A programming language that enables interactive web pages' },
      { id: '102', question: 'What is a variable?', answer: 'A container that stores a value' }
    ]
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Core concepts of the React library',
    cards: [
      { id: '201', question: 'What is JSX?', answer: 'A syntax extension for JavaScript that looks similar to HTML' },
      { id: '202', question: 'What is a React component?', answer: 'A reusable piece of code that returns React elements describing what should appear on the screen' }
    ]
  }
];

// Initialize localStorage with sample data if empty
const initializeDecks = () => {
  if (!localStorage.getItem('flashcards_decks')) {
    localStorage.setItem('flashcards_decks', JSON.stringify(initialDecks));
  }
};

// Get all decks
export const getDecks = async () => {
  initializeDecks();
  return JSON.parse(localStorage.getItem('flashcards_decks') || '[]');
};

// Get a specific deck by ID
export const getDeck = async (deckId) => {
  const decks = await getDecks();
  return decks.find(deck => deck.id === deckId) || null;
};

// Create a new deck
export const createDeck = async (deckData) => {
  const decks = await getDecks();
  const newDeck = {
    ...deckData,
    id: Date.now().toString(),
    cards: []
  };
  
  localStorage.setItem('flashcards_decks', JSON.stringify([...decks, newDeck]));
  return newDeck;
};

// Add a card to a deck
export const addCardToDeck = async (deckId, cardData) => {
  const decks = await getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) {
    throw new Error('Deck not found');
  }
  
  const newCard = {
    ...cardData,
    id: Date.now().toString()
  };
  
  const updatedDeck = {
    ...decks[deckIndex],
    cards: [...decks[deckIndex].cards, newCard]
  };
  
  const updatedDecks = [
    ...decks.slice(0, deckIndex),
    updatedDeck,
    ...decks.slice(deckIndex + 1)
  ];
  
  localStorage.setItem('flashcards_decks', JSON.stringify(updatedDecks));
  return updatedDeck;
};

// Update a deck
export const updateDeck = async (deckId, deckData) => {
  const decks = await getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) {
    throw new Error('Deck not found');
  }
  
  const updatedDeck = {
    ...decks[deckIndex],
    ...deckData
  };
  
  const updatedDecks = [
    ...decks.slice(0, deckIndex),
    updatedDeck,
    ...decks.slice(deckIndex + 1)
  ];
  
  localStorage.setItem('flashcards_decks', JSON.stringify(updatedDecks));
  return updatedDeck;
};

// Delete a deck
export const deleteDeck = async (deckId) => {
  const decks = await getDecks();
  const updatedDecks = decks.filter(deck => deck.id !== deckId);
  localStorage.setItem('flashcards_decks', JSON.stringify(updatedDecks));
};