import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const useCreateUser = (onSuccessCallback) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast({
        title: "Creating Profile...",
        description: "Your profile is being created.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Created Successfully",
        description: "New profile has been created.",
      });

      // Invalidate the 'users' query so the list of users is refetched after creating the profile
      queryClient.invalidateQueries(["users"]);

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      toast({
        title: "Error Creating Profile",
        description:
          error.message ||
          "There was an issue creating the profile. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Optional: Additional logic after mutation is settled (e.g., cleanup)
    },
  });

  return mutation;
};

export default useCreateUser;
