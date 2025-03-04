import { supabase } from "./supabaseClient";

const fetchGroupMembers = async (groupId) => {
  const { data, error } = await supabase
    .from("group_members")
    .select("joined_at,users(id,first_name,last_name)")
    .eq("group_id", groupId);

  if (error) {
    throw new Error(`Error fetching group members${error.message}`);
  }

  return data;
};

const fetchGroups = async (ministryId) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("ministry_id", ministryId);

  if (error) {
    throw new Error(`Error fetching groups${error.message}`);
  }

  return data;
};

const createGroup = async ({
  ministryId,
  name,
  description,
  created_by,
  members,
}) => {
  const { data: group, error } = await supabase
    .from("groups")
    .insert([
      {
        ministry_id: ministryId,
        name,
        description,
        created_by,
      },
    ])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error creating group: ${error.message}`);
  }

  // If there are members to add, add them
  if (members && members.length > 0) {
    const membersData = members.map((memberId) => ({
      group_id: group.id,
      user_id: memberId,
    }));

    const { error: membersError } = await supabase
      .from("group_members")
      .insert(membersData);

    if (membersError) {
      throw new Error(`Error adding group members: ${membersError.message}`);
    }
  }

  return group;
};

const editGroup = async ({ ministryId, name, description }) => {
  const { error } = supabase.from("groups").update({
    ministry_id: ministryId,
    name,
    description,
  });

  if (error) {
    throw new Error(`Error editting group ${error.message}`);
  }
};

const addMember = async ({ groupId, members }) => {
  if (!groupId || !members || !members.length) {
    throw new Error("Group ID and members are required");
  }

  const membersToAdd = members.map((userId) => ({
    group_id: groupId,
    user_id: userId,
  }));

  try {
    const { data, error } = await supabase
      .from("group_members")
      .insert(membersToAdd)
      .select();

    if (error) {
      console.error("Error adding members:", error);
      throw new Error(`Error adding members: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Exception in addGroupMembers:", error);
    throw error;
  }
};

const removeMember = async ({ userId, groupId }) => {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);
  if (error) {
    throw new Error("Error removing member");
  }
};

const deleteGroup = async (ministryId) => {
  const { error } = await supabase.from("groups").delete().eq("id", ministryId);

  if (error) {
    throw new Error("Error deleting group");
  }
};

export {
  createGroup,
  editGroup,
  deleteGroup,
  addMember,
  removeMember,
  fetchGroupMembers,
  fetchGroups,
};
