import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '@/services/supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data: authUser, error: loginError } =
        await supabase.auth.signInWithPassword(credentials);
      if (loginError) throw loginError;

      const { data: fullUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.user.id)
        .single();
      if (fetchError) throw fetchError;

      setUserData(fullUser);
    } catch (error) {
      console.error('Login failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUserData(null);
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

export { UserContext };
