import { supabase } from "@/services/supabaseClient";

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
