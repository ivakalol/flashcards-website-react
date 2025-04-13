import React, { useState, useEffect } from 'react';
import DeckList from '../components/DeckList';
import { getDecksByParentId } from '../services/deckService';
import '../styles/HomePage.css';

function HomePage() {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDecks = async () => {
    try {
      // Get only top-level decks (parentId = null)
      const decksData = await getDecksByParentId(null);
      setDecks(decksData);
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  // This function will be called after a deck is deleted or updated
  const handleDeckChanged = () => {
    loadDecks();
  };

  if (isLoading) {
    return <div className="loading">Loading decks...</div>;
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to Schatz Cards</h1>
        <p>The perfect website for the perfect person</p>
      </section>
      
      <section className="decks-section">
        <h2>Your Flashcard Decks</h2>
        {decks.length > 0 ? (
          <DeckList 
            decks={decks} 
            onDelete={handleDeckChanged}
            onUpdate={handleDeckChanged}
          />
        ) : (
          <p>No decks found. Start by creating a new deck!</p>
        )}
      </section>
    </div>
  );
}

export default HomePage;