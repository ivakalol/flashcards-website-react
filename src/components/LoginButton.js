import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import '../styles/LoginButton.css';

function LoginButton() {
  const { currentUser, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  return (
    <div className="nav-login-button-container">
      {isAuthenticated ? (
        <>
          <button 
            className="nav-user-button" 
            onClick={toggleDropdown}
            aria-expanded={showDropdown}
          >
            {currentUser.email.charAt(0).toUpperCase()}
          </button>
          
          {showDropdown && (
            <div className="nav-user-dropdown">
              <div className="nav-user-info">
                <p>{currentUser.email}</p>
              </div>
              <button 
                className="nav-logout-button"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </>
      ) : (
        <Link to="/login" className="nav-login-link">
          Log In
        </Link>
      )}
    </div>
  );
}

export default LoginButton;