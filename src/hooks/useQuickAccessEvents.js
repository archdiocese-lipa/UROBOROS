import { useQuery } from "@tanstack/react-query";
import { getQuickAccessEvents } from "@/services/eventService";

// The custom hook that uses TanStack Query
const useQuickAccessEvents = () => {
  const {
    data: events, // The data returned by the query
    isLoading, // Boolean for loading state
    isError, // Boolean for error state
    error, // The error object (if any)
  } = useQuery({
    queryKey: ["quick_access_events"], // The query key
    queryFn: getQuickAccessEvents, // The query function
  });

  return { events, isLoading, isError, error };
};

export default useQuickAccessEvents;
