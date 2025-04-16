import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DeckPage from './pages/DeckPage';
import StudyPage from './pages/StudyPage';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/App.css';

// Protected Route component
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/" 
              element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/deck/:deckId" 
              element={
                <RequireAuth>
                  <DeckPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/study/:deckId" 
              element={
                <RequireAuth>
                  <StudyPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/create" 
              element={
                <RequireAuth>
                  <CreatePage />
                </RequireAuth>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;