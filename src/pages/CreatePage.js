import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createDeck, getDeck } from '../services/deckService';
import Breadcrumb from '../components/Breadcrumb';
import ColorSelector, { colorOptions } from '../components/ColorSelector';
import '../styles/CreatePage.css';

// Component to show parent deck information
const ParentDeckInfo = ({ parentDeck }) => (
  <>
    <Breadcrumb path={[{ id: parentDeck.id, title: parentDeck.title }]} />
    <p className="parent-deck-info">
      Creating a deck inside: <strong>{parentDeck.title}</strong>
    </p>
  </>
);

function CreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: colorOptions[5].value // Default to folder color
  });
  
  // UI state
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [parentDeck, setParentDeck] = useState(null);

  // Load parent deck info if parentId is provided
  useEffect(() => {
    if (parentId) {
      const loadParentDeck = async () => {
        try {
          const deck = await getDeck(parentId);
          if (!deck) {
            // Handle case when parent deck doesn't exist
            setError('Parent deck not found');
            return;
          }
          setParentDeck(deck);
        } catch (error) {
          console.error('Error loading parent deck:', error);
          setError('Failed to load parent deck information');
        }
      };
      
      loadParentDeck();
    }
  }, [parentId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle color selection
  const handleColorChange = (color) => {
    setFormData({
      ...formData,
      color: color
    });
  };

  // Navigate back to appropriate location
  const handleCancel = () => {
    if (parentDeck) {
      navigate(`/deck/${parentId}`);
    } else {
      navigate('/');
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!formData.title.trim()) {
      setError('Deck title is required');
      return;
    }
    
    setIsCreating(true);
    setError('');

    try {
      const newDeck = await createDeck({
        title: formData.title,
        description: formData.description,
        color: formData.color
      }, parentId);
      
      navigate(`/deck/${newDeck.id}`);
    } catch (error) {
      console.error('Failed to create deck:', error);
      setError('Failed to create deck. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-page">
      {parentDeck && <ParentDeckInfo parentDeck={parentDeck} />}
      
      <h1>{parentDeck ? 'Create Nested Deck' : 'Create New Flashcard Deck'}</h1>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      
      <form className="create-deck-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Deck Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            autoFocus
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Deck'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;