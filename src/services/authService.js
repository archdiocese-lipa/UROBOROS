import { supabase } from './supabaseClient'; // Supabase client import

// Register user
const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  contactNumber,
}) => {
  try {
    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.user.id, // Use UUID from Supabase Auth
        email: user.user.email,
        name: `${firstName} ${lastName}`,
        contact_number: contactNumber,
        role: 'parishioner', // Example role
        is_confirmed: false, // Example status
        is_active: true, // Active by default
      },
    ]);

    if (insertError) throw insertError;

    return user;
  } catch (error) {
    console.error('Error during sign-up:', error);
  }
};

// Login user
const loginUser = async ({ email, password }) => {
  try {
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return user; // Return user data on successful login
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Logout user
const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export { registerUser, loginUser, logoutUser };
