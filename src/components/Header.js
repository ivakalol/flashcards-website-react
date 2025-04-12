import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Flashcards</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create">Create Deck</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;