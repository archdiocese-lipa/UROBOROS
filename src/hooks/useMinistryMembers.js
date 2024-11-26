import { useQuery } from "@tanstack/react-query"; // Use TanStack Query import
import { fetchMinistryAssignedUsers } from "@/services/ministryService";

// Custom hook to fetch ministry members
const useMinistryMembers = (ministryId) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["ministryMembers", ministryId], // Unique key for caching
    queryFn: () => fetchMinistryAssignedUsers(ministryId), // Function to fetch data
    enabled: !!ministryId, // Only run the query if ministryId is available
  });

  return {
    members: data || [], // Default to an empty array if no data is returned
    loading: isLoading,
    error: error ? error.message : null,
  };
};

export default useMinistryMembers;
