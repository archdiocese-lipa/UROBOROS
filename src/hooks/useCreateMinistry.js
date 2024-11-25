import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMinistry } from "@/services/ministryService";
import { useToast } from "@/hooks/use-toast";

export const useCreateMinistry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createMinistry,
    onMutate: () => {
      toast({
        title: "Creating Ministry...",
        description: "Your ministry is being created.",
        variant: "info",
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch ministries list to reflect the new entry
      queryClient.invalidateQueries(["ministries"]);

      toast({
        title: "Ministry Created",
        description: `The ministry "${data.ministry_name}" has been created successfully!`,
        variant: "success",
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
    onSettled: () => {
      // Optional: Add any additional logic after the mutation settles
    },
  });

  return mutation;
};

export default useCreateMinistry;
