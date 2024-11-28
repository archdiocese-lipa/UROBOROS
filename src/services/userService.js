import { supabase } from "./supabaseClient"; // Supabase client import

import { paginate } from "@/lib/utils";

/**
 * This function will fetch for user information from the database.
 * @param {string} userId The user ID to fetch from the database.
 * @returns {Promise<object>} The user object fetched from the database.
 * @throws {Error} If an error occurs while fetching the user.
 */
const getUser = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return user;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
};

// Fetch users by role
const getUsersByRole = async (role) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, first_name,last_name, email, role") // Adjust columns as needed
      .eq("role", role); // Filter by role directly

    if (error) throw error;

    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error.message);
    throw error;
  }
};

const getUsers = async ({ page, pageSize, role }) => {
  try {
    const query = {};
    if (role) {
      query.role = role;
    }

    const data = await paginate({ key: "users", page, pageSize, query });

    return data;
  } catch (error) {
    console.error("Error fetching users", error.message);
    throw error;
  }
};

/**
 *
 * @param {Object} payload
 */
const updateUser = async (id, payload) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return user;
  } catch (error) {
    console.error("Error updating user", error.message);
    throw error;
  }
};

const removeUser = async (id) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return user;
  } catch (error) {
    console.error("Error removing user", error.message);
    throw error;
  }
};

const activateUser = async ({ id, payload }) => {
  console.log("Activating user with ID:", id, "and payload:", payload); // Log to check values
  try {
    const { data: user, error } = await supabase
      .from("users")
      .update({ is_confirmed: payload }) // Set the is_confirmed field to the boolean payload
      .eq("id", id) // Find the user by ID
      .select()
      .single(); // Ensure you update only one user

    if (error) throw error;

    return user;
  } catch (error) {
    console.error("Error updating user", error.message);
    throw error;
  }
};

export {
  getUser,
  getUsersByRole,
  getUsers,
  updateUser,
  removeUser,
  activateUser,
};
