// useUser.js
import { useContext } from 'react';
import UserContext from './UserContext'; // Import the context, not the provider

export const useUser = () => useContext(UserContext);
