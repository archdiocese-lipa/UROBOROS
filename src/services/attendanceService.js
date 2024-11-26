import { supabase } from "@/services/supabaseClient"; // Adjust the import to match the final location of supabaseClient

export const insertEventAttendance = async (submittedData) => {
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
    .select(); // Return the inserted ticket's ticket_code

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
  }));

  const childrenRecords = children.map((child) => ({
    first_name: child.childFirstName,
    last_name: child.childLastName,
    family_id: familyId[0].id,
  }));

  const { data: parentsData, error: parentsError } = await supabase
    .from("parents")
    .upsert(parentRecords)
    .select();

  if (parentsError) {
    console.error("Error inserting parent records:", parentsError.message);
    return { success: false, error: parentsError };
  }

  const { data: childrenData, error: childrenError } = await supabase
    .from("children")
    .upsert(childrenRecords)
    .select();

  if (childrenError) {
    console.error("Error inserting child records:", childrenError.message);
    return { success: false, error: childrenError };
  }

  // Add the type property to each item in the parentsData and childrenData arrays
  const parentsWithType = parentsData.map((parent) => ({
    ...parent,
    type: "parents",
  }));

  const childrenWithType = childrenData.map((child) => ({
    ...child,
    type: "children",
  }));

  // Combine the arrays into a single attendeesData array
  const attendeesData = [
    // ...walkInUser.map((user) => ({ ...user, type: "walk_in_users" })),
    ...parentsWithType,
    ...childrenWithType,
  ];

  const { data: attendanceData, error: attendanceError } = await supabase
    .from("attendance")
    .insert(
      attendeesData.map((attendee) => ({
        event_id: event,
        attendee_id: attendee.id,
        attendee_type: attendee.type,
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
    // Fetch the attendance records
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("event_id", eventId);

    if (attendanceError) {
      console.error("Error fetching attendance data:", attendanceError);
      return { success: false, error: attendanceError.message };
    }

    // Initialize arrays to hold the IDs for each type
    const parentIds = [];
    const childIds = [];
    // const userIds = [];
    // const walkInUserIds = [];

    // Populate the arrays based on the attendee_type
    attendanceData.forEach((record) => {
      if (record.attendee_type === "parents") {
        parentIds.push(record.attendee_id);
      } else if (record.attendee_type === "children") {
        childIds.push(record.attendee_id);
        // } else if (record.attendee_type === "users") {
        //   userIds.push(record.attendee_id);
        // } else if (record.attendee_type === "walk_in_users") {
        //   walkInUserIds.push(record.attendee_id);
      }
    });

    // Fetch the related records based on the IDs
    const [parentsData, childrenData, _usersData, _walkInUsersData] =
      await Promise.all([
        supabase.from("parents").select("*").in("id", parentIds),
        supabase.from("children").select("*").in("id", childIds),
        // supabase.from("users").select("*").in("id", userIds),
        // supabase.from("walk_in_users").select("*").in("id", walkInUserIds),
      ]);

    // Combine the results
    const combinedData = attendanceData.map((record) => {
      let attendee = null;
      if (record.attendee_type === "parents") {
        attendee = parentsData.data.find(
          (parent) => parent.id === record.attendee_id
        );
      } else if (record.attendee_type === "children") {
        attendee = childrenData.data.find(
          (child) => child.id === record.attendee_id
        );
        // } else if (record.attendee_type === "users") {
        //   attendee = usersData.data.find(
        //     (user) => user.id === record.attendee_id
        //   );
        // } else if (record.attendee_type === "walk_in_users") {
        //   attendee = walkInUsersData.data.find(
        //     (walkInUser) => walkInUser.id === record.attendee_id
        //   );
      }

      // Spread the attendee object properties and remove the attendee.id property
      const { id: _unused_id, ...attendeeWithoutId } = attendee || {};

      console.log({
        ...record,
        ...attendeeWithoutId,
      });

      return {
        ...record,
        ...attendeeWithoutId,
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching event attendance:", error);
    return { success: false, error: error.message };
  }
};

export { getEventAttendance };
