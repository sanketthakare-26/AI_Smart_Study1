import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Email / Password sign-in ─────────────────────────────────────────────
  async function loginWithEmail(email, password) {
    setError(null);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  // ── Email / Password register ─────────────────────────────────────────────
  async function registerWithEmail(email, password, name) {
    setError(null);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Update display name immediately
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    return cred.user;
  }

  // ── Google sign-in ────────────────────────────────────────────────────────
  async function loginWithGoogle() {
    setError(null);
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  }

  // ── Sign out ──────────────────────────────────────────────────────────────
  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  // ── Password reset ────────────────────────────────────────────────────────
  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  // ── Get current ID token (for API calls) ─────────────────────────────────
  async function getIdToken() {
    if (!user) return null;
    return user.getIdToken();
  }

  const value = {
    user,
    loading,
    error,
    setError,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    getIdToken,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
