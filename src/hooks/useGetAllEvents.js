import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/services/eventService"; // Ensure the correct path to your service file

const useGetAllEvents = () => {
  return useQuery({
    queryKey: ["events"], // Unique key for the query
    queryFn: getEvents, // Function to fetch the events
  });
};

export { useGetAllEvents };
