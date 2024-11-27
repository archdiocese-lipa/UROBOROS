import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMinistryVolunteer } from "@/services/ministryService"; // Assuming this function exists
import { useToast } from "@/hooks/use-toast"; // Custom hook for toast notifications

const useRemoveMinistryVolunteer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Accessing the query client

  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: ({ ministryId, memberId }) =>
      removeMinistryVolunteer(ministryId, memberId), // Function to remove volunteer
    onMutate: () => {
      toast({
        title: "Removing Volunteer...",
        description: "The volunteer is being removed from the ministry.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Volunteer Removed",
        description: "The volunteer has been removed successfully.",
      });

      // Invalidate the 'ministries' and 'ministryMembers' queries so they are refetched after the mutation
      queryClient.invalidateQueries(["ministries"]);
      queryClient.invalidateQueries(["ministryMembers"]);
    },
    onError: (error) => {
      toast({
        title: "Error Removing Volunteer",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Optional: Additional logic after mutation is settled (e.g., cleanup)
    },
  });

  return {
    removeVolunteer: mutate, // Function to trigger the mutation
    isLoading, // Loading state
    isSuccess, // Success state
    isError, // Error state
    error, // Error message
  };
};

export default useRemoveMinistryVolunteer;
