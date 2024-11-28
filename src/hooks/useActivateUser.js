import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateUser } from "@/services/userService"; // Import the service function
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast hook for notifications

const useActivateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: activateUser,
    onMutate: () => {},
    onSuccess: () => {
      toast({
        title: "User Activated",
        description: `The user has been activated successfully!`,
      });

      queryClient.invalidateQueries(["users-list"]);
    },
    onError: (error) => {
      toast({
        title: "Error Activating User",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {},
  });

  return mutation;
};

export default useActivateUser;
