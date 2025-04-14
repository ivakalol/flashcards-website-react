import React, { useState } from 'react';
import ColorSelector from './ColorSelector';

function EditDeckForm({ deck, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: deck.title || '',
    description: deck.description || '',
    color: deck.color || '#ffcb91'
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
    
    onSave(formData);
  };
  
  return (
    <div className="edit-deck-section">
      <h2>Edit Deck</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Deck Title:</label>
          <input
            type="text"
            id="edit-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-description">Description:</label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-color">Deck Color:</label>
          <ColorSelector 
            selectedColor={formData.color}
            onChange={handleColorChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDeckForm;