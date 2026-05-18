import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type MockUser = {
  email: string;
  id: string;
};

type MockSession = {
  access_token: string;
  user: MockUser;
};

type AuthCtx = {
  session: MockSession | null;
  user: MockUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<boolean>;
  updateCredentials: (username: string, password: string) => void;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => false,
  updateCredentials: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize default credentials in localStorage if not set
  useEffect(() => {
    if (!localStorage.getItem("sikopi_username")) {
      localStorage.setItem("sikopi_username", "admin");
    }
    if (!localStorage.getItem("sikopi_password")) {
      localStorage.setItem("sikopi_password", "admin");
    }

    const isLoggedIn = localStorage.getItem("sikopi_logged_in") === "true";
    if (isLoggedIn) {
      const activeUser = localStorage.getItem("sikopi_username") || "admin";
      setSession({
        access_token: "mock-session-token",
        user: { email: activeUser, id: "mock-admin-id" },
      });
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    const storedUsername = localStorage.getItem("sikopi_username") || "admin";
    const storedPassword = localStorage.getItem("sikopi_password") || "admin";

    if (username === storedUsername && password === storedPassword) {
      localStorage.setItem("sikopi_logged_in", "true");
      setSession({
        access_token: "mock-session-token",
        user: { email: username, id: "mock-admin-id" },
      });
      return true;
    }
    return false;
  };

  const signOut = async () => {
    localStorage.removeItem("sikopi_logged_in");
    setSession(null);
  };

  const updateCredentials = (newUsername: string, newPassword: string) => {
    localStorage.setItem("sikopi_username", newUsername);
    localStorage.setItem("sikopi_password", newPassword);
    // If currently logged in, update the active session user info
    if (session) {
      setSession({
        ...session,
        user: { ...session.user, email: newUsername },
      });
    }
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
