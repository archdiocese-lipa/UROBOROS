// UserContext.js
import { createContext, useState } from 'react'; // Remove 'React' import
import { supabase } from '@/services/supabaseClient';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data: authUser, error: loginError } =
        await supabase.auth.signInWithPassword(credentials);
      if (loginError) throw loginError;

      // Fetch full user data from your `users` table
      const { data: fullUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.user.id)
        .single();
      if (fetchError) throw fetchError;

      setUserData(fullUser); // Update the context state
      return fullUser; // Return fetched user data
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut(); // Log out using Supabase
      setUserData(null); // Clear user data
    } catch (error) {
      console.error('Logout failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
