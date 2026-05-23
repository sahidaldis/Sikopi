import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<boolean>;
  updateCredentials: (username: string, password: string) => Promise<boolean>;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => false,
  updateCredentials: async () => false,
});

// Helper to format username into a valid email format for Supabase Auth
const getEmail = (username: string) => username.includes('@') ? username : `${username.toLowerCase()}@sikopi.local`;
const getUsername = (email: string) => email.split('@')[0];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      const email = getEmail(username);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login failed:", error.message);
        return false;
      }
      return !!data.session;
    } catch (err) {
      console.error("Auth error:", err);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
    try {
      const updates: { email?: string; password?: string } = {};
      
      if (newUsername) {
        updates.email = getEmail(newUsername);
      }
      if (newPassword) {
        updates.password = newPassword;
      }

      const { error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        console.error("Update credentials failed:", error.message);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Update error:", err);
      return false;
    }
  };

  // Provide a mapped user object so UI components relying on user.email for username don't break
  const user = session?.user ? { 
    ...session.user, 
    email: session.user.email ? getUsername(session.user.email) : 'admin' 
  } : null;

  return (
    <Ctx.Provider
      value={{
        session,
        user: user as unknown as User, // Cast to avoid deep type conflicts in UI,
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
