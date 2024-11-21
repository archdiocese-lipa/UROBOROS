import { useMutation } from "@tanstack/react-query";
import { createMeeting } from "@/services/meetingService";
import { useToast } from "@/hooks/use-toast";

const useCreateMeeting = () => {
  const { toast } = useToast();

  // Ensure correct function signature
  const mutation = useMutation({
    mutationFn: createMeeting,
    onMutate: () => {
      toast({
        title: "Creating Meeting...",
        description: "Your meeting is being created.",
        variant: "info",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Meeting Created",
        description: `The meeting "${data.meeting_name}" has been created successfully!`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Meeting",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {},
  });

  return mutation;
};

export default useCreateMeeting;
