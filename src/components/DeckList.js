import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteDeck, getChildDecksCount } from '../services/deckService';
import '../styles/DeckList.css';

function DeckList({ decks, onDelete }) {
  // State to track child deck counts
  const [deckCounts, setDeckCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Load child deck counts when deck list changes
  useEffect(() => {
    const loadChildCounts = async () => {
      const counts = {};
      
      for (const deck of decks) {
        counts[deck.id] = await getChildDecksCount(deck.id);
      }
      
      setDeckCounts(counts);
      setIsLoading(false);
    };
    
    if (decks.length > 0) {
      loadChildCounts();
    } else {
      setIsLoading(false);
    }
  }, [decks]);

  // Handle deletion and refresh the decks list
  const handleDeleteDeck = async (deckId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this deck and all its contents? This cannot be undone.')) {
      await deleteDeck(deckId);
      if (onDelete) {
        onDelete(); // Callback to trigger a refresh of decks from parent component
      }
    }
  };

  if (isLoading && decks.length > 0) {
    return <div className="loading-counts">Loading deck information...</div>;
  }

  return (
    <div className="deck-list">
      {decks.map(deck => (
        <div key={deck.id} className="deck-card">
          <h3>{deck.title}</h3>
          <p>{deck.description}</p>
          <div className="deck-stats">
            <span className="stat-item">
              <i className="stat-icon card-icon">📝</i> {deck.cards.length} cards
            </span>
            <span className="stat-item">
              <i className="stat-icon folder-icon">📁</i> {deckCounts[deck.id] || 0} nested decks
            </span>
          </div>
          <div className="deck-actions">
            <Link to={`/deck/${deck.id}`} className="btn btn-view">View</Link>
            <Link to={`/study/${deck.id}`} className="btn btn-study">Study</Link>
            <button 
              className="btn btn-delete"
              onClick={(e) => handleDeleteDeck(deck.id, e)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DeckList;