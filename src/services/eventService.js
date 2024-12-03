import { paginate } from "@/lib/utils";
import { supabase } from "@/services/supabaseClient"; // Ensure supabase client is imported

import { ROLES } from "@/constants/roles";

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
      assignVolunteer, // Array of volunteer IDs
    } = eventData;

    // Step 1: Insert event data into Supabase
    const { data: event, error: eventError } = await supabase
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
        },
      ])
      .select("id") // Return the new event ID
      .single(); // Single object

    if (eventError) {
      throw new Error(eventError.message); // Handle any errors
    }

    // Step 2: Insert assigned volunteers into event_volunteers table
    if (assignVolunteer?.length > 0) {
      const volunteerData = assignVolunteer.map((volunteerId) => ({
        event_id: event.id, // Use the created event ID
        volunteer_id: volunteerId,
      }));

      const { error: volunteerError } = await supabase
        .from("event_volunteers")
        .insert(volunteerData);

      if (volunteerError) {
        throw new Error(volunteerError.message); // Handle any errors
      }
    }

    return { success: true, data: event }; // Return success structure
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message }; // Return error structure
  }
};

// Function to update an existing event
export const updateEvent = async (eventData) => {
  try {
    const {
      eventId, // Event ID to be updated
      eventName,
      eventCategory,
      eventVisibility,
      ministry,
      eventDate, // formatted date from the form
      eventTime, // formatted time from the form
      eventDescription,
      // userId, // Creator's ID
      assignVolunteer, // Array of volunteer IDs
    } = eventData;

    // Step 1: Update the event data in the 'events' table
    const { data: updatedEvent, error: eventError } = await supabase
      .from("events")
      .update({
        event_name: eventName,
        event_category: eventCategory,
        event_visibility: eventVisibility,
        ministry: ministry || null, // Ministry is optional
        event_date: eventDate, // formatted date (yyyy-MM-dd)
        event_time: eventTime, // formatted time (HH:mm:ss)
        event_description: eventDescription || null, // Optional field
      })
      .eq("id", eventId) // Update the event with the matching ID
      .select("id") // Return the updated event ID
      .single(); // Return single object

    if (eventError) {
      throw new Error(eventError.message); // Handle any errors
    }

    // Step 2: Remove all existing volunteer assignments for the event
    const { error: removeError } = await supabase
      .from("event_volunteers")
      .delete()
      .eq("event_id", eventId); // Remove all existing volunteer assignments for the event

    if (removeError) {
      throw new Error(removeError.message); // Handle any errors
    }

    // Step 3: Insert new volunteer assignments (if any volunteers are selected)
    if (assignVolunteer?.length > 0) {
      const volunteerData = assignVolunteer.map((volunteerId) => ({
        event_id: eventId, // Use the event ID to assign volunteers
        volunteer_id: volunteerId,
      }));

      const { error: volunteerError } = await supabase
        .from("event_volunteers")
        .insert(volunteerData);

      if (volunteerError) {
        throw new Error(volunteerError.message); // Handle any errors
      }
    }

    return { success: true, data: updatedEvent }; // Return success structure
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: error.message }; // Return error structure
  }
};

// Function to fetch all events (optionally filter by date, creator, etc.)
export const getEvents = async ({
  startDate,
  endDate,
  page = 1,
  pageSize,

  user,
} = {}) => {
  try {
    const filters = {};

    // Apply startDate and endDate filters
    if (startDate) {
      filters.gte = startDate;
    }

    if (endDate) {
      filters.lte = endDate;
    }

    let nonAdminEventIds = [];

    // Check if user is a volunteer and apply filters
    if (user && user.role !== ROLES[0]) {
      // assuming ROLES[0] is admin

      const { data: volunteerEvents, error: volunteerError } = await supabase
        .from("event_volunteers")
        .select("*")
        .eq("volunteer_id", user.id);

      if (volunteerError) {
        throw new Error(volunteerError.message);
      }

      nonAdminEventIds = volunteerEvents.map((event) => event.event_id);

      if (nonAdminEventIds.length > 0) {
        filters.id = nonAdminEventIds; // Apply only the volunteer's events
      }
    }

    // If the user is an admin or has no specific events, apply all events

    // Fetch data using pagination
    const data = await paginate({
      key: "events",
      select: `*, event_volunteers (volunteer_id)`,
      page,
      pageSize,
      filters,
    });

    return data;
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
      console.error("Error fetching event by ID:", error);
      throw new Error(error.message);
    }

    return data;
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

export const fetchEventVolunteers = async (eventId) => {
  try {
    // Query the event_volunteers table for the given event ID
    const { data, error } = await supabase
      .from("event_volunteers")
      .select(
        `
        volunteer_id,
        assigned_at,
        users (
          first_name,
          last_name,
          email
        )
        `
      )
      .eq("event_id", eventId); // Filter by event ID

    if (error) {
      throw new Error(error.message); // Handle errors
    }

    return { success: true, data }; // Return the fetched data
  } catch (error) {
    console.error("Error fetching event volunteers:", error);
    return { success: false, error: error.message }; // Return error structure
  }
};

// Function to fetch parishioner events
export const getParishionerEvents = async ({ page = 1, pageSize } = {}) => {
  try {
    // Get the current date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split("T")[0];

    const data = await paginate({
      key: "events",
      page,
      pageSize,
      order: [{ column: "event_date", ascending: true }],
      filters: {
        gte: { event_date: today }, // Include events with dates greater than or equal to today
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: error.message };
  }
};

export const getWalkInEvents = async () => {
  // Get the current date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // Query the Supabase database for events
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .gte("event_date", today);

  if (error) throw error; // React Query will handle this as a query failure

  return data; // Return the data directly
};
