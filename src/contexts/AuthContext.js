import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthChange } from '../services/authService';
import { auth } from '../firebase/config'; // Import auth directly

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listener, auth initialized:", !!auth);
    
    if (!auth) {
      console.error("Auth is not initialized properly!");
      setAuthError("Firebase authentication failed to initialize");
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthChange((user) => {
      console.log("Auth state changed:", user ? `User ${user.uid}` : "No user");
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading: loading,
    authError
  };

  if (authError) {
    console.error("Auth error:", authError);
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}