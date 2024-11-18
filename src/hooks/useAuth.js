import { useState } from "react";
import { registerUser } from "../services/authService";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const newUser = await registerUser(userData);
      setUser(newUser); // Store registered user data in state
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw the error for further handling in the component
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, register };
};

export default useAuth;
