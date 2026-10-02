"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../supabase/client.js";

// Global auth state. It is driven by onAuthStateChange, so signing in, signing
// up, or signing out anywhere in the app updates every consumer immediately —
// no manual refresh needed.
const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    // Restore an existing session on first load (e.g. after a reload).
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // React to every later auth change (login, register, logout, refresh).
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
