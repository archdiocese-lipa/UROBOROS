import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMinistry } from "@/services/ministryService"; // The function that makes the update request
import { useToast } from "@/hooks/use-toast"; // Toast notifications for feedback

export const useEditMinistry = () => {
  const queryClient = useQueryClient(); // Access to queryClient for cache management
  const { toast } = useToast(); // Toast notifications for feedback

  const mutation = useMutation({
    mutationFn: editMinistry, // The function to edit the ministry
    onSuccess: () => {
      // Invalidate the "ministries" query to refetch updated data
      queryClient.invalidateQueries(["ministries"]);

      toast({
        title: "Ministry Updated",
        description: "The ministry has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Ministry",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
};
