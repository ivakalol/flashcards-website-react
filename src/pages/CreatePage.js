import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeck } from '../services/deckService';
import '../styles/CreatePage.css';

function CreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const newDeck = await createDeck({ title, description });
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
      <h1>Create New Flashcard Deck</h1>
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
            required
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
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePage;