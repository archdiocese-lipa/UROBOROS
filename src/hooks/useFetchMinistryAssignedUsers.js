import { useQuery } from "@tanstack/react-query";
import { fetchMinistryAssignedUsers } from "@/services/ministryService";

export const useFetchMinistryAssignedUsers = (ministryId) => {
  return useQuery({
    queryKey: ["ministryAssignedUsers", ministryId], // Unique key to identify this query
    queryFn: () => fetchMinistryAssignedUsers(ministryId), // Function to fetch the data
    enabled: !!ministryId, // Only run the query if a ministryId is provided
    onError: (error) => {
      console.error("Error fetching ministry assigned users:", error.message);
    },
  });
};
