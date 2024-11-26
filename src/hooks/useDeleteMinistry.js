import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMinistry } from "@/services/ministryService"; // your delete function

export const useDeleteMinistry = () => {
  const queryClient = useQueryClient(); // Access to queryClient
  const mutation = useMutation({
    mutationFn: deleteMinistry, // Function to delete the ministry
    onSuccess: () => {
      queryClient.invalidateQueries(["ministries"]); // Invalidate and refetch
    },
  });
  return mutation;
};
