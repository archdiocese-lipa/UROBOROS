import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "@/services/userService"; // Ensure this matches the function name in your service file

const useUsersByRole = (role) => {
  return useQuery({
    queryKey: ["users", role], // Unique key for caching the query based on role
    queryFn: () => getUsersByRole(role), // Correct function from userService
    enabled: !!role, // Query runs only if role is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });
};

export default useUsersByRole;
