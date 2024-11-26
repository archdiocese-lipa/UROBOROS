import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Description, Title } from "@/components/Title";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { getEventById } from "@/services/eventService";
import { getEventAttendance } from "@/services/attendanceService";
import { cn } from "@/lib/utils";

const ScheduleDetails = () => {
  const [urlPrms] = useSearchParams();
  const eventId = urlPrms.get("event") || null;

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await getEventById(eventId);
      return response;
    },
    enabled: !!eventId,
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance", eventId],
    queryFn: async () => {
      const response = await getEventAttendance(eventId);

      return response;
    },
    enabled: !!eventId,
  });

  if (isLoading || attendanceLoading) return <div>Loading...</div>;

  if (!eventId)
    return (
      <div className="grid grow place-items-center rounded-2xl outline outline-2 outline-[#e7dad3]">
        <Description>Select a Schedule to view and configure</Description>
      </div>
    );

  return (
    <div className="flex grow flex-col gap-8 rounded-2xl px-9 py-6 outline outline-2 outline-[#e7dad3]">
      <div className="flex justify-between">
        <div>
          <Title>{event?.event_name}</Title>
          {/* <Description>{`${event.event_category} - ${event.event_visibility}`}</Description> */}
          <Description>{event.event_description}</Description>
        </div>
        <div className="flex gap-1">
          <Button>Add Record</Button>
          <Button>QR</Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="rounded-l-lg" />
            <TableHead>Name of Attendee</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="rounded-r-lg" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((attendee, i) => (
            <TableRow
              key={i}
              className={cn(
                i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
              )}
            >
              <TableCell>
                <Switch />
              </TableCell>
              <TableCell>{`${attendee.first_name} ${attendee.last_name}`}</TableCell>
              <TableCell>{attendee.contact_number}</TableCell>
              <TableCell>
                {attendee.attended ? "Attended" : "Pending"}
              </TableCell>
              <TableCell>...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleDetails;
