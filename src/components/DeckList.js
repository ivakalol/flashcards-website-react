import React from 'react';
import { Link } from 'react-router-dom';
import { deleteDeck } from '../services/deckService';
import '../styles/DeckList.css';

function DeckList({ decks, onDelete }) {
  // Handle deletion and refresh the decks list
  const handleDeleteDeck = async (deckId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this deck? This cannot be undone.')) {
      await deleteDeck(deckId);
      if (onDelete) {
        onDelete(); // Callback to trigger a refresh of decks from parent component
      }
    }
  };

  return (
    <div className="deck-list">
      {decks.map(deck => (
        <div key={deck.id} className="deck-card">
          <h3>{deck.title}</h3>
          <p>{deck.description}</p>
          <p>{deck.cards.length} cards</p>
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