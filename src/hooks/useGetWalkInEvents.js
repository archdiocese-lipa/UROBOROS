import { useQuery } from "@tanstack/react-query";
import { getWalkInEvents } from "@/services/eventService";

const useGetWalkInEvents = () => {
  return useQuery({
    queryKey: ["walkinevents"], // Unique key for the query
    queryFn: getWalkInEvents, // Function to fetch the events
  });
};

export { useGetWalkInEvents };
