import { supabase } from "@/services/supabaseClient"; // Adjust the import to match the final location of supabaseClient

export const insertEventAttendance = async (submittedData) => {
  const { randomSixDigit, event, parents, children } = submittedData;

  // Insert into the tickets table (this table tracks the tickets themselves)
  const { error: ticketError } = await supabase
    .from("tickets")
    .insert([
      {
        event_id: event, // Foreign key for the event
        ticket_code: randomSixDigit, // Unique ticket code (generated six-digit number)
        timestamp: new Date(), // Automatically handled by the database
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
    ticket_code: randomSixDigit, // Use the generated ticket code
    first_name: parent.parentFirstName,
    last_name: parent.parentLastName,
    contact_number: parent.parentContactNumber,
    type: "parent",
    is_main_applicant: parent.isMainApplicant,
  }));

  // Prepare child records with ticket_code and guardian names
  const childRecords = children.map((child) => {
    const mainApplicant = parents.find((parent) => parent.isMainApplicant);
    return {
      event_id: event,
      ticket_code: randomSixDigit, // Use the generated ticket code
      first_name: child.childFirstName,
      last_name: child.childLastName,
      type: "child",
      is_main_applicant: false, // Children are not main applicants
      guardian_first_name: mainApplicant ? mainApplicant.parentFirstName : null,
      guardian_last_name: mainApplicant ? mainApplicant.parentLastName : null,
    };
  });

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
