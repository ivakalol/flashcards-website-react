import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import CardForm from '../components/CardForm';
import DeckList from '../components/DeckList';
import Breadcrumb from '../components/Breadcrumb';
import { getDeck, getDecksByParentId, getDeckPath, addCardToDeck, deleteCardFromDeck, updateCardInDeck, deleteDeck, createDeck, updateDeck } from '../services/deckService';
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
  const [editingDeck, setEditingDeck] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [editDeckData, setEditDeckData] = useState({
    title: '',
    description: ''
  });

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

  // Initialize edit form values when deck data is loaded
  useEffect(() => {
    if (deck) {
      setEditDeckData({
        title: deck.title || '',
        description: deck.description || ''
      });
    }
  }, [deck]);

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
    setEditingDeck(false);
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

  const handleChildDeckUpdated = () => {
    loadDeck(); // Reload child decks after update
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

  // Handle edit deck button click
  const toggleEditDeck = () => {
    setEditingDeck(!editingDeck);
    if (showAddForm) setShowAddForm(false);
    if (showAddDeckForm) setShowAddDeckForm(false);
    if (editingCard) setEditingCard(null);
  };

  // Handle edit deck form changes
  const handleEditDeckChange = (e) => {
    const { name, value } = e.target;
    setEditDeckData({
      ...editDeckData,
      [name]: value
    });
  };

  // Handle edit deck form submission
  const handleEditDeckSubmit = async (e) => {
    e.preventDefault();
    
    if (!editDeckData.title.trim()) {
      alert('Deck title is required');
      return;
    }
    
    try {
      const updatedDeck = await updateDeck(deckId, {
        title: editDeckData.title,
        description: editDeckData.description
      });
      
      setDeck(updatedDeck);
      setEditingDeck(false);
      
      // Update breadcrumbs path with new title
      const updatedPath = breadcrumbPath.map(item => 
        item.id === deckId 
          ? { ...item, title: editDeckData.title } 
          : item
      );
      setBreadcrumbPath(updatedPath);
    } catch (error) {
      console.error('Failed to update deck:', error);
      alert('Failed to update deck. Please try again.');
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (editingCard) setEditingCard(null);
    if (showAddDeckForm) setShowAddDeckForm(false);
    if (editingDeck) setEditingDeck(false);
  };
  
  const toggleAddDeckForm = () => {
    setShowAddDeckForm(!showAddDeckForm);
    if (showAddForm) setShowAddForm(false);
    if (editingCard) setEditingCard(null);
    if (editingDeck) setEditingDeck(false);
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
      
      {editingDeck ? (
        <div className="edit-deck-section">
          <h2>Edit Deck</h2>
          <form onSubmit={handleEditDeckSubmit} className="edit-deck-form">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editDeckData.title}
                onChange={handleEditDeckChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={editDeckData.description}
                onChange={handleEditDeckChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-save">Save Changes</button>
              <button 
                type="button" 
                className="btn btn-cancel"
                onClick={toggleEditDeck}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="deck-header">
          <h1>{deck.title}</h1>
          <button 
            className="btn-icon btn-edit-icon" 
            onClick={toggleEditDeck}
            title="Edit deck"
          >
            ✎
          </button>
        </div>
      )}
      
      {!editingDeck && <p className="deck-description">{deck.description}</p>}
      
      <div className="deck-info">
        <div className="deck-stats">
          <span className="stat-item">
            <i className="stat-icon card-icon">📝</i> {deck.cards.length} cards
          </span>
          <span className="stat-item">
            <i className="stat-icon folder-icon">📁</i> {childDecks.length} nested decks
          </span>
        </div>
      </div>
      
      <div className="deck-actions">
        <Link to={`/study/${deckId}`} className="btn btn-primary">Study Deck</Link>
        <button 
          className="btn btn-secondary"
          onClick={toggleAddForm}
          disabled={!!editingCard || showAddDeckForm || editingDeck}
        >
          {showAddForm ? 'Cancel' : 'Add Card'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={toggleAddDeckForm}
          disabled={!!editingCard || showAddForm || editingDeck}
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
          <DeckList 
            decks={childDecks} 
            onDelete={handleChildDeckDeleted} 
            onUpdate={handleChildDeckUpdated}
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