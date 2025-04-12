import React, { useState, useEffect } from 'react';
import DeckList from '../components/DeckList';
import { getDecks } from '../services/deckService';
import '../styles/HomePage.css';

function HomePage() {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDecks = async () => {
      try {
        const decksData = await getDecks();
        setDecks(decksData);
      } catch (error) {
        console.error('Failed to load decks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDecks();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading decks...</div>;
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to Flashcards</h1>
        <p>Boost your learning with our interactive flashcards!</p>
      </section>
      
      <section className="decks-section">
        <h2>Your Flashcard Decks</h2>
        {decks.length > 0 ? (
          <DeckList decks={decks} />
        ) : (
          <p>No decks found. Start by creating a new deck!</p>
        )}
      </section>
    </div>
  );
}

export default HomePage;