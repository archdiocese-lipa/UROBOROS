import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeeting } from "@/services/meetingService";
import { useToast } from "@/hooks/use-toast";

const useCreateMeeting = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Accessing the query client

  // Ensure correct function signature
  const mutation = useMutation({
    mutationFn: createMeeting,
    onMutate: () => {
      toast({
        title: "Creating Meeting...",
        description: "Your meeting is being created.",
      });
    },
    onSuccess: () => {
      // Optionally invalidate or update queries here
      toast({
        title: "Meeting Created",
        description: `The meeting has been created successfully!`,
      });

      // Invalidate the 'meetings' query to refetch after a new meeting is created
      queryClient.invalidateQueries(["meetings"]);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Meeting",
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

export default useCreateMeeting;
