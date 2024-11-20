import { createContext, useState } from "react";
import { supabase } from "@/services/supabaseClient"; // Ensure correct import for supabase
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [regData, setRegData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data: authUser, error: loginError } =
        await supabase.auth.signInWithPassword(credentials);
      if (loginError) throw loginError;

      const { data: fullUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.user.id)
        .single();
      if (fetchError) throw fetchError;

      setUserData(fullUser);
      return fullUser;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async ({
    firstName,
    lastName,
    email,
    password,
    contactNumber,
  }) => {
    setLoading(true);
    try {
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log(user);

      if (signUpError) throw signUpError;

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.user.id,
          email: user.user.email,
          name: `${firstName} ${lastName}`,
          contact_number: contactNumber,
          role: "parishioner",
          is_confirmed: false,
          is_active: true,
        },
      ]);

      if (insertError) throw insertError;

      // Set regData after successful registration
      setRegData({
        id: user.user.id,
        firstName,
        lastName,
        contact_number: contactNumber,
      });
    } catch (error) {
      console.error("Registration failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUserData(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        regData,
        setUserData,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
