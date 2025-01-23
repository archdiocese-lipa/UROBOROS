import { useMutation } from "@tanstack/react-query";
import { registerCoParent } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const useRegisterCoParent = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: registerCoParent,
    onMutate: () => {
      toast({
        title: "Creating Profile...",
        description: "Your profile is being created.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Created Successfully",
        description:
          "A confirmation has been sent to the email of the co-parent.",
      });
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

export default useRegisterCoParent;
