import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMeeting } from "@/services/meetingService"; // You need to implement this function in your services
import { useToast } from "@/hooks/use-toast";

const useDeleteMeeting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Accessing the query client

  const mutation = useMutation({
    mutationFn: deleteMeeting, // Assuming deleteMeeting is the service function
    onMutate: () => {
      toast({
        title: "Deleting Meeting...",
        description: "Your meeting is being deleted.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Meeting Deleted",
        description: `The meeting has been deleted successfully.`,
      });

      // Optionally invalidate or update queries here
      queryClient.invalidateQueries(["meetings"]); // Assuming meetings is the relevant query to be invalidated
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Meeting",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Any cleanup or additional tasks after mutation is done
    },
  });

  return mutation;
};

export default useDeleteMeeting;
