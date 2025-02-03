import { useState } from "react";
import PollService from "@/services/PollService";

export const useFetchUserAnswers = () => {
  const [userAnswers, setUserAnswers] = useState([]);

  const fetchUserAnswers = async (pollEntries, userId) => {
    const entryIds = pollEntries?.map((entry) => entry.poll_entry_id);

    console.log({
      userId,
      entryIds,
    });

    const fetchedUserAnswers = await Promise.all(
      entryIds.map((entryId) =>
        PollService.getPollAnswersByUser(entryId, userId)
      )
    );

    setUserAnswers(fetchedUserAnswers.flat());
    console.log("User Answers:", fetchedUserAnswers);
  };

  return { userAnswers, fetchUserAnswers };
};
