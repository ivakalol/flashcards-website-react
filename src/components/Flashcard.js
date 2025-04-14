import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/Flashcard.css';

// Component for action buttons to avoid duplication
const CardActions = ({ onEdit, onDelete }) => (
  <div className="flashcard-actions">
    <button 
      className="flashcard-edit-btn visible" 
      onClick={onEdit}
      title="Edit card"
      aria-label="Edit card"
    >
      ✎
    </button>
    <button 
      className="flashcard-delete-btn visible" 
      onClick={onDelete}
      title="Delete card"
      aria-label="Delete card"
    >
      ×
    </button>
  </div>
);

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
  
  const handleKeyDown = (e) => {
    // Toggle card on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  // Function to prevent propagation for scroll events
  const handleContentScroll = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Flashcard: ${isFlipped ? 'Answer' : 'Question'}`}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="card-content">
            <p 
              className="card-text" 
              onWheel={handleContentScroll}
              onClick={(e) => e.stopPropagation()} // Allow text selection without flipping
            >
              {card.question}
            </p>
            <span className="card-hint">Click to reveal answer</span>
          </div>
          {!isInStudyMode && (
            <CardActions 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          )}
        </div>
        <div className="flashcard-back">
          <div className="card-content">
            <p 
              className="card-text" 
              onWheel={handleContentScroll}
              onClick={(e) => e.stopPropagation()} // Allow text selection without flipping
            >
              {card.answer}
            </p>
            <span className="card-hint">Click to see question</span>
          </div>
          {!isInStudyMode && (
            <CardActions 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

Flashcard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  isInStudyMode: PropTypes.bool
};

Flashcard.defaultProps = {
  onDelete: () => {},
  onEdit: () => {},
  isInStudyMode: false
};

export default Flashcard;