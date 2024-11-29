import { useQuery } from "@tanstack/react-query";
import { getEvents, getAllEvents } from "@/services/eventService"; 

const useGetAllEvents = () => {
  return useQuery({
    queryKey: ["events"], 
    queryFn: getEvents, 
  });
};

// For full calendar in dashboard
const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"], 
    queryFn: getAllEvents,
  });
};


export { useGetAllEvents, useGetEvents };
