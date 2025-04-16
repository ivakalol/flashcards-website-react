import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config'; // Import directly from config

// Check if Firebase Auth is initialized
if (!auth) {
  console.error("Firebase Auth is not initialized properly!");
}

// Register a new user
export const register = async (email, password) => {
  console.log("Register called with:", email, "auth initialized:", !!auth);
  
  if (!auth) {
    throw new Error("Firebase authentication is not initialized properly");
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Registration successful for:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Registration error:", {
      code: error.code,
      message: error.message,
      authObject: !!auth
    });
    throw error;
  }
};

// Sign in an existing user
export const login = async (email, password) => {
  console.log("Login called with:", email, "auth initialized:", !!auth);
  
  if (!auth) {
    throw new Error("Firebase authentication is not initialized properly");
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful for:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Sign out the current user
export const logout = async () => {
  console.log("Logout called, auth initialized:", !!auth);
  
  if (!auth) {
    throw new Error("Firebase authentication is not initialized properly");
  }
  
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Subscribe to auth state changes
export const onAuthChange = (callback) => {
  console.log("onAuthChange called, auth initialized:", !!auth);
  
  if (!auth) {
    console.error("Cannot setup auth change listener - auth not initialized");
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth?.currentUser || null;
};  