import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

// We map custom username -> email by appending "@sikopi.local"
// so the UI stays as "Username / Password" while using real Supabase Auth.
const toEmail = (username: string) => {
  if (username.includes("@")) return username; // already an email
  return `${username.trim().toLowerCase()}@sikopi.local`;
};

type AuthCtx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<{success: boolean, error?: string}>;
  updateCredentials: (username: string, password: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => ({success: false, error: "Not initialized"}),
  updateCredentials: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string): Promise<{success: boolean, error?: string}> => {
    const email = toEmail(username);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("[Auth] signIn error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateCredentials = async (newUsername: string, newPassword: string) => {
    const updates: { email?: string; password?: string } = {};
    if (newUsername) updates.email = toEmail(newUsername);
    if (newPassword) updates.password = newPassword;
    const { error } = await supabase.auth.updateUser(updates);
    if (error) throw new Error(error.message);
  };

  return (
    <Ctx.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signOut,
        signIn,
        updateCredentials,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
