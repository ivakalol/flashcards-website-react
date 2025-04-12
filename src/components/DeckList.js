import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DeckList.css';

function DeckList({ decks }) {
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default DeckList;