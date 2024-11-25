import { supabase } from "@/services/supabaseClient"; // Adjust the import to match the final location of supabaseClient

const generateTicketCode = () => {
  // Generates a 6-character alphanumeric string (e.g., ABC123)
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

const checkTicketCodeUnique = async (ticketCode) => {
  // Check if the ticket code already exists in the database
  const { data } = await supabase
    .from("tickets")
    .select("ticket_code")
    .eq("ticket_code", ticketCode);

  return data.length === 0; // Returns true if the code doesn't exist
};

const generateUniqueTicketCode = async () => {
  let ticketCode = generateTicketCode();

  // Ensure the ticket code is unique
  while (!(await checkTicketCodeUnique(ticketCode))) {
    ticketCode = generateTicketCode();
  }

  return ticketCode;
};

export const insertEventAttendance = async (submittedData) => {
  const { event, parents, children } = submittedData;

  // Generate a unique ticket code for this batch
  const ticketCode = await generateUniqueTicketCode();

  // Insert into the tickets table (this table tracks the tickets themselves)
  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .insert([
      {
        event_id: event, // Foreign key for the event
        ticket_code: ticketCode, // Unique ticket code
        timestamp: new Date(), // Automatically handled by the database, if needed
      },
    ])
    .select("ticket_code"); // Return the inserted ticket's ticket_code

  if (ticketError) {
    console.error("Error inserting ticket record:", ticketError.message);
    return { success: false, error: ticketError };
  }

  // Prepare parent records with ticket_code
  const parentRecords = parents.map((parent) => ({
    event_id: event,
    ticket_code: ticketData[0].ticket_code, // Use the inserted ticket code
    first_name: parent.parentFirstName,
    last_name: parent.parentLastName,
    contact_number: parent.parentContactNumber,
    type: "parent",
    is_main_applicant: parent.isMainApplicant,
  }));

  // Prepare child records with ticket_code
  const childRecords = children.map((child) => ({
    event_id: event,
    ticket_code: ticketData[0].ticket_code, // Use the inserted ticket code
    first_name: child.childFirstName,
    last_name: child.childLastName,
    type: "child",
    is_main_applicant: false, // Children are not main applicants
  }));

  // Combine all records
  const allRecords = [...parentRecords, ...childRecords];

  // Insert into the event_attendance table
  const { data, error } = await supabase
    .from("event_attendance")
    .insert(allRecords);

  if (error) {
    console.error("Error inserting event attendance records:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
};

export const fetchAttendeesByTicketCode = async (ticketCode) => {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .select(
        `
            id,
            first_name,
            last_name,
            contact_number,
            ticket_code,
            event_id,
            type,
            is_main_applicant,
            event:events (
              id,
              event_name,
              event_description,
              event_time,
              event_date
            )
          `
      )
      .eq("ticket_code", ticketCode); // Filter by ticket code

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Ensure that the parents and children both include IDs
      const parents = data
        .filter((item) => item.type === "parent")
        .map((parent) => ({
          id: parent.id, // Include parent ID
          parentFirstName: parent.first_name,
          parentLastName: parent.last_name,
          parentContactNumber: parent.contact_number || null,
          isMainApplicant: parent.is_main_applicant,
        }));

      const children = data
        .filter((item) => item.type === "child")
        .map((child) => ({
          id: child.id, // Include child ID
          childFirstName: child.first_name,
          childLastName: child.last_name,
        }));

      const eventInfo = data[0]?.event || {};
      const registrationCode = data[0]?.ticket_code || "";

      const transformedData = {
        registrationCode,
        event: eventInfo.event_name || "Unknown Event",
        eventId: eventInfo.id || "",
        dateTime: `${eventInfo.event_date}T${eventInfo.event_time}Z`,
        parents,
        children,
      };

      return { success: true, data: transformedData };
    } else {
      return {
        success: false,
        message: "No attendees found for this ticket code.",
      };
    }
  } catch (error) {
    console.error("Error fetching attendees and event:", error.message);
    return { success: false, error };
  }
};

const getEventAttendance = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from("event_attendance")
      .select("*")
      .eq("event_id", eventId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching event attendance:", error);
    throw new Error(error.message);
  }
};

export { getEventAttendance };
