import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMinistry } from "@/services/ministryService"; // your update function

export const useUpdateMinistry = () => {
  const queryClient = useQueryClient(); // Access to queryClient
  const mutation = useMutation({
    mutationFn: updateMinistry, // Function to update the ministry
    onSuccess: () => {
      queryClient.invalidateQueries(["ministries"]); // Invalidate and refetch
    },
  });
  return mutation;
};
