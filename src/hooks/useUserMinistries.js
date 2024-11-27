import { useQuery } from "@tanstack/react-query";
import { fetchUserMinistries } from "../services/ministryService"; // Import the service function
import { useUser } from "@/context/useUser"; // Import the context hook to get user data

const useUserMinistries = () => {
  const { userData } = useUser(); // Get userData from the context

  const {
    data: ministries,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userMinistries", userData?.id], // Cache key depends on user ID
    queryFn: () => fetchUserMinistries(userData), // Pass userData as a parameter
    enabled: !!userData, // Only run the query if userData is available
    onError: (err) => {
      console.error("Error in useQuery:", err);
    },
  });

  return {
    ministries,
    error,
    isLoading,
  };
};

export default useUserMinistries;
