import { supabase } from "./supabaseClient";

// Poll table format
// CREATE TABLE poll (
//     poll_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     poll_name TEXT NOT NULL,
//     creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
//     status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active'
// );

// Poll Entry table format
// CREATE TABLE poll_entry (
//     poll_entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     poll_id UUID REFERENCES poll(poll_id) ON DELETE CASCADE,
//     entry_date DATE NOT NULL,
//     entry_time TIME NOT NULL
// );

// Poll Answer table format
// CREATE TABLE poll_answer (
//     poll_answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     poll_entry_id UUID REFERENCES poll_entry(poll_entry_id) ON DELETE CASCADE,
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     answer TEXT CHECK (answer IN ('available', 'unavailable', 'ifneeded')) NOT NULL
// );

// Poll CRUD operations
const getPolls = async () => {
  const { data, error } = await supabase.from("poll").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const createPoll = async (pollData) => {
  const { data, error } = await supabase.from("poll").insert([pollData]);
  if (error) throw new Error(error.message);
  return data;
};

const updatePoll = async (pollId, pollData) => {
  const { data, error } = await supabase
    .from("poll")
    .update(pollData)
    .eq("poll_id", pollId);
  if (error) throw new Error(error.message);
  return data;
};

const deletePoll = async (pollId) => {
  const { data, error } = await supabase
    .from("poll")
    .delete()
    .eq("poll_id", pollId);
  if (error) throw new Error(error.message);
  return data;
};

// Poll Entry CRUD operations
const getPollEntries = async (pollId) => {
  const { data, error } = await supabase
    .from("poll_entry")
    .select("*")
    .eq("poll_id", pollId);
  if (error) throw new Error(error.message);
  return data;
};

const createPollWithEntries = async (pollData, pollEntries) => {
  try {
    // Adjust data to match the database schema
    const adjustedPollData = {
      poll_name: pollData.pollName,
      status: "active", // Default to 'active'
    };

    // Insert the poll data and retrieve the newly created poll
    const { data: poll, error: pollError } = await supabase
      .from("poll")
      .insert([adjustedPollData])
      .select("poll_id") // Select the ID immediately after insertion
      .single();

    if (pollError) {
      console.error("Error inserting poll:", pollError.message);
      throw new Error(pollError.message);
    }

    // Ensure poll_id is retrieved correctly
    const pollId = poll?.poll_id;
    if (!pollId) {
      console.error("Poll ID is null or undefined");
      throw new Error("Poll ID is null or undefined");
    }

    // Prepare poll entries for batch insertion
    const pollEntryData = pollEntries.map((entry) => {
      const entryTime = new Date(entry.pollEntryTime)
        .toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(":", "");

      return {
        poll_id: pollId, // Foreign key reference
        entry_date: new Date(entry.pollEntryDate).toISOString().split("T")[0], // YYYY-MM-DD
        entry_time: entryTime, // Format time to HHMM
      };
    });

    // Insert poll entries in batch for efficiency
    const { data: entryData, error: entryError } = await supabase
      .from("poll_entry")
      .insert(pollEntryData);

    if (entryError) {
      console.error("Error inserting poll entries:", entryError.message);
      throw new Error(entryError.message);
    }

    return { poll, pollEntries: entryData };
  } catch (error) {
    console.error("Error creating poll with entries:", error.message);
    throw error;
  }
};

// Poll Answer CRUD operations
const getPollAnswers = async (pollEntryId) => {
  const { data, error } = await supabase
    .from("poll_answer")
    .select(
      `
      *,
      users (
        first_name,
        last_name
      )
    `
    )
    .eq("poll_entry_id", pollEntryId);
  if (error) throw new Error(error.message);
  return data;
};

const createPollAnswer = async (pollAnswerData) => {
  const { data, error } = await supabase
    .from("poll_answer")
    .insert([pollAnswerData]);
  if (error) throw new Error(error.message);
  return data;
};

const updatePollAnswer = async (pollAnswerId, pollAnswerData) => {
  const { data, error } = await supabase
    .from("poll_answer")
    .update(pollAnswerData)
    .eq("poll_answer_id", pollAnswerId);
  if (error) throw new Error(error.message);
  return data;
};

const deletePollAnswer = async (pollAnswerId) => {
  const { data, error } = await supabase
    .from("poll_answer")
    .delete()
    .eq("poll_answer_id", pollAnswerId);
  if (error) throw new Error(error.message);
  return data;
};

const getPollAnswersByUser = async (pollId, userId) => {
  const { data, error } = await supabase
    .from("poll_answer")
    .select("*")
    .eq("poll_entry_id", pollId) // Correctly reference poll_entry_id
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
};

const PollService = {
  getPolls,
  createPoll,
  updatePoll,
  deletePoll,
  getPollEntries,
  createPollWithEntries,
  getPollAnswers,
  createPollAnswer,
  updatePollAnswer,
  deletePollAnswer,
  getPollAnswersByUser,
};

export default PollService;
