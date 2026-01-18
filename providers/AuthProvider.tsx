import { supabase } from "@/supabase";
import React, { createContext, useState } from "react";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      throw new Error(error.message);
    }
  };

  return <AuthContext value={{ isLoading, signIn }}>{children}</AuthContext>;
}

interface IAuthContext {
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: false,
  signIn: async () => console.warn("signIn must be used within provider"),
});

export default AuthProvider;
