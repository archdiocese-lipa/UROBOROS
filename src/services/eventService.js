import { supabase } from "./supabaseClient"; // Ensure supabase client is imported

// Function to create an event
export const createEvent = async (eventData) => {
  try {
    const {
      eventName,
      eventCategory,
      eventVisibility,
      ministry,
      eventDate, // formatted date from the form
      eventTime, // formatted time from the form
      eventDescription,
      userId, // Creator's ID
      assignVolunteer,
    } = eventData;

    // Insert event data into Supabase
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          event_name: eventName,
          event_category: eventCategory,
          event_visibility: eventVisibility,
          ministry: ministry || null, // Ministry is optional
          event_date: eventDate, // formatted date (yyyy-MM-dd)
          event_time: eventTime, // formatted time (HH:mm:ss)
          event_description: eventDescription || null, // Optional field
          creator_id: userId, // Assuming userId is passed in the form data
          assigned_volunteer: assignVolunteer,
        },
      ])
      .single(); // Returns the created row as a single object

    if (error) {
      throw new Error(error.message); // Handle any errors
    }

    return { success: true, data }; // Return success structure
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message }; // Return error structure
  }
};

// Function to update an existing event
export const updateEvent = async (eventId, updatedData) => {
  try {
    const {
      eventName,
      eventCategory,
      eventVisibility,
      ministry,
      eventDate,
      eventTime,
      eventDescription,
    } = updatedData;

    // Update event data
    const { data, error } = await supabase
      .from("events")
      .update({
        event_name: eventName,
        event_category: eventCategory,
        event_visibility: eventVisibility,
        ministry: ministry || null,
        event_date: eventDate, // formatted date (yyyy-MM-dd)
        event_time: eventTime, // formatted time (HH:mm:ss)
        event_description: eventDescription || null,
        updated_at: new Date(), // Update the `updated_at` field
      })
      .eq("id", eventId) // Ensure you're updating the correct event by its ID
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message };
  }
};

// Function to fetch all events (optionally filter by date, creator, etc.)
export const getEvents = async ({ creatorId, startDate, endDate } = {}) => {
  try {
    let query = supabase.from("events").select("*");

    // Filter by creator if provided
    if (creatorId) {
      query = query.eq("creator_id", creatorId);
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      query = query.gte("event_date", startDate).lte("event_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: error.message };
  }
};

// Function to delete an event by its ID
export const deleteEvent = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
};

// Function to fetch quick access events
export const getQuickAccessEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("quick_access_events")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data; // Return only the data directly
  } catch (error) {
    console.error("Error fetching quick access events:", error);
    throw new Error(error.message);
  }
};

// Function to fetch a single event by its ID
export const getEventById = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single(); // Fetch only one record

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return { success: false, error: error.message };
  }
};

export const getAllEvents = async () => {
  try {
    const { data, error } = await supabase.from("events").select("*"); // Select all columns from the events table

    if (error) {
      throw new Error(error.message); // Handle any errors
    }

    return { success: true, data }; // Return success structure with data
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: error.message }; // Return error structure
  }
};

export const insertEventAttendance = async (submittedData) => {
  const { event, parents, children } = submittedData;

  // Prepare parent records
  const parentRecords = parents.map((parent) => ({
    event_id: event,
    first_name: parent.parentFirstName,
    last_name: parent.parentLastName,
    contact_number: parent.parentContactNumber,
    type: "parent",
    is_main_applicant: parent.isMainApplicant,
  }));

  // Prepare child records
  const childRecords = children.map((child) => ({
    event_id: event,
    first_name: child.childFirstName,
    last_name: child.childLastName,
    type: "child",
    is_main_applicant: false, // Children are not main applicants
  }));

  // Combine all records
  const allRecords = [...parentRecords, ...childRecords];

  // Insert into the database
  const { data, error } = await supabase
    .from("event_attendance")
    .insert(allRecords);

  if (error) {
    console.error("Error inserting event attendance records:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
};
