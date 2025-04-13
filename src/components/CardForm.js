import React, { useState, useEffect } from 'react';
import '../styles/CardForm.css';

function CardForm({ onSubmit, initialValues = { question: '', answer: '' }, isEditing = false }) {
  // Create separate state variables for question and answer
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  // Only update from initialValues when the component mounts or initialValues changes
  useEffect(() => {
    setQuestion(initialValues.question || '');
    setAnswer(initialValues.answer || '');
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!question.trim() || !answer.trim()) {
      alert('Both question and answer are required');
      return;
    }
    
    // Call the onSubmit function with the current values
    onSubmit({
      id: initialValues.id,
      question: question,
      answer: answer
    });
    
    // Only clear the form if we're not editing
    if (!isEditing) {
      setQuestion('');
      setAnswer('');
    }
  };

  // Create a separate function for the cancel button
  const handleCancel = () => {
    onSubmit(null);
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="question">Question:</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="answer">Answer:</label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-submit">
          {isEditing ? 'Save Changes' : 'Add Card'}
        </button>
        {isEditing && (
          <button 
            type="button" 
            className="btn btn-cancel" 
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CardForm;