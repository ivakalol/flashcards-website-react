import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import '../styles/RegisterPage.css'; // Changed to RegisterPage.css
console.log("RegisterPage: Firebase auth initialized:", !!auth);

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // If user is already logged in, redirect to home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await register(email, password);
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError("Email is already in use. Please use a different email or log in.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Invalid email address.");
      } else {
        setError("Failed to create an account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-auth-container">
        <h1>Create an Account</h1>
        
        {error && <div className="register-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-auth-form">
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <div className="register-form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary register-submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="register-auth-options">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;