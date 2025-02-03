import { useQuery } from "@tanstack/react-query";
import PollService from "@/services/PollService";

const useFetchPollAnswers = (pollEntryId) => {
  return useQuery({
    queryKey: ["pollAnswers", pollEntryId],
    queryFn: () => PollService.getPollAnswers(pollEntryId),
    enabled: !!pollEntryId, // Only run the query if pollEntryId is provided
  });
};

export default useFetchPollAnswers;
