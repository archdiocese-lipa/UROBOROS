import { useMutation, useQueryClient } from "@tanstack/react-query";
import PollService from "@/services/PollService";
import { useToast } from "@/hooks/use-toast";

const useDeletePoll = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pollId) => PollService.deletePoll(pollId),
    onMutate: () => {
      toast({
        title: "Deleting Poll...",
        description: "Your poll is being deleted.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Poll Deleted",
        description: "The poll has been deleted successfully!",
      });
      queryClient.invalidateQueries(["polls"]);
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Poll",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Any cleanup or additional tasks after mutation is done
    },
  });
};

export { useDeletePoll };
