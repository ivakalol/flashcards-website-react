import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createDeck, getDeck } from '../services/deckService';
import Breadcrumb from '../components/Breadcrumb';
import '../styles/CreatePage.css';

function CreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [parentDeck, setParentDeck] = useState(null);

  useEffect(() => {
    // If parentId is provided, load parent deck info for breadcrumbs
    if (parentId) {
      const loadParentDeck = async () => {
        try {
          const deck = await getDeck(parentId);
          setParentDeck(deck);
        } catch (error) {
          console.error('Error loading parent deck:', error);
        }
      };
      
      loadParentDeck();
    }
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const newDeck = await createDeck({ title, description }, parentId);
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
      {parentDeck && (
        <Breadcrumb path={[{ id: parentDeck.id, title: parentDeck.title }]} />
      )}
      
      <h1>{parentDeck ? 'Create Nested Deck' : 'Create New Flashcard Deck'}</h1>
      {parentDeck && (
        <p className="parent-deck-info">Creating a deck inside: <strong>{parentDeck.title}</strong></p>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="create-deck-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Deck Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            onClick={() => parentDeck ? navigate(`/deck/${parentId}`) : navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;