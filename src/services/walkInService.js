import { supabase } from "./supabaseClient";

export const handleWalkInData = async ({
  eventId,
  ticketCode, // The ticketCode passed in the function parameters
  parents,
  children,
}) => {
  try {
    // Delete all records for the given ticket code
    const { error: deleteError } = await supabase
      .from("attendance")
      .delete()
      .eq("registration_code", ticketCode); // Delete by ticketCode

    if (deleteError) {
      console.error("Error deleting existing records:", deleteError);
      throw deleteError;
    }

    // Prepare parent records with registration_code
    const parentRecords = parents.map((parent) => ({
      event_id: eventId,
      registration_code: ticketCode,
      first_name: parent.first_name, // Using correct field from the logged data
      last_name: parent.last_name, // Using correct field from the logged data
      contact_number: parent.contact_number, // Correct field name from the logged data
      attendee_type: "parents", // Correct attendee_type
      main_applicant: parent.main_applicant, // Correct field name for main applicant
    }));

    // Log prepared parent records

    // Prepare child records with registration_code
    const childRecords = children.map((child) => ({
      event_id: eventId,
      registration_code: ticketCode,
      first_name: child.first_name, // Correct field from the logged data
      last_name: child.last_name, // Correct field from the logged data
      attendee_type: "children", // Correct attendee_type
      main_applicant: child.main_applicant, // Correct field for main applicant (false for children)
    }));

    // Log prepared child records

    // Combine all records to insert
    const allRecords = [...parentRecords, ...childRecords];

    // Log combined records

    // Insert all new records
    const { error: insertError } = await supabase
      .from("attendance")
      .insert(allRecords);

    if (insertError) {
      console.error("Error inserting new records:", insertError);
      throw insertError;
    }
  } catch (error) {
    console.error("Error handling walk-in data:", error);
    throw error;
  }
};
