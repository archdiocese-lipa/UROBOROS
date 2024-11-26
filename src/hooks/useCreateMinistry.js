import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMinistry } from "@/services/ministryService"; // your mutation function
import { useToast } from "@/hooks/use-toast"; // for notifications

export const useCreateMinistry = () => {
  const queryClient = useQueryClient(); // Access to queryClient for cache management
  const { toast } = useToast(); // Toast notifications

  const mutation = useMutation({
    mutationFn: createMinistry, // The function to create the ministry
    onSuccess: () => {
      // Invalidate the "ministries" query to refetch data
      queryClient.invalidateQueries(["ministries"]);

      toast({
        title: "Ministry Created",
        description: `The ministry has been created successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Ministry",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
};
