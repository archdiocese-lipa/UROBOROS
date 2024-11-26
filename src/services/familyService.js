import { supabase } from "./supabaseClient";

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
