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

export const fetchMinistryAssignedUsers = async (ministryId) => {
  const { data, error } = await supabase
    .from("ministry_assignments")
    .select("*, users(first_name, last_name)") // Select first_name and last_name from the users table
    .eq("ministry_id", ministryId); // Filter by ministry_id

  if (error) {
    throw new Error(error.message); // throw error so react-query can catch it
  }

  return data; // Return the list of ministry assignments with user first_name and last_name
};

export const fetchAvailableVolunteers = async (ministryId) => {
  try {
    // Fetch all volunteers (role = "volunteer")
    const { data: allVolunteers, error: volunteersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, role")
      // .eq("role", "volunteer");

    if (volunteersError) {
      console.error("Error fetching all volunteers:", volunteersError.message);
      return [];
    }

    // Fetch users already assigned to the given ministry (using the ministryId)
    const { data: assignedMembers, error: assignedError } = await supabase
      .from("ministry_assignments")
      .select("user_id")
      .eq("ministry_id", ministryId); // Filter by the given ministry_id

    if (assignedError) {
      console.error("Error fetching assigned members:", assignedError.message);
      return [];
    }

    // Extract user IDs from the volunteer_assignments table
    const assignedUserIds = assignedMembers.map((member) => member.user_id);

    // Filter out users who are already assigned to the ministry
    const availableVolunteers = allVolunteers.filter(
      (volunteer) => !assignedUserIds.includes(volunteer.id)
    );

    return availableVolunteers;
  } catch (error) {
    console.error("Error fetching available volunteers:", error.message);
    return [];
  }
};
export const assignNewVolunteers = async (ministryId, newMembers) => {
  if (!Array.isArray(newMembers)) {
    throw new Error("newMembers should be an array");
  }

  const mappedData = newMembers.map((userId) => ({
    ministry_id: ministryId,
    user_id: userId,
  }));

  try {
    const { data, error } = await supabase
      .from("ministry_assignments")
      .insert(mappedData);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error during insertion:", error.message);
    throw error;
  }
};
