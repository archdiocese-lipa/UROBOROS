import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/authService"; // Import the loginUser function
import { useState } from "react";

export const useLogin = () => {
  const [error, setError] = useState(null);

  const {
    mutate: login,
    isLoading,
    isError,
    error: _loginError,
  } = useMutation({
    mutationFn: async (credentials) => {
      try {
        const loggedInUser = await loginUser(credentials);
        return loggedInUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Handle successful login (e.g., redirect to dashboard)
      setError(null);
    },
    onError: (error) => {
      // Set error state for failed login
      setError(error.message);
    },
  });

  return {
    login,
    isLoading,
    isError,
    error,
  };
};
