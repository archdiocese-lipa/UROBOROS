import { supabase } from "./supabaseClient";

// Function to add family members (parents and children)
export const addFamilyMembers = async (familyData) => {
  try {
    // Begin a transaction or use upsert to ensure data integrity
    const { userId, parents, children } = familyData;

    // Insert parents
    const { data: parentData, error: parentError } = await supabase
      .from("family_members")
      .upsert(
        parents.map((parent) => ({
          user_id: userId,
          role: "parent",
          first_name: parent.firstName,
          last_name: parent.lastName,
          contact_number: parent.contactNumber,
        }))
      );

    if (parentError) {
      throw new Error(parentError.message);
    }

    // Insert children
    const { data: childData, error: childError } = await supabase
      .from("family_members")
      .upsert(
        children.map((child) => ({
          user_id: userId,
          role: "child",
          first_name: child.firstName,
          last_name: child.lastName,
        }))
      );

    if (childError) {
      throw new Error(childError.message);
    }

    return { success: true, parentData, childData };
  } catch (error) {
    console.error("Error adding family members:", error);
    return { success: false, error: error.message };
  }
};
