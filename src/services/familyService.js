import { supabase } from "./supabaseClient";

// Check duplicated name for family members
export const checkDuplicateFamilyMember = async (familyId, firstName) => {
  try {
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .eq("family_id", familyId) 
      .eq("first_name", firstName.trim()); 

    if (error) {
      throw new Error(error.message);
    }

    // If the query returns any data, it means the first name already exists for this family
    if (data.length > 0) {
      return true; 
    }

    // If no matching family member is found
    return false; 
  } catch (error) {
    console.error("Error checking for duplicate family member:", error);
    return false; 
  }
};

export const addParent = async (parentsData, familyId) => {
  try {
    // Loop through each parent and check for duplicates
    for (const parent of parentsData) {
      const isDuplicate = await checkDuplicateFamilyMember(
        familyId,
        parent.firstName
      );
      if (isDuplicate) {
        return {
          success: false,
          message: `Family member with the first name "${parent.firstName}" already exists in this family.`,
        };
      }
    }

    // If no duplicates, insert the data
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
    const { data, error } = await supabase
      .from("family_group")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching user id", error);
    return { success: false, error: error.message };
  }
};
