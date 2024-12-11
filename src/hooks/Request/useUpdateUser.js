import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const useUpdateUser = (onSuccessCallback) => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Accessing the query client

  // React Query mutation for updating a user
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onMutate: () => {
      toast({
        title: "Updating Profile...",
        description: "Your profile is being updated.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated Successfully",
        description: "The profile has been updated.",
      });

      // Invalidate the 'users' query so the list of users is refetched after updating the profile
      queryClient.invalidateQueries(["users"]);

      // Call the onSuccess callback to close the dialog
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast({
        title: "Error Updating Profile",
        description:
          error.message ||
          "There was an issue updating the profile. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Optional: Additional logic after mutation is settled (e.g., cleanup)
    },
  });

  return mutation;
};

export default useUpdateUser;
