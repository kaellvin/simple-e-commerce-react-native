import { supabase } from "@/supabase";
import React, { createContext, useState } from "react";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      let message = "Unknown Error.";
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext value={{ isLoading, error, signIn }}>{children}</AuthContext>
  );
}

interface IAuthContext {
  isLoading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: false,
  error: "",
  signIn: async () => {
    console.warn("signIn must be used within provider");
    return false;
  },
});

export default AuthProvider;
