import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import CardForm from '../components/CardForm';
import { getDeck, addCardToDeck, deleteCardFromDeck, updateCardInDeck, deleteDeck } from '../services/deckService';
import '../styles/DeckPage.css';

function DeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const loadDeck = async () => {
    try {
      const deckData = await getDeck(deckId);
      if (!deckData) {
        navigate('/'); // Redirect if deck not found
        return;
      }
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
    if (!cardData) {
      setShowAddForm(false);
      return;
    }
    
    try {
      console.log("Adding card:", cardData); // Debug log
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
  
  const handleEditCard = (card) => {
    console.log("Edit card clicked:", card); // Debug log
    setEditingCard(card);
    setShowAddForm(false); // Close add form if open
  };
  
  const handleUpdateCard = async (updatedCardData) => {
    if (!updatedCardData) {
      // Cancel was clicked
      setEditingCard(null);
      return;
    }
    
    try {
      console.log("Updating card:", updatedCardData); // Debug log
      const updatedDeck = await updateCardInDeck(deckId, updatedCardData.id, updatedCardData);
      setDeck(updatedDeck);
      setEditingCard(null);
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };
  
  const handleDeleteDeck = async () => {
    if (window.confirm('Are you sure you want to delete this entire deck? This action cannot be undone.')) {
      try {
        await deleteDeck(deckId);
        navigate('/'); // Redirect to home page after deletion
      } catch (error) {
        console.error('Failed to delete deck:', error);
      }
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (editingCard) {
      setEditingCard(null);
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
          onClick={toggleAddForm}
          disabled={!!editingCard}
        >
          {showAddForm ? 'Cancel' : 'Add Card'}
        </button>
        <button 
          className="btn btn-delete"
          onClick={handleDeleteDeck}
        >
          Delete Deck
        </button>
      </div>

      {showAddForm && !editingCard && (
        <div className="add-card-section">
          <h2>Add New Card</h2>
          <CardForm 
            onSubmit={handleAddCard} 
            initialValues={{ question: '', answer: '' }}
          />
        </div>
      )}
      
      {editingCard && (
        <div className="edit-card-section">
          <h2>Edit Card</h2>
          <CardForm 
            onSubmit={handleUpdateCard} 
            initialValues={editingCard} 
            isEditing={true} 
          />
        </div>
      )}

      <h2>Cards in this Deck</h2>
      {deck.cards.length > 0 ? (
        <div className="flashcards-grid">
          {deck.cards.map((card) => (
            <Flashcard 
              key={card.id} 
              card={card} 
              onDelete={handleDeleteCard}
              onEdit={handleEditCard}
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