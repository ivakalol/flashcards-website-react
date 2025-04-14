import React, { useState } from 'react';
import ColorSelector from './ColorSelector';

function AddDeckForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#ffcb91' // Default color
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleColorChange = (color) => {
    setFormData({
      ...formData,
      color: color
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
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

export default AddDeckForm;