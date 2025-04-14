import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import CardForm from '../components/CardForm';
import DeckList from '../components/DeckList';
import Breadcrumb from '../components/Breadcrumb';
import ColorSelector from '../components/ColorSelector';
import { 
  getDeck, 
  getDecksByParentId, 
  getDeckPath, 
  addCardToDeck, 
  deleteCardFromDeck, 
  updateCardInDeck, 
  deleteDeck, 
  createDeck, 
  updateDeck 
} from '../services/deckService';
import '../styles/DeckPage.css';

// Component for editing deck info
function DeckEditForm({ deck, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: deck?.title || '',
    description: deck?.description || '',
    color: deck?.color || '#ffcb91'
  });

  useEffect(() => {
    if (deck) {
      setFormData({
        title: deck.title || '',
        description: deck.description || '',
        color: deck.color || '#ffcb91'
      });
    }
  }, [deck]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Deck title is required');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="edit-deck-section">
      <h2>Edit Deck</h2>
      <form onSubmit={handleSubmit} className="edit-deck-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">Deck Color:</label>
          <ColorSelector 
            selectedColor={formData.color}
            onChange={handleColorChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-save">Save Changes</button>
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Component for adding a new nested deck
function AddDeckForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#ffcb91' // Default color
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Deck title is required');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="add-deck-section">
      <h2>Add Nested Deck</h2>
      <form onSubmit={handleSubmit} className="create-deck-form">
        <div className="form-group">
          <label htmlFor="deck-title">Deck Title:</label>
          <input
            type="text"
            id="deck-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deck-description">Description:</label>
          <textarea
            id="deck-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deck-color">Deck Color:</label>
          <ColorSelector 
            selectedColor={formData.color}
            onChange={handleColorChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-submit">Create Nested Deck</button>
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Deck header component
function DeckHeader({ deck, onEditClick }) {
  const folderStyle = {
    backgroundColor: deck.color || '#ffcb91'
  };

  return (
    <div className="deck-header folder-style" style={folderStyle}>
      <h1>
        <span className="folder-icon">📁</span>
        {deck.title}
      </h1>
      <button 
        className="btn-icon btn-edit-icon" 
        onClick={onEditClick}
        title="Edit deck"
      >
        ✎
      </button>
    </div>
  );
}

// Action buttons component
function DeckActionButtons({ 
  deckId, 
  activeForm, 
  setActiveForm, 
  hasEditingCard, 
  onDeleteDeck 
}) {
  const getButtonDisabled = (formType) => {
    return activeForm !== null && activeForm !== formType || hasEditingCard;
  };
  
  return (
    <div className="deck-actions">
      <Link to={`/study/${deckId}`} className="btn btn-primary">Study Deck</Link>
      <button 
        className="btn btn-secondary"
        onClick={() => activeForm === 'add-card' 
          ? setActiveForm(null) 
          : setActiveForm('add-card')}
        disabled={getButtonDisabled('add-card')}
      >
        {activeForm === 'add-card' ? 'Cancel' : 'Add Card'}
      </button>
      <button 
        className="btn btn-secondary"
        onClick={() => activeForm === 'add-deck' 
          ? setActiveForm(null) 
          : setActiveForm('add-deck')}
        disabled={getButtonDisabled('add-deck')}
      >
        {activeForm === 'add-deck' ? 'Cancel' : 'Add Nested Deck'}
      </button>
      <button 
        className="btn btn-delete"
        onClick={onDeleteDeck}
      >
        Delete Deck
      </button>
    </div>
  );
}

function DeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  
  // State for deck data
  const [deck, setDeck] = useState(null);
  const [childDecks, setChildDecks] = useState([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Add error state (was missing)
  const [error, setError] = useState(null);
  
  // State for form management
  const [activeForm, setActiveForm] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // Load deck data
  const loadDeck = async () => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state
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
      setError('Failed to load deck information');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and when deckId changes
  useEffect(() => {
    loadDeck();
    // Reset form states when deck changes
    setActiveForm(null);
    setEditingCard(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  // Card operations
  const handleAddCard = async (cardData) => {
    if (!cardData) return false;
    
    try {
      setError(null);
      const updatedDeck = await addCardToDeck(deckId, cardData);
      setDeck(updatedDeck);
      return true;
    } catch (error) {
      console.error('Failed to add card:', error);
      setError('Failed to add card');
      return false;
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setError(null);
      const updatedDeck = await deleteCardFromDeck(deckId, cardId);
      setDeck(updatedDeck);
      return true;
    } catch (error) {
      console.error('Failed to delete card:', error);
      setError('Failed to delete card');
      return false;
    }
  };
  
  const handleUpdateCard = async (updatedCardData) => {
    if (!updatedCardData) return false;
    
    try {
      setError(null);
      const updatedDeck = await updateCardInDeck(
        deckId, 
        updatedCardData.id, 
        updatedCardData
      );
      setDeck(updatedDeck);
      return true;
    } catch (error) {
      console.error('Failed to update card:', error);
      setError('Failed to update card');
      return false;
    }
  };
  
  // Deck operations
  const handleDeleteDeck = async () => {
    if (!window.confirm(`Are you sure you want to delete "${deck.title}" and all its contents? This action cannot be undone.`)) {
      return false;
    }
    
    try {
      setError(null);
      await deleteDeck(deckId);
      // Navigate to parent deck if available, otherwise to home
      if (deck.parentId) {
        navigate(`/deck/${deck.parentId}`);
      } else {
        navigate('/');
      }
      return true;
    } catch (error) {
      console.error('Failed to delete deck:', error);
      setError('Failed to delete deck');
      return false;
    }
  };
  
  const handleCreateNestedDeck = async (deckData) => {
    try {
      setError(null);
      await createDeck(deckData, deckId);
      await loadDeck(); // Reload to show new child deck
      return true;
    } catch (error) {
      console.error('Failed to create nested deck:', error);
      setError('Failed to create nested deck');
      return false;
    }
  };

  const handleUpdateDeckInfo = async (updatedData) => {
    try {
      setError(null);
      const updatedDeck = await updateDeck(deckId, updatedData);
      setDeck(updatedDeck);
      
      // Update breadcrumbs path with new title
      const updatedPath = breadcrumbPath.map(item => 
        item.id === deckId 
          ? { ...item, title: updatedData.title } 
          : item
      );
      setBreadcrumbPath(updatedPath);
      return true;
    } catch (error) {
      console.error('Failed to update deck:', error);
      setError('Failed to update deck. Please try again.');
      return false;
    }
  };
  
  // Form handlers
  const handleEditCard = (card) => {
    setEditingCard(card);
    setActiveForm(null);
  };
  
  const handleCardFormSubmit = async (cardData) => {
    if (!cardData) {
      setEditingCard(null);
      return;
    }
    
    let success;
    if (editingCard) {
      success = await handleUpdateCard({...cardData, id: editingCard.id});
    } else {
      success = await handleAddCard(cardData);
    }
    
    if (success) {
      setEditingCard(null);
      setActiveForm(null);
    }
  };
  
  const handleEditDeckSubmit = async (formData) => {
    const success = await handleUpdateDeckInfo(formData);
    if (success) {
      setActiveForm(null);
    }
  };
  
  const handleNewDeckSubmit = async (formData) => {
    const success = await handleCreateNestedDeck(formData);
    if (success) {
      setActiveForm(null);
    }
  };

  // Render loading and error states
  if (isLoading) {
    return <div className="loading">Loading deck...</div>;
  }

  if (!deck) {
    return <div className="error">Deck not found</div>;
  }

  // Main render
  return (
    <div className="deck-page">
      <Breadcrumb path={breadcrumbPath} />
      
      {error && <div className="error-message">{error}</div>}
      
      {activeForm === 'edit-deck' ? (
        <DeckEditForm 
          deck={deck}
          onSubmit={handleEditDeckSubmit}
          onCancel={() => setActiveForm(null)}
        />
      ) : (
        <DeckHeader 
          deck={deck}
          onEditClick={() => setActiveForm('edit-deck')}
        />
      )}
      
      {!activeForm && <p className="deck-description">{deck.description}</p>}
      
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
      
      <DeckActionButtons
        deckId={deckId}
        activeForm={activeForm}
        setActiveForm={setActiveForm}
        hasEditingCard={!!editingCard}
        onDeleteDeck={handleDeleteDeck}
      />

      {activeForm === 'add-card' && (
        <div className="add-card-section">
          <h2>Add New Card</h2>
          <CardForm 
            onSubmit={handleCardFormSubmit} 
            initialValues={{ question: '', answer: '' }}
          />
        </div>
      )}
      
      {activeForm === 'add-deck' && (
        <AddDeckForm
          onSubmit={handleNewDeckSubmit}
          onCancel={() => setActiveForm(null)}
        />
      )}
      
      {editingCard && (
        <div className="edit-card-section">
          <h2>Edit Card</h2>
          <CardForm 
            onSubmit={handleCardFormSubmit} 
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
            onDelete={loadDeck} 
            onUpdate={loadDeck}
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