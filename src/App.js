import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DeckPage from './pages/DeckPage';
import StudyPage from './pages/StudyPage';
import CreatePage from './pages/CreatePage';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
          <Route path="/study/:deckId" element={<StudyPage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;