import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" aria-label="Flashcards Home">Flashcards</Link>
      </div>
      
      <nav className="nav" aria-label="Main Navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active" : ""}
              end
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/create" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              Create Deck
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="auth-container">
        <LoginButton />
      </div>
    </header>
  );
}

export default Header;