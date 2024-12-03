import { supabase } from "./supabaseClient";
export const handleWalkInData = async ({
  eventId,
  ticketCode,
  parents,
  children,
  removedParents = [],
  removedChildren = [],
}) => {
  try {
    // Prepare parent records with ticket_code
    const parentRecords = parents.map((parent) => ({
      event_id: eventId,
      ticket_code: ticketCode,
      first_name: parent.parentFirstName,
      last_name: parent.parentLastName,
      contact_number: parent.parentContactNumber,
      type: "parent",
      is_main_applicant: parent.isMainApplicant,
      id: parent.id, // Ensure ID is passed here for update
    }));

    // Prepare child records with ticket_code
    const childRecords = children.map((child) => ({
      event_id: eventId,
      ticket_code: ticketCode,
      first_name: child.childFirstName,
      last_name: child.childLastName,
      type: "child",
      is_main_applicant: false, // Children are not main applicants
      id: child.id, // Ensure ID is passed here for update
    }));

    // Combine all records to insert or update
    const allRecords = [...parentRecords, ...childRecords];

    // Insert or update records in the database
    for (const record of allRecords) {
      if (record.id) {
        // Existing record - Update
        const { error: updateError } = await supabase
          .from("attendance")
          .update({
            first_name: record.first_name,
            last_name: record.last_name,
            contact_number: record.contact_number,
            is_main_applicant: record.is_main_applicant,
            event_id: record.event_id,
            ticket_code: record.ticket_code,
          })
          .eq("id", record.id);

        if (updateError) throw updateError;
      } else {
        // New record - Insert
        const { error: insertError } = await supabase
          .from("attendance")
          .insert({
            event_id: record.event_id,
            ticket_code: record.ticket_code,
            first_name: record.first_name,
            last_name: record.last_name,
            contact_number: record.contact_number,
            is_main_applicant: record.is_main_applicant,
            type: record.type,
          });

        if (insertError) throw insertError;
      }
    }

    // Handle removed parents
    for (const removedParent of removedParents) {
      const { error: deleteParentError } = await supabase
        .from("attendance")
        .delete()
        .eq("id", removedParent.id);

      if (deleteParentError) {
        console.error(
          "Error deleting parent:",
          removedParent.id,
          deleteParentError
        );
        throw deleteParentError;
      }
    }

    // Handle removed children
    for (const removedChild of removedChildren) {
      const { error: deleteChildError } = await supabase
        .from("attendance")
        .delete()
        .eq("id", removedChild.id);

      if (deleteChildError) {
        console.error(
          "Error deleting child:",
          removedChild.id,
          deleteChildError
        );
        throw deleteChildError;
      }
    }
  } catch (error) {
    console.error("Error handling walk-in data:", error);
    throw error;
  }
};
