import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { getDeck } from '../services/deckService';
import '../styles/StudyPage.css';

// Custom hook to handle study session state and logic
function useStudySession(deck) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [knownCards, setKnownCards] = useState([]);
  const [cardKey, setCardKey] = useState(0);
  
  const handleNextCard = (known) => {
    if (known) {
      setKnownCards([...knownCards, currentCardIndex]);
    }
    
    if (deck && currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardKey(prev => prev + 1); // Force Flashcard re-render in non-flipped state
    } else {
      setShowResults(true);
    }
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setKnownCards([]);
    setShowResults(false);
    setCardKey(prev => prev + 1);
  };

  return {
    currentCardIndex,
    showResults,
    knownCards,
    cardKey,
    handleNextCard,
    restartStudy
  };
}

// Component for study session buttons
const StudyActionButtons = ({ onKnowCard, onNeedReview }) => (
  <div className="study-actions">
    <button className="btn btn-success" onClick={onKnowCard}>
      I know this
    </button>
    <button className="btn btn-danger" onClick={onNeedReview}>
      Need to review
    </button>
  </div>
);

// Component for navigation buttons
const NavigationButtons = ({ onStudyAgain, onBackToDeck }) => (
  <div className="results-actions">
    <button className="btn btn-primary" onClick={onStudyAgain}>
      Study Again
    </button>
    <button className="btn btn-secondary" onClick={onBackToDeck}>
      Back to Deck
    </button>
  </div>
);

// Results view component
const StudyResults = ({ deck, knownCards, onStudyAgain, onBackToDeck }) => (
  <div className="study-page results">
    <h1>Study Results</h1>
    <div className="results-container">
      <p>You've completed studying {deck.title}!</p>
      <p>Cards in deck: {deck.cards.length}</p>
      <p>Cards you knew: {knownCards.length}</p>
      <p>Cards to review: {deck.cards.length - knownCards.length}</p>
      <NavigationButtons
        onStudyAgain={onStudyAgain}
        onBackToDeck={onBackToDeck}
      />
    </div>
  </div>
);

// Empty deck view component
const EmptyDeck = ({ deck, onBackToDeck }) => (
  <div className="study-page empty-deck">
    <h1>Study {deck.title}</h1>
    <p>This deck has no cards to study.</p>
    <button className="btn btn-primary" onClick={onBackToDeck}>
      Go Back to Deck
    </button>
  </div>
);

// Main component
function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    currentCardIndex,
    showResults,
    knownCards,
    cardKey,
    handleNextCard,
    restartStudy
  } = useStudySession(deck);

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

  const navigateToDeck = () => navigate(`/deck/${deckId}`);

  // Loading state
  if (isLoading) {
    return <div className="loading">Loading study session...</div>;
  }

  // Error state
  if (!deck) {
    return <div className="error">Deck not found</div>;
  }

  // Empty deck state
  if (deck.cards.length === 0) {
    return <EmptyDeck deck={deck} onBackToDeck={navigateToDeck} />;
  }

  // Results state
  if (showResults) {
    return (
      <StudyResults
        deck={deck}
        knownCards={knownCards}
        onStudyAgain={restartStudy}
        onBackToDeck={navigateToDeck}
      />
    );
  }

  // Study session state
  return (
    <div className="study-page">
      <h1>Study {deck.title}</h1>
      <div className="study-progress">
        Card {currentCardIndex + 1} of {deck.cards.length}
      </div>
      
      <div className="study-card-container">
        <Flashcard 
          key={`card-${cardKey}`}
          card={deck.cards[currentCardIndex]} 
          isInStudyMode={true} 
        />
      </div>

      <StudyActionButtons 
        onKnowCard={() => handleNextCard(true)}
        onNeedReview={() => handleNextCard(false)}
      />
    </div>
  );
}

export default StudyPage;