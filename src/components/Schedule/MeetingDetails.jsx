import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Description, Title } from "@/components/Title";
import {
  getMeetingById,
  fetchMeetingParticipants,
} from "@/services/meetingService";
import { Label } from "../ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MeetingDetails = () => {
  const [urlPrms] = useSearchParams();
  const meetingId = urlPrms.get("meeting");

  const { data: meeting, isLoading } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: async () => {
      const response = await getMeetingById(meetingId);
      return response;
    },
    enabled: !!meetingId,
  });

  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ["meetingParticipants", meetingId],
    queryFn: async () => {
      const response = await fetchMeetingParticipants(meetingId);
      return response; // The full response object
    },
    enabled: !!meetingId, // Only fetch when meetingId is available
  });

  if (isLoading) return <div>Loading meeting details...</div>;

  if (!meetingId)
    return (
      <div className="grid grow place-items-center rounded-2xl outline outline-2 outline-[#e7dad3]">
        <Description>Select a Meeting to view and configure</Description>
      </div>
    );

  return (
    <div className="no-scrollbar flex grow flex-col gap-8 overflow-y-auto rounded-2xl px-9 py-6 outline outline-2 outline-[#e7dad3]">
      <div className="flex justify-between">
        <div>
          <Title>{meeting?.meeting_name}</Title>
          <Description>
            {meeting?.details || "No details provided."}
          </Description>
          <div>
            <p>
              <Label className="text-primary-text">
                <strong>Meeting Date:</strong> {meeting?.meeting_date}
              </Label>
            </p>
            <p>
              <Label className="text-primary-text">
                <strong>Start Time:</strong> {meeting?.start_time}
              </Label>
            </p>
            <p>
              <Label className="text-primary-text">
                <strong>End Time:</strong> {meeting?.end_time}
              </Label>
            </p>
            <p>
              <Label className="text-primary-text">
                <strong>Location:</strong>{" "}
                {meeting?.location || "Not specified"}
              </Label>
            </p>
          </div>
        </div>

        <div className="flex gap-1"></div>
      </div>

      {/* Display Participants */}
      {participantsLoading ? (
        <div>Loading participants...</div>
      ) : participants?.success && participants?.data?.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold text-accent">
              Participants List
            </CardTitle>
            <CardDescription className="sr-only">
              Meeting Participants
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="rounded-l-lg">
                    Name of Attendee
                  </TableHead>
                  <TableHead className="rounded-r-lg">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.data.map((participant) => (
                  <TableRow
                    key={participant.user_id}
                    className="bg-white odd:bg-primary odd:bg-opacity-35"
                  >
                    <TableCell>{`${participant.users.first_name} ${participant.users.last_name}`}</TableCell>
                    <TableCell>{participant.users.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div>No participants found</div>
      )}
    </div>
  );
};

export default MeetingDetails;
