import { supabase } from "./supabaseClient";

/**
 * Get all ministries from the table.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const getAllMinistries = async () => {
  return await supabase
    .from("ministries")
    .select("*")
    .order("created_at", { ascending: false });
};

/**
 * Get a single ministry by its ID.
 * @param {string} id - UUID of the ministry.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const getMinistryById = async (id) => {
  return await supabase.from("ministries").select("*").eq("id", id).single();
};

/**
 * Create a new ministry.
 * @param {Object} ministry - The ministry object (name and description).
 * @returns {Promise<Object>} Response containing data or error.
 */
export const createMinistry = async (ministry) => {
  return await supabase.from("ministries").insert([ministry]);
};

/**
 * Update a ministry by its ID.
 * @param {string} id - UUID of the ministry.
 * @param {Object} updates - Object containing the updated fields.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const updateMinistry = async (id, updates) => {
  return await supabase.from("ministries").update(updates).eq("id", id);
};

/**
 * Delete a ministry by its ID.
 * @param {string} id - UUID of the ministry.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const deleteMinistry = async (id) => {
  return await supabase.from("ministries").delete().eq("id", id);
};
