import { supabase } from "./supabaseClient";

// Check for duplicate names of all family members
export const checkDuplicatedFamilyMember = async (familyId, firstName) => {
  try {
    // Ensure firstName is a valid string
    if (!firstName || typeof firstName !== "string") {
      throw new Error("Invalid first name provided.");
    }

    // Query parents and children tables for duplicate names
    const { data: parentsData, error: parentsError } = await supabase
      .from("parents")
      .select("first_name")
      .eq("family_id", familyId)
      .eq("first_name", firstName.trim());

    const { data: childrenData, error: childrenError } = await supabase
      .from("children")
      .select("first_name")
      .eq("family_id", familyId)
      .eq("first_name", firstName.trim());

    // Handle errors
    if (parentsError) throw new Error(parentsError.message);
    if (childrenError) throw new Error(childrenError.message);

    // Check if the name exists in either table
    const isDuplicate =
      (parentsData && parentsData.length > 0) ||
      (childrenData && childrenData.length > 0);

    return isDuplicate;
  } catch (error) {
    console.error("Error checking for duplicate family member:", error);
    return false;
  }
};

export const addParent = async (parentsData, familyId) => {
  try {
    const { data, error } = await supabase
      .from("parents")
      .upsert(
        parentsData.map((parent) => ({
          family_id: familyId,
          first_name: parent.firstName,
          last_name: parent.lastName,
          contact_number: parent.contactNumber,
        }))
      )
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error adding parent:", error);
    return { success: false, error: error.message };
  }
};

export const addChild = async (childrenData, familyId) => {
  try {
    const { data, error } = await supabase
      .from("children")
      .upsert(
        childrenData.map((child) => ({
          family_id: familyId,
          first_name: child.firstName,
          last_name: child.lastName,
        }))
      )
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error adding child:", error);
    return { success: false, error: error.message };
  }
};

// Function to add family members (parents and children)
export const addFamilyMembers = async (familyData) => {
  try {
    // Begin a transaction or use upsert to ensure data integrity
    const { parents, children, familyId } = familyData;
    let parentData;
    let childData;

    if (parents.length > 0) {
      parentData = await addParent(parents, familyId);
    }
    if (children.length > 0) {
      childData = await addChild(children, familyId);
    }

    return { success: true, parentData, childData };
  } catch (error) {
    console.error("Error adding family members:", error);
    return { success: false, error: error.message };
  }
};

// Get family id
export const getFamilyId = async (userId) => {
  try {
    // Fetch family group where the user is the primary user
    const { data: primaryFamily, error: primaryError } = await supabase
      .from("family_group")
      .select("id")
      .eq("user_id", userId);

    if (primaryError) {
      throw new Error(primaryError.message);
    }

    if (primaryFamily.length === 1) {
      return primaryFamily[0];
    }

    // If no primary family group found, check if the user is a co-parent
    const { data: coParentFamily, error: coParentError } = await supabase
      .from("parents")
      .select("family_id")
      .eq("parishioner_id", userId);

    if (coParentError) {
      throw new Error(coParentError.message);
    }

    if (!coParentFamily || coParentFamily.length === 0) {
      throw new Error("No family group found for the given user ID");
    }

    if (coParentFamily.length > 1) {
      throw new Error("Multiple family groups found for the given user ID");
    }

    return { id: coParentFamily[0].family_id };
  } catch (error) {
    console.error("Error fetching family id", error);
    return { success: false, error: error.message };
  }
};

// Fetch parents/guardian
export const getGuardian = async (familyId) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!userData || !userData.user) {
      throw new Error("User not logged in or session expired");
    }

    const loggedInUserId = userData.user.id;

    // Fetch parents data based on familyId
    const { data: parents, error: parentsError } = await supabase
      .from("parents")
      .select("*")
      .eq("family_id", familyId)
      .or(`parishioner_id.neq.${loggedInUserId},parishioner_id.is.null`); // Fetch rows where parishioner_id is not the logged-in user or is null

    if (parentsError) {
      return { success: false, error: parentsError.message };
    }

    return parents;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Fetchchildren
export const getChildren = async (familyId) => {
  try {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("family_id", familyId); // Equal to family group

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching user id", error);
    return { success: false, error: error.message };
  }
};

// Edit parent
export const updateParent = async (parentId, data) => {
  if (!data) {
    throw new Error("Data is undefined");
  }

  const { firstName, lastName, contactNumber } = data;

  if (!firstName || !lastName || !contactNumber) {
    throw new Error("First name or last name is missing");
  }

  const { data: updatedParent, error } = await supabase
    .from("parents")
    .update({
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
    })
    .eq("id", parentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message); // Throw an error to be caught by the mutation
  }

  return updatedParent; // Return the updated child data
};

// Delete parent
export const deleteParent = async (parentId) => {
  const { data, error } = await supabase
    .from("parents")
    .delete()
    .eq("id", parentId)
    .select()
    .single(); // Specify the child ID to delete

  if (error) {
    throw new Error(error.message); // Handle error from Supabase
  }

  return data; // Return the deleted data if successful
};

// Edit Children
export const updateChild = async (childId, data) => {
  if (!data) {
    throw new Error("Data is undefined");
  }

  const { firstName, lastName } = data;

  if (!firstName || !lastName) {
    throw new Error("First name or last name is missing");
  }

  const { data: updatedChild, error } = await supabase
    .from("children")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", childId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message); // Throw an error to be caught by the mutation
  }

  return updatedChild; // Return the updated child data
};

// Delete child
export const deleteChild = async (childId) => {
  const { data, error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId)
    .select()
    .single(); // Specify the child ID to delete

  if (error) {
    throw new Error(error.message); // Handle error from Supabase
  }

  return data; // Return the deleted data if successful
};
