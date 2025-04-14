import React, { useState, useEffect } from 'react';
import DeckList from '../components/DeckList';
import { getDecksByParentId } from '../services/deckService';
import '../styles/HomePage.css';

// Custom hook to handle deck data fetching
function useDecks() {
  const [decks, setDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDecks = async () => {
    setIsLoading(true);
    try {
      // Get only top-level decks (parentId = null)
      const decksData = await getDecksByParentId(null);
      setDecks(decksData);
      setError(null);
    } catch (error) {
      console.error('Failed to load decks:', error);
      setError('Failed to load decks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return { decks, isLoading, error, loadDecks };
}

// Loading state component
const LoadingState = () => (
  <div className="loading">Loading decks...</div>
);

// Error state component
const ErrorState = ({ message }) => (
  <div className="error">{message}</div>
);

// Empty state component
const EmptyState = () => (
  <p>No decks found. Start by creating a new deck!</p>
);

function HomePage() {
  const { decks, isLoading, error, loadDecks } = useDecks();

  useEffect(() => {
    loadDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function will be called after a deck is deleted or updated
  const handleDeckChanged = () => {
    loadDecks();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
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
          <EmptyState />
        )}
      </section>
    </div>
  );
}

export default HomePage;