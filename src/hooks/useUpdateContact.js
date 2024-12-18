import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContact } from "@/services/authService"; // The function that makes the update request
import { useToast } from "@/hooks/use-toast"; // Toast notifications for feedback

export const useUpdateContact = () => {
  const queryClient = useQueryClient(); // Access to queryClient for cache management
  const { toast } = useToast(); // Toast notifications for feedback

  const mutation = useMutation({
    mutationFn: ({ userId, newContactNumber }) =>
      updateContact(userId, newContactNumber), // Function to update contact number
    onSuccess: () => {
      // Invalidate the "users" query to refetch updated user data
      queryClient.invalidateQueries(["fetchUser"]);

      toast({
        title: "Contact Updated",
        description: "The contact number has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Contact",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
};
