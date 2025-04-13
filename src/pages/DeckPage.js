import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import CardForm from '../components/CardForm';
import { getDeck, addCardToDeck, deleteCardFromDeck } from '../services/deckService';
import '../styles/DeckPage.css';

function DeckPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadDeck = async () => {
    try {
      const deckData = await getDeck(deckId);
      setDeck(deckData);
    } catch (error) {
      console.error('Failed to load deck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  const handleAddCard = async (cardData) => {
    try {
      const updatedDeck = await addCardToDeck(deckId, cardData);
      setDeck(updatedDeck);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const updatedDeck = await deleteCardFromDeck(deckId, cardId);
      setDeck(updatedDeck);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading deck...</div>;
  }

  if (!deck) {
    return <div className="error">Deck not found</div>;
  }

  return (
    <div className="deck-page">
      <h1>{deck.title}</h1>
      <p className="deck-description">{deck.description}</p>
      
      <div className="deck-actions">
        <Link to={`/study/${deckId}`} className="btn btn-primary">Study Deck</Link>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Card'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-card-section">
          <h2>Add New Card</h2>
          <CardForm onSubmit={handleAddCard} />
        </div>
      )}

      <h2>Cards in this Deck</h2>
      {deck.cards.length > 0 ? (
        <div className="flashcards-grid">
          {deck.cards.map((card, index) => (
            <Flashcard 
              key={card.id || index} 
              card={card} 
              onDelete={handleDeleteCard} 
            />
          ))}
        </div>
      ) : (
        <p>No cards in this deck yet. Add some cards to start studying!</p>
      )}
    </div>
  );
}

export default DeckPage;