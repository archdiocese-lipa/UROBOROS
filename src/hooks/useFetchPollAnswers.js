import { useQuery } from "@tanstack/react-query";
import PollService from "@/services/PollService";

const useFetchPollAnswers = (pollEntries) => {
  return useQuery({
    queryKey: ["pollAnswersCount", pollEntries],
    queryFn: async () => {
      const counts = {};
      const allAnswers = [];

      for (const entry of pollEntries) {
        const answers = await PollService.getPollAnswers(entry.poll_entry_id);
        allAnswers.push({ entryId: entry.poll_entry_id, answers });

        counts[entry.poll_entry_id] = {
          available: answers.filter((a) => a.answer === "available").length,
          unavailable: answers.filter((a) => a.answer === "unavailable").length,
          ifneeded: answers.filter((a) => a.answer === "ifneeded").length,
        };
      }

      return { counts, allAnswers };
    },
    enabled: !!pollEntries,
  });
};

export default useFetchPollAnswers;
