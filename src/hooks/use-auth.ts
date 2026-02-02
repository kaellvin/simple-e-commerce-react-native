import { AuthContext } from "@/src/providers/auth-provider";
import { useContext } from "react";

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within provider");
  }
  return context;
}

export default useAuth;
