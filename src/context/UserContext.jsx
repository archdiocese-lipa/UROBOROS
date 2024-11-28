import { createContext, useState } from "react";
import { supabase } from "@/services/supabaseClient"; // Ensure correct import for supabase
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [regData, setRegData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login function
  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data: authUser, error: loginError } =
        await supabase.auth.signInWithPassword(credentials);
      if (loginError) throw loginError;

      // Fetch the full user data from the "users" table
      const { data: fullUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.user.id)
        .single();

      if (fetchError) throw fetchError;

      // Allow login if the user's role is "admin" or if their account is confirmed
      if (!fullUser.is_confirmed && fullUser.role !== "admin") {
        throw new Error(
          "Your account has not been confirmed yet. Please contact an admin"
        );
      }

      setUserData(fullUser); // Set the user data in your state
      return fullUser; // Return the full user data
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // Propagate the error to the caller
    } finally {
      setLoading(false); // Stop the loading state
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
      // Check if the email already exists in the users table
      const { data: existingUser, error: emailCheckError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle(); // Use maybeSingle instead of single

      if (emailCheckError) throw emailCheckError;

      // If email already exists, throw an error
      if (existingUser) {
        throw new Error(
          "Email already registered. Please use a different one."
        );
      }

      // Proceed with the signup process if the email does not exist
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.user.id,
          email: user.user.email,
          first_name: firstName,
          last_name: lastName,
          contact_number: contactNumber,
          role: "parishioner",
          is_confirmed: false,
        },
      ]);

      if (insertError) throw insertError;

      const { data: newUserFamily, error: familyError } = await supabase
        .from("family_group")
        .upsert([
          {
            user_id: user.user.id,
          },
        ])
        .select();

      if (familyError) throw familyError;

      // Insert the user data into the 'parents' table
      const { error: parentsInsertError } = await supabase
        .from("parents")
        .insert([
          {
            parishioner_id: user.user.id,
            first_name: firstName,
            last_name: lastName,
            contact_number: contactNumber,
            family_id: newUserFamily[0].id,
          },
        ]);

      if (parentsInsertError) throw parentsInsertError;

      // Set regData after successful registration
      setRegData({
        id: user.user.id,
        firstName,
        lastName,
        contact_number: contactNumber,
        familyId: newUserFamily[0].id,
      });
      return;
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
