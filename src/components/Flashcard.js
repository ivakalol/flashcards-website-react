import React, { useState, useEffect } from 'react';
import '../styles/Flashcard.css';

function Flashcard({ card, onDelete, onEdit, isInStudyMode = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Reset flip state when card changes (important for study mode)
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent flipping the card
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      onDelete(card.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent flipping the card
    onEdit(card);
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{card.question}</p>
          {!isInStudyMode && (
            <div className="flashcard-actions">
              {/* Make edit button always visible */}
              <button 
                className="flashcard-edit-btn visible" 
                onClick={handleEditClick}
                title="Edit card"
              >
                ✎
              </button>
              <button 
                className="flashcard-delete-btn visible" 
                onClick={handleDeleteClick}
                title="Delete card"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <div className="flashcard-back">
          <p>{card.answer}</p>
          {!isInStudyMode && (
            <div className="flashcard-actions">
              <button 
                className="flashcard-edit-btn visible" 
                onClick={handleEditClick}
                title="Edit card"
              >
                ✎
              </button>
              <button 
                className="flashcard-delete-btn visible" 
                onClick={handleDeleteClick}
                title="Delete card"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;