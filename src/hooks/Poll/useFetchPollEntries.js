import { useQuery } from "@tanstack/react-query";
import PollService from "@/services/PollService";

const useFetchPollEntries = (pollId) => {
  return useQuery({
    queryKey: ["pollEntries", pollId],
    queryFn: () => PollService.getPollEntries(pollId),
    enabled: !!pollId, // Only run the query if pollId is provided
  });
};

export default useFetchPollEntries;
