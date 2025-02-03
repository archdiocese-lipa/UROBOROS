import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import PollService from "@/services/PollService";
import { useDeletePoll } from "@/hooks/Poll/useDeletePoll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreeDotsIcon } from "@/assets/icons/icons";
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
import PollAnswerForm from "@/components/Poll/PollAnswerForm";
import PollDetails from "@/components/Poll/PollDetails";
import useFetchPollAnswers from "@/hooks/useFetchPollAnswers";

const PollCard = ({ pollId, title, createdDate, status, userRole }) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const deletePollMutation = useDeletePoll();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await PollService.getPollEntries(pollId);
        setEntries(data);
      } catch (error) {
        console.error("Error fetching poll entries:", error.message);
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [pollId]);

  const { data } = useFetchPollAnswers(entries);
  const answersCount = data?.counts || {};

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatUKDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleDelete = () => {
    deletePollMutation.mutate(pollId);
    setIsDialogOpen(false);
  };

  const handleRowClick = (entry) => {
    setSelectedEntry(entry);
  };

  return (
    <Card className="relative max-w-lg overflow-hidden rounded-2xl border bg-white text-primary-text shadow-md">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {userRole === "admin" && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="transparent" className="h-6 w-6">
                    <ThreeDotsIcon className="text-black" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <CardDescription className="text-gray-600 text-sm">
          Created on: {formatUKDate(createdDate)}
        </CardDescription>
        <p
          className={`text-sm font-medium ${status === "active" ? "text-green-500" : "text-red-500"}`}
        >
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
      </CardHeader>

      <CardContent className="px-4 py-2">
        <div className="flex flex-col gap-y-3">
          {isLoading && <p>Loading entries...</p>}
          {fetchError && <p className="text-red-500">{fetchError}</p>}
          {!isLoading && !fetchError && entries.length === 0 && (
            <p className="text-gray-500">No entries</p>
          )}

          {/* Wrapping table in a scrollable container */}
          <div className="overflow-x-auto">
            <Table className="text-gray-600 text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Time</TableHead>
                  <TableHead className="text-center font-medium">
                    Available
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    Unavailable
                  </TableHead>
                  <TableHead className="text-center font-medium">
                    If Needed
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow
                    key={entry.poll_entry_id}
                    onClick={() => handleRowClick(entry)}
                  >
                    <TableCell>{formatUKDate(entry.entry_date)}</TableCell>
                    <TableCell>{formatTime(entry.entry_time)}</TableCell>
                    <TableCell className="text-center">
                      {answersCount[entry.poll_entry_id]?.available || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {answersCount[entry.poll_entry_id]?.unavailable || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {answersCount[entry.poll_entry_id]?.ifneeded || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-end p-4">
        <PollAnswerForm
          pollId={pollId}
          pollName={title}
          pollEntries={entries}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hidden">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this poll? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedEntry && (
        <PollDetails
          pollId={pollId}
          pollName={`${formatUKDate(selectedEntry.entry_date)} ${formatTime(selectedEntry.entry_time)}`}
          pollEntries={[selectedEntry]}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </Card>
  );
};

PollCard.propTypes = {
  pollId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default PollCard;
