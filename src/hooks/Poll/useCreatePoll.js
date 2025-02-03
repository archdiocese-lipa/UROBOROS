import { useMutation, useQueryClient } from "@tanstack/react-query";
import PollService from "@/services/PollService";
import { useToast } from "@/hooks/use-toast";

const useCreatePoll = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pollData, pollEntries }) =>
      PollService.createPollWithEntries(pollData, pollEntries),
    onMutate: () => {
      toast({
        title: "Creating Poll...",
        description: "Your poll is being created.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Poll Created",
        description: "The poll has been created successfully!",
      });
      queryClient.invalidateQueries(["polls"]);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Poll",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Any cleanup or additional tasks after mutation is done
    },
  });
};

export default useCreatePoll;
