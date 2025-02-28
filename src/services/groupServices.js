import { supabase } from "./supabaseClient";

const fetchGroupMembers = async (groupId) => {
  const { data, error } = supabase
    .from("group_members")
    .select("users(id,first_name,last_name)")
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

const addMember = async ({ userId, members }) => {
  const membersdata = members.map((member) => ({
    user_id: userId,
    group_id: member,
  }));
  const { error } = supabase.from("group_members").insert(membersdata);

  if (error) {
    throw new Error("Error adding members");
  }
};

const removeMember = async ({ userId, groupId }) => {
  const { error } = supabase
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
