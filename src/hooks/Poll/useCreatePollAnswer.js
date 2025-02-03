import { useMutation, useQueryClient } from "@tanstack/react-query";
import PollService from "@/services/PollService";
import { useToast } from "@/hooks/use-toast";

const useCreatePollAnswer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pollAnswerData) =>
      PollService.createPollAnswer(pollAnswerData),
    onMutate: () => {
      toast({
        title: "Submitting Answer...",
        description: "Your answer is being submitted.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Answer Submitted",
        description: "Your answer has been submitted successfully!",
      });
      queryClient.invalidateQueries(["pollAnswers"]);
    },
    onError: (error) => {
      toast({
        title: "Error Submitting Answer",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Any cleanup or additional tasks after mutation is done
    },
  });
};

export { useCreatePollAnswer };
