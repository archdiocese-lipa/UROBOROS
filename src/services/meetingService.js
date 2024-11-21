import { supabase } from "./supabaseClient"; // Ensure supabase client is imported

// Function to create a meeting
export const createMeeting = async (meetingData) => {
  try {
    const {
      meetingName,

      location,
      details,

      date, // formatted date from the form
      time, // formatted time from the form
      userId,
    } = meetingData;

    // Insert meeting data into Supabase
    const { data, error } = await supabase
      .from("meetings")
      .insert([
        {
          meeting_name: meetingName,
          meeting_date: date, // formatted meeting date (yyyy-MM-dd)
          start_time: time, // formatted start time (HH:mm:ss)
          end_time: time, // Ensure end time is correctly set, maybe add logic here if needed
          location,
          details,
          creator_id: userId, // Assuming creatorId is passed in the form data
        },
      ])
      .single(); // Returns the created row as a single object

    if (error) {
      throw new Error(error.message); // Handle any errors
    }

    return { success: true, data }; // Return unified success structure
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
export const getMeetings = async ({ creatorId, startDate, endDate }) => {
  try {
    let query = supabase.from("meetings").select("*");

    // Filter by creator if provided
    if (creatorId) {
      query = query.eq("creator_id", creatorId);
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      query = query.gte("meeting_date", startDate).lte("meeting_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
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

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
    return { success: false, error: error.message };
  }
};
