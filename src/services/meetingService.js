import { supabase } from "./supabaseClient"; // Ensure supabase client is imported
import { paginate } from "@/lib/utils";
import { ROLES } from "@/constants/roles";

// Function to create a meeting
export const createMeeting = async (meetingData) => {
  try {
    const {
      meetingName,
      location,
      details,
      date, // formatted date from the form
      time, // formatted time from the form
      userId, // creator userId from context
      participants, // Array of participant user IDs
    } = meetingData;

    // Insert meeting data into Supabase
    const { data: meeting, error: meetingError } = await supabase
      .from("meetings")
      .insert([
        {
          meeting_name: meetingName,
          meeting_date: date, // formatted meeting date (yyyy-MM-dd)
          start_time: time, // formatted start time (HH:mm:ss)
          end_time: time, // Ensure end time is correctly set
          location,
          details,
          creator_id: userId, // Assuming creatorId is passed in the form data
        },
      ])
      .select("id")
      .single(); // Returns the created row as a single object

    if (meetingError) {
      throw new Error(meetingError.message); // Handle any errors with creating the meeting
    }

    // Insert participants into the meeting_participants table
    if (participants && participants.length > 0) {
      const participantData = participants.map((participantId) => ({
        meeting_id: meeting.id,
        user_id: participantId,
      }));

      const { error: participantsError } = await supabase
        .from("meeting_participants")
        .insert(participantData);

      if (participantsError) {
        throw new Error(participantsError.message); // Handle errors when adding participants
      }
    }

    return { success: true, data: meeting }; // Return success with meeting data
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { success: false, error: error.message }; // Return error structure
  }
};

// Function to update an existing meeting
export const updateMeeting = async (meetingId, updatedData) => {
  try {
    const {
      meetingName,

      startTime,
      endTime,
      location,
      details,
      date,
      time,
    } = updatedData;

    // Format meeting date (yyyy-MM-dd)
    const formattedEndTime = endTime || startTime; // Use startTime if endTime is not provided

    // Update meeting data
    const { data, error } = await supabase
      .from("meetings")
      .update({
        meeting_name: meetingName,

        meeting_date: date, // formatted date
        start_time: time, // formatted start time
        end_time: formattedEndTime, // formatted end time
        location,
        details,
        updated_at: new Date(), // Update the `updated_at` field
      })
      .eq("id", meetingId) // Ensure you're updating the correct meeting by its ID
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating meeting:", error);
    return { success: false, error: error.message };
  }
};

// Function to fetch all meetings (optionally filter by date, creator, etc.)
export const getMeetings = async ({
  creatorId,
  startDate,
  endDate,
  page = 1,
  pageSize,
  query,
  user,
} = {}) => {
  try {
    const filters = {};

    // Filter by meeting date range (start and end date)
    if (startDate) {
      filters.gte = { meeting_date: startDate };
    }

    if (endDate) {
      filters.lte = { meeting_date: endDate };
    }

    // Filter by meeting name (optional query search)
    if (query) {
      filters.ilike = { meeting_name: query };
    }

    // Filter by creator's ID (if provided)
    if (creatorId) {
      filters.eq = { creator_id: creatorId };
    }

    // If the user is not an admin (role check), filter by assigned volunteer (optional)
    if (user?.role !== ROLES[0]) {
      filters.eq = { assigned_volunteer: user?.id };
    }

    // Fetch paginated data from the meetings table with the constructed filters
    const data = await paginate({
      key: "meetings",
      page,
      pageSize,
      filters,
    });

    return data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return { success: false, error: error.message };
  }
};

// Function to delete a meeting by its ID
export const deleteMeeting = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", meetingId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return { success: false, error: error.message };
  }
};

// Function to fetch a single meeting by its ID
export const getMeetingById = async (meetingId) => {
  try {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", meetingId)
      .single(); // Fetch only one record

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
    return { success: false, error: error.message };
  }
};

export const fetchMeetingParticipants = async (meetingId) => {
  try {
    // Query the meeting_participants table for the given meeting ID
    const { data, error } = await supabase
      .from("meeting_participants")
      .select(
        `
        user_id,
      
        users (
          first_name,
          last_name,
          email
        )
        `
      )
      .eq("meeting_id", meetingId); // Filter by meeting ID

    if (error) {
      throw new Error(error.message); // Handle errors
    }

    // Return the fetched data (or empty array if no data is found)
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching meeting participants:", error);
    return { success: false, error: error.message, data: [] }; // Return empty array in case of an error
  }
};
