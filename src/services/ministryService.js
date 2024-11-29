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
export const editMinistry = async (updatedValues) => {
  // Destructure the updatedValues object to extract necessary fields
  const { ministryId, ministryName, ministryDescription } = updatedValues;

  // Perform the update query using destructured values
  const { data, error } = await supabase
    .from("ministries")
    .update({
      ministry_name: ministryName, // Update ministry_name field
      ministry_description: ministryDescription, // Update ministry_description field
    })
    .eq("id", ministryId); // Use ministryId as the primary key for the update

  if (error) {
    console.error("Error updating ministry:", error.message);
    throw new Error(error.message); // Handle the error appropriately
  }

  return data; // Return the updated data
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
  let query = supabase
    .from("ministry_assignments")
    .select("*, users(first_name, last_name, id)"); // Select first_name, last_name from the users table

  // Check if ministryId is null or a valid ID
  if (ministryId) {
    // If ministryId is valid, filter by ministry_id
    query = query.eq("ministry_id", ministryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchUserMinistries = async (user_id) => {
  // Accept userData as argument
  try {
    const { data, error } = await supabase
      .from("ministry_assignments")
      .select(
        `
        ministries(*)
      `
      )
      .eq("user_id", user_id); // Use the userData passed as an argument

    if (error) {
      console.error("Error fetching ministries:", error);
      throw error;
    }

    // Dynamically extract all ministries from the data array
    const ministries = data.map((item) => item.ministries);

    return ministries; // Return the array of ministries
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const fetchAvailableVolunteers = async (ministryId) => {
  try {
    // Fetch all volunteers (role = "volunteer")
    const { data: allVolunteers, error: volunteersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, role");
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

export const fetchMinistryMembersFirstNamesAndCount = async (ministryId) => {
  const { data, error, count } = await supabase
    .from("ministry_assignments")
    .select("users(first_name)", { count: "exact" })
    .eq("ministry_id", ministryId)
    .limit(4);

  if (error) throw new Error(error.message);

  return {
    firstNames: data.map((user) => user.users.first_name),
    count,
  };
};

export const removeMinistryVolunteer = async (ministryId, memberId) => {
  try {
    const { data, error } = await supabase
      .from("ministry_assignments") // Targeting the right table
      .delete() // Deleting the assignment
      .eq("ministry_id", ministryId) // Filter by ministry_id
      .eq("user_id", memberId); // Filter by user_id (adjust based on actual column names)

    if (error) {
      throw new Error(error.message); // Handle error if deletion fails
    }

    return data;
  } catch (error) {
    console.error("Error removing ministry volunteer:", error.message);
    throw error; // Re-throw the error to be handled in the component
  }
};
