import { supabase } from "@/supabase";

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("SOMETING WRONG ", error);
  } else {
    console.log("SUCCESS");
  }
};
