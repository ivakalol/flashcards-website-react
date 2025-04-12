import React, { useState } from 'react';
import '../styles/Flashcard.css';

function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <p>{card.question}</p>
        </div>
        <div className="flashcard-back">
          <p>{card.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;