import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Added PropTypes
import '../styles/CardForm.css';

function CardForm({ 
  onSubmit, 
  initialValues = { question: '', answer: '' }, 
  isEditing = false 
}) {
  // Use a single state object to match the structure of initialValues
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    question: '',
    answer: ''
  });

  // Update from initialValues when component mounts or initialValues changes
  useEffect(() => {
    setFormData({
      question: initialValues.question || '',
      answer: initialValues.answer || ''
    });
    // Clear any previous errors when initialValues change
    setErrors({ question: '', answer: '' });
  }, [initialValues]);

  // Handle input changes with a single function
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      question: formData.question.trim() ? '' : 'Question is required',
      answer: formData.answer.trim() ? '' : 'Answer is required'
    };
    
    setErrors(newErrors);
    return !newErrors.question && !newErrors.answer;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateForm()) {
      return;
    }
    
    // Call the onSubmit function with the current values
    onSubmit({
      id: initialValues.id,
      ...formData
    });
    
    // Only clear the form if we're not editing
    if (!isEditing) {
      setFormData({ question: '', answer: '' });
    }
  };

  // Handle the cancel button click
  const handleCancel = () => {
    onSubmit(null);
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="question">Question:</label>
        <textarea
          id="question"
          value={formData.question}
          onChange={handleChange}
          className={errors.question ? 'error' : ''}
        />
        {errors.question && <div className="error-message">{errors.question}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="answer">Answer:</label>
        <textarea
          id="answer"
          value={formData.answer}
          onChange={handleChange}
          className={errors.answer ? 'error' : ''}
        />
        {errors.answer && <div className="error-message">{errors.answer}</div>}
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

// Add PropTypes for better documentation
CardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    question: PropTypes.string,
    answer: PropTypes.string
  }),
  isEditing: PropTypes.bool
};

export default CardForm;