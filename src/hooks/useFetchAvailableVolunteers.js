import { useQuery } from "@tanstack/react-query";
import { fetchAvailableVolunteers } from "@/services/ministryService";

const useFetchAvailableVolunteers = (ministryId) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["availableVolunteers", ministryId], // The query key includes the ministryId to make it unique
    queryFn: () => fetchAvailableVolunteers(ministryId), // The fetch function with ministryId
    enabled: !!ministryId, // Only run the query if ministryId is provided
  });

  return {
    availableVolunteers: data || [], // Default to empty array if no data
    loading: isLoading, // Manage loading state
    error, // Error state handled automatically
  };
};

export default useFetchAvailableVolunteers;
