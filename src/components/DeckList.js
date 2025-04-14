import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateDeck, deleteDeck, getChildDecksCount } from '../services/deckService';
import ColorSelector from './ColorSelector';
import '../styles/DeckList.css';

const DeckList = ({ decks, isLoading = false, onDelete, onUpdate }) => {
  const [editingDeck, setEditingDeck] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    color: ''
  });
  const [deckStats, setDeckStats] = useState({});

  // Load child deck counts for each deck
  useEffect(() => {
    const loadChildCounts = async () => {
      const statsPromises = decks.map(async (deck) => {
        const childCount = await getChildDecksCount(deck.id);
        return { [deck.id]: childCount };
      });

      const statsResults = await Promise.all(statsPromises);
      const combinedStats = statsResults.reduce((acc, stat) => ({...acc, ...stat}), {});
      setDeckStats(combinedStats);
    };

    if (decks.length > 0) {
      loadChildCounts();
    }
  }, [decks]);

  // Handle delete button click
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

  // Handle edit button click
  const handleEditClick = (deck, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setEditingDeck(deck);
    setEditFormData({
      title: deck.title || '',
      description: deck.description || '',
      color: deck.color || '#ffcb91' // Default if color not set
    });
  };

  // Handle input changes in edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Handle color selection
  const handleColorChange = (color) => {
    setEditFormData({
      ...editFormData,
      color: color
    });
  };

  // Handle form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.title.trim()) {
      alert('Deck title is required');
      return;
    }
    
    try {
      // Update the deck
      await updateDeck(editingDeck.id, {
        title: editFormData.title,
        description: editFormData.description,
        color: editFormData.color
      });
      
      // Notify parent component to refresh
      if (onUpdate) {
        onUpdate();
      } else if (onDelete) {
        // Fall back to onDelete if onUpdate isn't provided
        onDelete();
      }
      
      // Close the edit form
      setEditingDeck(null);
    } catch (error) {
      console.error('Failed to update deck:', error);
      alert('Failed to update deck. Please try again.');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingDeck(null);
  };

  if (isLoading && decks.length > 0) {
    return <div className="loading-counts">Loading deck information...</div>;
  }

  return (
    <div className="deck-list">
      {decks.map(deck => (
        <div 
          key={deck.id} 
          className="deck-card"
          style={{ backgroundColor: deck.color || '#ffcb91' }}
        >
          {editingDeck && editingDeck.id === deck.id ? (
            <div className="deck-edit-form">
              <form onSubmit={handleEditFormSubmit}>
                <div className="form-group">
                  <label htmlFor={`title-${deck.id}`}>Title:</label>
                  <input
                    type="text"
                    id={`title-${deck.id}`}
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`description-${deck.id}`}>Description:</label>
                  <textarea
                    id={`description-${deck.id}`}
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`color-${deck.id}`}>Deck Color:</label>
                  <ColorSelector 
                    selectedColor={editFormData.color}
                    onChange={handleColorChange}
                  />
                </div>
                <div className="deck-edit-actions">
                  <button type="submit" className="btn btn-save">Save</button>
                  <button 
                    type="button" 
                    className="btn btn-cancel"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="deck-content">
              <h3>{deck.title}</h3>
              <p>{deck.description}</p>
              <div className="deck-stats">
                <span className="stat-item">
                  <i className="stat-icon card-icon">📝</i> {deck.cards.length} cards
                </span>
                <span className="stat-item">
                  <i className="stat-icon folder-icon">📁</i> {deckStats[deck.id] || 0} nested decks
                </span>
              </div>
              <div className="deck-actions">
                <Link 
                  to={`/deck/${deck.id}`} 
                  className="btn btn-primary"
                >
                  View
                </Link>
                <button 
                  className="btn btn-edit"
                  onClick={(e) => handleEditClick(deck, e)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={(e) => handleDeleteDeck(deck.id, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeckList;