import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { getDeck } from '../services/deckService';
import '../styles/StudyPage.css';

function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [knownCards, setKnownCards] = useState([]);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const deckData = await getDeck(deckId);
        setDeck(deckData);
      } catch (error) {
        console.error('Failed to load deck:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeck();
  }, [deckId]);

  const handleNextCard = (known) => {
    if (known) {
      setKnownCards([...knownCards, currentCardIndex]);
    }
    
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setKnownCards([]);
    setShowResults(false);
  };

  if (isLoading) {
    return <div className="loading">Loading study session...</div>;
  }

  if (!deck) {
    return <div className="error">Deck not found</div>;
  }

  if (deck.cards.length === 0) {
    return (
      <div className="study-page empty-deck">
        <h1>Study {deck.title}</h1>
        <p>This deck has no cards to study.</p>
        <button className="btn btn-primary" onClick={() => navigate(`/deck/${deckId}`)}>
          Go Back to Deck
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="study-page results">
        <h1>Study Results</h1>
        <div className="results-container">
          <p>You've completed studying {deck.title}!</p>
          <p>Cards in deck: {deck.cards.length}</p>
          <p>Cards you knew: {knownCards.length}</p>
          <p>Cards to review: {deck.cards.length - knownCards.length}</p>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={restartStudy}>
              Study Again
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/deck/${deckId}`)}>
              Back to Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-page">
      <h1>Study {deck.title}</h1>
      <div className="study-progress">
        Card {currentCardIndex + 1} of {deck.cards.length}
      </div>
      
      <div className="study-card-container">
        <Flashcard 
          card={deck.cards[currentCardIndex]} 
          isInStudyMode={true} 
        />
      </div>

      <div className="study-actions">
        <button className="btn btn-success" onClick={() => handleNextCard(true) }>
          I know this
        </button>
        <button className="btn btn-danger" onClick={() => handleNextCard(false)}>
          Need to review
        </button>
      </div>
    </div>
  );
}

export default StudyPage;