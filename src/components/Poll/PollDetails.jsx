import PropTypes from "prop-types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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

import Loading from "../Loading";
import useFetchPollAnswers from "@/hooks/useFetchPollAnswers";

const PollDetails = ({ pollName, pollEntries, onClose }) => {
  const { data, isLoading } = useFetchPollAnswers(pollEntries);
  const answersCount = data?.counts || {};
  const answersData = data?.allAnswers || [];

  const mapNames = (entryId, answerType) => {
    const entryData = answersData.find((data) => data.entryId === entryId);
    if (!entryData) return [];

    const names = entryData.answers
      .filter((answer) => answer.answer === answerType)
      .map((answer) => `${answer.users.first_name} ${answer.users.last_name}`);

    return names.join(", ");
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{pollName}</DialogTitle>
        <DialogDescription>
          {isLoading ? (
            <Loading />
          ) : (
            <Table className="text-gray-600 w-full text-left text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Answer</TableHead>
                  <TableHead className="font-medium">Names</TableHead>
                  <TableHead className="text-center font-medium">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pollEntries.map((entry) => (
                  <TableRow key={entry.poll_entry_id}>
                    <TableCell>Available</TableCell>
                    <TableCell>
                      {mapNames(entry.poll_entry_id, "available")}
                    </TableCell>
                    <TableCell className="text-center">
                      {answersCount[entry.poll_entry_id]?.available || 0}
                    </TableCell>
                  </TableRow>
                ))}
                {pollEntries.map((entry) => (
                  <TableRow key={entry.poll_entry_id}>
                    <TableCell>Unavailable</TableCell>
                    <TableCell>
                      {mapNames(entry.poll_entry_id, "unavailable")}
                    </TableCell>
                    <TableCell className="text-center">
                      {answersCount[entry.poll_entry_id]?.unavailable || 0}
                    </TableCell>
                  </TableRow>
                ))}
                {pollEntries.map((entry) => (
                  <TableRow key={entry.poll_entry_id}>
                    <TableCell>If Needed</TableCell>
                    <TableCell>
                      {mapNames(entry.poll_entry_id, "ifneeded")}
                    </TableCell>
                    <TableCell className="text-center">
                      {answersCount[entry.poll_entry_id]?.ifneeded || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

PollDetails.propTypes = {
  pollName: PropTypes.string.isRequired,
  pollEntries: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PollDetails;
