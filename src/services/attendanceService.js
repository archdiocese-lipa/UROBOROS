import { supabase } from "@/services/supabaseClient"; // Adjust the import to match the final location of supabaseClient
import { v4 as uuidv4 } from "uuid";
const insertEventAttendance = async (submittedData) => {
  const { randomSixDigit, event, parents, children } = submittedData;

  // get main applicant parent.
  const mainApplicant = parents.find((parent) => parent.isMainApplicant);

  // Insert into the tickets table (this table tracks the tickets themselves)
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert([
      {
        event_id: event, // Foreign key for the event
        ticket_code: randomSixDigit, // Unique ticket code (generated six-digit number)
        timestamp: new Date(), // Automatically handled by the database
      },
    ])
    .select();

  if (ticketError) {
    console.error("Error inserting ticket record:", ticketError.message);
    return { success: false, error: ticketError };
  }

  const { data: walkInUser, error: walkInUserError } = await supabase
    .from("walk_in_users")
    .insert({
      registration_id: ticket[0].ticket_id,
      first_name: mainApplicant.parentFirstName,
      last_name: mainApplicant.parentLastName,
      contact_number: mainApplicant.parentContactNumber,
    })
    .select();

  if (walkInUserError) {
    console.error(
      "Error inserting walk-in user record:",
      walkInUserError.message
    );
    return { success: false, error: walkInUserError };
  }

  const { data: familyId, error: familyError } = await supabase
    .from("family_group")
    .insert({
      walk_in_user_id: walkInUser[0].id,
    })
    .select("id");

  if (familyError) {
    console.error("Error inserting family group record:", familyError.message);
    return { success: false, error: familyError };
  }

  // Prepare parent records with ticket_code
  const parentRecords = parents.map((parent) => ({
    first_name: parent.parentFirstName,
    last_name: parent.parentLastName,
    contact_number: parent.parentContactNumber,
    family_id: familyId[0].id,
    main_applicant:
      mainApplicant &&
      parent.parentFirstName === mainApplicant.parentFirstName &&
      parent.parentLastName === mainApplicant.parentLastName,
    type: "parents",
    registration_code: randomSixDigit,
  }));

  const childrenRecords = children.map((child) => ({
    first_name: child.childFirstName,
    last_name: child.childLastName,
    family_id: familyId[0].id,
    type: "children",
    main_applicant: false,
    registration_code: randomSixDigit,
  }));

  // Combine the arrays into a single attendeesData array
  const attendeesData = [...parentRecords, ...childrenRecords];
  const { data: attendanceData, error: attendanceError } = await supabase
    .from("attendance")
    .insert(
      attendeesData.map((attendee) => ({
        event_id: event,
        attendee_id: attendee.id,
        attendee_type: attendee.type,
        main_applicant:
          attendee.type === "parents" ? attendee.main_applicant : null,
        first_name: attendee.first_name,
        last_name: attendee.last_name,
        contact_number: attendee.contact_number,
        family_id: attendee.family_id,
        registration_code: attendee.registration_code,
      }))
    );

  if (attendanceError) {
    console.error(
      "Error inserting attendance records:",
      attendanceError.message
    );
    return { success: false, error: attendanceError };
  }
  return { success: true, attendanceData };
};

// const { data: parentsData, error: parentsError } = await supabase
//   .from("parents")
//   .upsert(parentRecords)
//   .select();

// if (parentsError) {
//   console.error("Error inserting parent records:", parentsError.message);
//   return { success: false, error: parentsError };
// }

// const { data: childrenData, error: childrenError } = await supabase
//   .from("children")
//   .upsert(childrenRecords)
//   .select();

// if (childrenError) {
//   console.error("Error inserting child records:", childrenError.message);
//   return { success: false, error: childrenError };
// }

// // Add the type property to each item in the parentsData and childrenData arrays
// const parentsWithType = parentsData.map((parent) => ({
//   ...parent,
//   type: "parents",
//   main_applicant:
//     mainApplicant &&
//     parent.first_name === mainApplicant.parentFirstName &&
//     parent.last_name === mainApplicant.parentLastName,
//   contact_number: mainApplicant.contact_number, // Check the main applicant in walk in registration
// }));

// const childrenWithType = childrenData.map((child) => ({
//   ...child,
//   type: "children",
//   main_applicant: null,
// }));

const getEventAttendance = async (eventId) => {
  try {
    // Fetch attendance records for the given event
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("event_id", eventId);

    if (attendanceError) {
      console.error("Error fetching attendance data:", attendanceError);
      return { success: false, error: attendanceError.message };
    }

    if (!attendanceData || attendanceData.length === 0) {
      return { success: true, data: [] }; // Return empty if no attendance
    }

    // Group attendance data by family_id
    const groupedData = attendanceData.reduce((acc, record) => {
      const { family_id, attendee_type } = record;

      // Find or create a family group
      let familyGroup = acc.find((group) => group.family_id === family_id);
      if (!familyGroup) {
        familyGroup = {
          family_id,
          family_surname: record.last_name || "Unknown",
          parents: [],
          children: [],
        };
        acc.push(familyGroup);
      }

      // Categorize attendees by type
      if (attendee_type === "parents") {
        familyGroup.parents.push(record);
      } else if (attendee_type === "children") {
        familyGroup.children.push(record);
      }

      return acc;
    }, []);

    return { success: true, data: groupedData };
  } catch (error) {
    console.error("Error fetching event attendance:", error);
    return { success: false, error: error.message };
  }
};

// Insert main applicant
export const insertMainApplicant = async (guardiansData) => {
  try {
    // Check for existing main_applicant entries before upserting
    const { data: existingRecords, error: checkError } = await supabase
      .from("attendance")
      .select("attendee_id, event_id")
      .in(
        "attendee_id",
        guardiansData.map((guardian) => guardian.attendee_id)
      )
      .in(
        "event_id",
        guardiansData.map((guardian) => guardian.event_id)
      );

    if (checkError) {
      throw new Error(checkError.message);
    }

    // Filter out any guardians who are already registered as main applicants
    const newGuardiansData = guardiansData.filter((guardian) => {
      return !existingRecords.some(
        (record) =>
          record.attendee_id === guardian.attendee_id &&
          record.event_id === guardian.event_id
      );
    });

    // Only upsert the new guardians if there are any
    if (newGuardiansData.length > 0) {
      const { data, error } = await supabase.from("attendance").upsert(
        newGuardiansData.map((guardian) => ({
          event_id: guardian.event_id,
          attendee_id: guardian.attendee_id,
          attendee_type: guardian.attendee_type,
          attended: guardian.attended,
          main_applicant: guardian.main_applicant,
          first_name: guardian.first_name,
          last_name: guardian.last_name,
          contact_number: guardian.contact_number,
          family_id: guardian.family_id,
          registration_code: guardian.registration_code,
        }))
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } else {
      // No new guardians to insert, return a message or handle it silently
      return null;
    }
  } catch (error) {
    console.error("Error adding guardian", error);
    // Do not throw the error to avoid breaking the flow
    return null;
  }
};

// Parishioner insert family/guardian
export const insertGuardians = async (guardiansData) => {
  // Step 1: Check for existing attendance
  const guardianIds = guardiansData.map((guardian) => guardian.id);
  const { data: existingEntries, error: fetchError } = await supabase
    .from("attendance")
    .select("attendee_id, event_id")
    .in("attendee_id", guardianIds)
    .eq("attended", false);

  // If there was an error fetching existing entries, throw it
  if (fetchError) throw new Error(fetchError.message);

  // Step 2: Identify duplicates
  const duplicateIds = existingEntries
    .filter((entry) =>
      guardiansData.some(
        (guardian) =>
          guardian.id === entry.attendee_id &&
          guardian.event_id === entry.event_id
      )
    )
    .map((entry) => entry.attendee_id);

  if (duplicateIds.length > 0) {
    throw new Error("Some guardians have already attended this event.");
  }

  // Insert guardians
  const { data, error } = await supabase
    .from("attendance")
    .upsert(
      guardiansData.map((guardian) => ({
        attendee_id: guardian.id,
        event_id: guardian.event_id,
        attendee_type: guardian.attendee_type,
        attended: guardian.attended,
        main_applicant: guardian.main_applicant,
        first_name: guardian.first_name,
        last_name: guardian.last_name,
        contact_number: guardian.contact_number,
        family_id: guardian.family_id,
      }))
    )
    .select();

  // If there was an error inserting guardians, throw it
  if (error) throw new Error(error.message);

  return data;
};

// Parishioner insert children
export const insertChildren = async (childrenData) => {
  // Step 1: Check for existing attendance
  const childrenIds = childrenData.map((child) => child.id);
  const { data: existingEntries, error: fetchError } = await supabase
    .from("attendance")
    .select("attendee_id, event_id")
    .in("attendee_id", childrenIds)
    .eq("attended", false);

  // If there was an error fetching existing entries, throw it
  if (fetchError) throw new Error(fetchError.message);

  // Step 2: Identify duplicates
  const duplicateIds = existingEntries
    .filter((entry) =>
      childrenData.some(
        (child) =>
          child.id === entry.attendee_id && child.event_id === entry.event_id
      )
    )
    .map((entry) => entry.attendee_id);

  if (duplicateIds.length > 0) {
    throw new Error("Some child have already attended this event.");
  }

  // Insert guardians
  const { data, error } = await supabase
    .from("attendance")
    .upsert(
      childrenData.map((child) => ({
        attendee_id: child.id,
        event_id: child.event_id,
        attendee_type: child.attendee_type,
        attended: child.attended,
        main_applicant: child.main_applicant,
        first_name: child.first_name,
        last_name: child.last_name,
        family_id: child.family_id,
        registration_code: child.registration_code,
      }))
    )
    .select();

  // If there was an error inserting children, throw it
  if (error) throw new Error(error.message);

  return data;
};

const fetchAttendeesByTicketCode = async (registrationCode) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select(
        `
        *,
        events:events (
          id,
          event_name,
          event_date,
          event_time
        )
      `
      )
      .eq("registration_code", registrationCode);

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Separate parents and children based on `attendee_type`
      const parents = data
        .filter((item) => item.attendee_type === "parents")
        .map((parent) => ({
          id: parent.id,
          firstName: parent.first_name,
          lastName: parent.last_name,
          contactNumber: parent.contact_number,
          isMainApplicant: parent.main_applicant,
        }));

      const children = data
        .filter((item) => item.attendee_type === "children")
        .map((child) => ({
          id: child.id,
          firstName: child.first_name,
          lastName: child.last_name,
        }));

      // Extract event information from the first record (assuming all entries belong to the same event)
      const event = data[0].events;
      const registrationCode = data[0].registration_code;

      const transformedData = {
        registrationCode,
        event: {
          id: event.id,
          name: event.event_name,
        },
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
    return { success: false, error: error.message };
  }
};

const updateAttendeeStatus = async (attendeeID, state) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .update({ attended: state })
      .eq("id", attendeeID)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error(error);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const countEventAttendance = async (eventId) => {
  try {
    const { count: totalCount, error } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    // Count rows with attended set to true for the same event_id
    const { count: attendedCount, error: attendedError } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("attended", true);

    if (attendedError) {
      console.error(attendedError);
      throw new Error(attendedError.message);
    }

    return { total: totalCount, attended: attendedCount };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
// Function to submit add new record in schedule
const insertNewRecord = async (submittedData) => {
  const { event, parents, children } = submittedData;

  const familyId = uuidv4();
  // get main applicant parent.
  const mainApplicant = parents.find((parent) => parent.isMainApplicant);

  // Prepare parent records with ticket_code
  const parentRecords = parents.map((parent) => ({
    first_name: parent.parentFirstName,
    last_name: parent.parentLastName,
    contact_number: parent.parentContactNumber,
    main_applicant:
      mainApplicant &&
      parent.parentFirstName === mainApplicant.parentFirstName &&
      parent.parentLastName === mainApplicant.parentLastName,
    type: "parents",
    family_id: familyId,
  }));

  const childrenRecords = children.map((child) => ({
    first_name: child.childFirstName,
    last_name: child.childLastName,
    type: "children",
    main_applicant: false,
    family_id: familyId,
  }));

  // Combine the arrays into a single attendeesData array
  const attendeesData = [...parentRecords, ...childrenRecords];
  const { data: attendanceData, error: attendanceError } = await supabase
    .from("attendance")
    .insert(
      attendeesData.map((attendee) => ({
        event_id: event,
        attendee_id: attendee.id,
        attendee_type: attendee.type,
        main_applicant:
          attendee.type === "parents" ? attendee.main_applicant : false,
        first_name: attendee.first_name,
        last_name: attendee.last_name,
        contact_number: attendee.contact_number,
        family_id: attendee.family_id,
        registration_code: attendee.registration_code,
      }))
    );

  if (attendanceError) {
    console.error(
      "Error inserting attendance records:",
      attendanceError.message
    );
    return { success: false, error: attendanceError };
  }
  return { success: true, attendanceData };
};

const editAttendee = async({firstName,lastName, contact,attendeeId}) => {
  

  const {error} =  await supabase.from("attendance").update({
    first_name:firstName,
    last_name: lastName,
    contact_number:contact ?? null
  }).eq("id",attendeeId)

  if(error){
    throw new Error(error.message)
  }
}

export {
  editAttendee,
  getEventAttendance,
  fetchAttendeesByTicketCode,
  insertEventAttendance,
  updateAttendeeStatus,
  countEventAttendance,
  insertNewRecord,
};
