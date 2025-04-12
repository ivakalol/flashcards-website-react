import React, { useState } from 'react';
import '../styles/CardForm.css';

function CardForm({ onSubmit, initialValues = { question: '', answer: '' } }) {
  const [question, setQuestion] = useState(initialValues.question);
  const [answer, setAnswer] = useState(initialValues.answer);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ question, answer });
    setQuestion('');
    setAnswer('');
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
      <button type="submit" className="btn btn-submit">Add Card</button>
    </form>
  );
}

export default CardForm;