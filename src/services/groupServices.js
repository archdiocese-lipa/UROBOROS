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
  const { data, error } = supabase
    .from("groups")
    .select("*")
    .eq("ministry_id", ministryId);

  if (error) {
    throw new Error(`Error fetching groups${error.message}`);
  }

  return data;
};

const createGroup = async ({ ministryId, name, description, members }) => {
  const { error } = supabase.from("groups").insert([
    {
      ministry_id: ministryId,
      name,
      description,
    },
  ]);

  if (error) {
    throw new Error(`Error creating group ${error.message}`);
  }

  const { error: memberError } = supabase.from("group_members").insert(members);

  if (memberError) {
    throw new Error(`Error assigning members${memberError.message}`);
  }
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
