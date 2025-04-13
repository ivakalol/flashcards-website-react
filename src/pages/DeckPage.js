import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import CardForm from '../components/CardForm';
import DeckList from '../components/DeckList';
import Breadcrumb from '../components/Breadcrumb';
import { getDeck, getDecksByParentId, getDeckPath, addCardToDeck, deleteCardFromDeck, updateCardInDeck, deleteDeck, createDeck } from '../services/deckService';
import '../styles/DeckPage.css';

function DeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [childDecks, setChildDecks] = useState([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddDeckForm, setShowAddDeckForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  const loadDeck = async () => {
    try {
      // Get the current deck
      const deckData = await getDeck(deckId);
      if (!deckData) {
        navigate('/');
        return;
      }
      setDeck(deckData);
      
      // Get child decks
      const children = await getDecksByParentId(deckId);
      setChildDecks(children);
      
      // Get the path for breadcrumbs
      const path = await getDeckPath(deckId);
      setBreadcrumbPath(path);
    } catch (error) {
      console.error('Failed to load deck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeck();
  }, [deckId, navigate]);

  const handleAddCard = async (cardData) => {
    if (!cardData) {
      setShowAddForm(false);
      return;
    }
    
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
  
  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowAddForm(false);
    setShowAddDeckForm(false);
  };
  
  const handleUpdateCard = async (updatedCardData) => {
    if (!updatedCardData) {
      setEditingCard(null);
      return;
    }
    
    try {
      const updatedDeck = await updateCardInDeck(deckId, updatedCardData.id, updatedCardData);
      setDeck(updatedDeck);
      setEditingCard(null);
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };
  
  const handleDeleteDeck = async () => {
    if (window.confirm(`Are you sure you want to delete "${deck.title}" and all its contents? This action cannot be undone.`)) {
      try {
        await deleteDeck(deckId);
        // Navigate to parent deck if available, otherwise to home
        if (deck.parentId) {
          navigate(`/deck/${deck.parentId}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to delete deck:', error);
      }
    }
  };
  
  const handleChildDeckDeleted = () => {
    loadDeck(); // Reload child decks
  };
  
  const handleCreateNestedDeck = async (e) => {
    e.preventDefault();
    
    if (!newDeckTitle.trim()) {
      alert('Deck title is required');
      return;
    }
    
    try {
      await createDeck({
        title: newDeckTitle,
        description: newDeckDescription
      }, deckId); // Pass current deck ID as parent
      
      setNewDeckTitle('');
      setNewDeckDescription('');
      setShowAddDeckForm(false);
      loadDeck(); // Reload to show new child deck
    } catch (error) {
      console.error('Failed to create nested deck:', error);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (editingCard) setEditingCard(null);
    if (showAddDeckForm) setShowAddDeckForm(false);
  };
  
  const toggleAddDeckForm = () => {
    setShowAddDeckForm(!showAddDeckForm);
    if (showAddForm) setShowAddForm(false);
    if (editingCard) setEditingCard(null);
  };

  if (isLoading) {
    return <div className="loading">Loading deck...</div>;
  }

  if (!deck) {
    return <div className="error">Deck not found</div>;
  }

  return (
    <div className="deck-page">
      <Breadcrumb path={breadcrumbPath} />
      
      <h1>{deck.title}</h1>
      <p className="deck-description">{deck.description}</p>
      
      <div className="deck-actions">
        <Link to={`/study/${deckId}`} className="btn btn-primary">Study Deck</Link>
        <button 
          className="btn btn-secondary"
          onClick={toggleAddForm}
          disabled={!!editingCard || showAddDeckForm}
        >
          {showAddForm ? 'Cancel' : 'Add Card'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={toggleAddDeckForm}
          disabled={!!editingCard || showAddForm}
        >
          {showAddDeckForm ? 'Cancel' : 'Add Nested Deck'}
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
      
      {showAddDeckForm && (
        <div className="add-deck-section">
          <h2>Add Nested Deck</h2>
          <form onSubmit={handleCreateNestedDeck} className="create-deck-form">
            <div className="form-group">
              <label htmlFor="title">Deck Title:</label>
              <input
                type="text"
                id="title"
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-submit">Create Nested Deck</button>
          </form>
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
      
      {childDecks.length > 0 && (
        <div className="child-decks-section">
          <h2>Nested Decks</h2>
          <DeckList decks={childDecks} onDelete={handleChildDeckDeleted} />
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