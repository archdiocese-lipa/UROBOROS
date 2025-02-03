import PropTypes from "prop-types";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUser } from "@/context/useUser";
import { useCreatePollAnswer } from "@/hooks/Poll/useCreatePollAnswer";
import { useFetchUserAnswers } from "@/hooks/Poll/useFetchUserAnswers";

const PollAnswerForm = ({ pollId, pollName, pollEntries, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { userData } = useUser(); // Add this line to get user data

  const createPollAnswerMutation = useCreatePollAnswer({
    onSuccess: () => {
      setIsDialogOpen(false);
      onSubmit(pollId, answers);
    },
  });
  const { userAnswers } = useFetchUserAnswers();

  const handleAnswerChange = (entryId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [entryId]: answer,
    }));
  };

  const handleSubmit = () => {
    Object.entries(answers).forEach(([entryId, answer]) => {
      const pollAnswerData = {
        poll_entry_id: entryId, // Correctly reference poll_entry_id
        user_id: userData?.id, // Correctly reference user_id
        answer, // Answer value
      };

      createPollAnswerMutation.mutate(pollAnswerData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          onSubmit(pollId, answers);
        },
      });
    });
  };

  const formatUKDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          Answer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Answer Poll: {pollName}</DialogTitle>
        <DialogDescription>
          {userAnswers.length > 0 && (
            <p className="text-red-500">You have already answered this poll.</p>
          )}
          <Table className="text-gray-600 w-full text-left text-sm">
            <TableHeader>
              <TableRow></TableRow>
              <TableRow>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Time</TableHead>
                <TableHead className="font-medium">Available</TableHead>
                <TableHead className="font-medium">Unavailable</TableHead>
                <TableHead className="font-medium">If Needed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pollEntries?.map((entry) => {
                const existingAnswer = userAnswers.find(
                  (answer) => answer.poll_entry_id === entry.poll_entry_id
                )?.answer;
                return (
                  <TableRow key={entry.poll_entry_id}>
                    <TableCell>{formatUKDate(entry.entry_date)}</TableCell>
                    <TableCell>{formatTime(entry.entry_time)}</TableCell>
                    <TableCell>
                      <input
                        type="radio"
                        name={`answer-${entry.poll_entry_id}`}
                        value="available"
                        checked={
                          existingAnswer
                            ? existingAnswer === "available"
                            : answers[entry.poll_entry_id] === "available"
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            entry.poll_entry_id,
                            e.target.value
                          )
                        }
                        disabled={!!existingAnswer}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="radio"
                        name={`answer-${entry.poll_entry_id}`}
                        value="unavailable"
                        checked={
                          existingAnswer
                            ? existingAnswer === "unavailable"
                            : answers[entry.poll_entry_id] === "unavailable"
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            entry.poll_entry_id,
                            e.target.value
                          )
                        }
                        disabled={!!existingAnswer}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="radio"
                        name={`answer-${entry.poll_entry_id}`}
                        value="ifneeded"
                        checked={
                          existingAnswer
                            ? existingAnswer === "ifneeded"
                            : answers[entry.poll_entry_id] === "ifneeded"
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            entry.poll_entry_id,
                            e.target.value
                          )
                        }
                        disabled={!!existingAnswer}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setAnswers({})}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={userAnswers.length > 0}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

PollAnswerForm.propTypes = {
  pollId: PropTypes.string.isRequired,
  pollName: PropTypes.string.isRequired,
  pollEntries: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
};

export default PollAnswerForm;
