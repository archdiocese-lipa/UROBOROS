import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/authService"; // Import the registration function
import { useState } from "react";

// This hook handles user registration with the backend
export const useRegister = () => {
  const [error, setError] = useState(null);

  // Use mutation to handle the registration process
  const {
    mutate: register,
    isLoading,
    isError,
    error: _registrationError,
  } = useMutation({
    mutationFn: async (userData) => {
      try {
        const newUser = await registerUser(userData);
        return newUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // You can handle success logic here (e.g., reset form, show success message)
      setError(null);
    },
    onError: (error) => {
      // Set the error message when registration fails
      setError(error.message);
    },
  });

  return {
    register,
    isLoading,
    error,
    isError,
  };
};
