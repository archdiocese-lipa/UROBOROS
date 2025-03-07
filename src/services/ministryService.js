import { supabase } from "./supabaseClient";

/**
 * Get all ministries from the table.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const getAllMinistries = async () => {
  const { data, error } = await supabase
    .from("ministries")
    .select("*, ministry_coordinators(id)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getAssignedMinistries = async (userId) => {
  const { data, error } = await supabase
    .from("ministry_coordinators")
    .select("ministries(*)")
    .eq("coordinator_id", userId);

  if (error) {
    throw new Error(error.message);
  }
  const arrangedData = data.map((data) => data.ministries);

  return arrangedData;
};

export const getMinistryGroups = async (userId) => {
  if (!userId) {
    console.error("User ID is required");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `id, 
         joined_at, 
         groups(id, name, description, ministry_id, ministry:ministries(id, ministry_name)), 
         users(id)`
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching ministry groups:", error);
      throw new Error(error.message);
    }

    // Transform the data to group by ministries
    const groupedData = data.reduce((acc, item) => {
      const ministryId = item.groups.ministry.id;
      const ministryName = item.groups.ministry.ministry_name;

      if (!acc[ministryId]) {
        acc[ministryId] = {
          ministry_id: ministryId,
          ministry_name: ministryName,
          groups: [],
        };
      }

      acc[ministryId].groups.push({
        group_id: item.groups.id,
        group_name: item.groups.name,
        description: item.groups.description,
        joined_at: item.joined_at,
      });

      return acc;
    }, {});

    // Convert the grouped data into an array
    const result = Object.values(groupedData);

    return result;
  } catch (error) {
    console.error("Exception in getMinistryGroups:", error);
    return [];
  }
};

/**
 * Get a single ministry by its ID.
 * @param {string} id - UUID of the ministry.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const getMinistryById = async (id) => {
  return await supabase.from("ministries").select("*").eq("id", id).single();
};

export const getMinistryCoordinators = async (ministryId) => {
  const { data, error } = await supabase
    .from("ministry_coordinators")
    .select("id,users(id, first_name,last_name)")
    .eq("ministry_id", ministryId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addCoordinators = async ({ ministryId, coordinatorsData }) => {
  // Extract ministry-coordinator pairs
  const coordinatorIds = coordinatorsData?.map((c) => c.coordinator_id);

  // Check if the combination of ministryId and coordinator_id already exists
  const { data: existingCoordinators, error: checkError } = await supabase
    .from("ministry_coordinators")
    .select("coordinator_id, ministry_id")
    .in("coordinator_id", coordinatorIds)
    .eq("ministry_id", ministryId);

  if (checkError) {
    throw new Error("Error checking existing coordinators");
  }

  if (existingCoordinators?.length > 0) {
    throw new Error("coordinators already exist in this ministry.");
  }

  // Insert new coordinators
  const { error: insertError } = await supabase
    .from("ministry_coordinators")
    .insert(coordinatorsData);

  if (insertError) {
    throw new Error("Error assigning coordinators");
  }
};

export const removeCoordinator = async ({ ministryId, coordinator_id }) => {
  const { error } = await supabase
    .from("ministry_coordinators")
    .delete()
    .eq("id", coordinator_id)
    .eq("ministry_id", ministryId);

  if (error) {
    console.error("Error deleting coordinator:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Create a new ministry.
 * @param {Object} ministry - The ministry object (name and description).
 * @returns {Promise<Object>} Response containing data or error.
 */

export const createMinistry = async ({
  coordinators,
  ministry_name,
  ministry_description,
}) => {
  const { data, error } = await supabase
    .from("ministries")
    .insert([
      {
        ministry_name,
        ministry_description,
      },
    ])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  // return data;

  const coordinatorsData = coordinators.map((coordinator) => ({
    ministry_id: data.id,
    coordinator_id: coordinator,
  }));

  addCoordinators({ ministryId: data.id, coordinatorsData });
};

/**
 * Update a ministry by its ID.
 * @param {string} id - UUID of the ministry.
 * @param {Object} updates - Object containing the updated fields.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const editMinistry = async (updatedValues) => {
  // Destructure the updatedValues object to extract necessary fields
  const { coordinators, ministryId } = updatedValues;
  // Perform the update query using destructured values
  // const { data, error } = await supabase
  //   .from("ministries")
  //   .update({
  //     ministry_name, // Update ministry_name field
  //     ministry_description, // Update ministry_description field
  //   })
  //   .eq("id", ministryId); // Use ministryId as the primary key for the update

  // if (error) {
  //   console.error("Error updating ministry:", error.message);
  //   throw new Error(error.message); // Handle the error appropriately
  // }

  const { error: deleteCoordinatorError } = await supabase
    .from("ministry_coordinators")
    .delete()
    .eq("ministry_id", ministryId);

  if (deleteCoordinatorError) {
    throw new Error(
      "Error deleting coordinators!",
      deleteCoordinatorError.message
    );
  }
  const coordinatorInsert = coordinators.map((coordinator) => ({
    ministry_id: ministryId,
    coordinator_id: coordinator,
  }));

  const { error: coordinatorError } = await supabase
    .from("ministry_coordinators")
    .insert(coordinatorInsert);

  if (coordinatorError) {
    throw new Error(coordinatorError.message);
  }
};

export const updateMinistry = async (updatedValues) => {
  // Destructure the updatedValues object to extract necessary fields
  const { ministryId, ministry_name, ministry_description } = updatedValues;

  if (!ministryId) {
    throw new Error("Ministry ID is required");
  }

  // Create an update object with only the fields that are provided
  const updateData = {};
  if (ministry_name !== undefined) updateData.ministry_name = ministry_name;
  if (ministry_description !== undefined)
    updateData.ministry_description = ministry_description;

  // Only perform the update if there are fields to update
  if (Object.keys(updateData).length === 0) {
    return null;
  }

  // Perform the update query
  const { data, error } = await supabase
    .from("ministries")
    .update(updateData)
    .eq("id", ministryId)
    .select();

  if (error) {
    console.error("Error updating ministry:", error.message);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Delete a ministry by its ID.
 * @param {string} id - UUID of the ministry.
 * @returns {Promise<Object>} Response containing data or error.
 */
export const deleteMinistry = async (id) => {
  const { error } = await supabase.from("ministries").delete().eq("id", id);

  if (error) {
    throw new Error("Error Deleting Ministry", error);
  }
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
