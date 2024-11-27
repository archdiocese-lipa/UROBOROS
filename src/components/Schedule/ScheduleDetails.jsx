import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import { Icon } from "@iconify/react";

import { Description, Title } from "@/components/Title";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { getEventById, fetchEventVolunteers } from "@/services/eventService";
import { getEventAttendance } from "@/services/attendanceService";

import { cn } from "@/lib/utils";

const ScheduleDetails = () => {
  const [qrCode, setQRCode] = useState(null);
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

  const { data: volunteers, isLoading: volunteersLoading } = useQuery({
    queryKey: ["eventVolunteers", eventId],
    queryFn: async () => {
      const response = await fetchEventVolunteers(eventId);
      return response.data;
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

  const generateQRCode = async () => {
    try {
      const res = await QRCode.toDataURL(event.id);
      setQRCode(res);
      return res;
    } catch (error) {
      console.error("Error generating QR code:", error.message);
    }
  };

  if (isLoading || attendanceLoading || volunteersLoading)
    return <div>Loading...</div>;

  if (!eventId)
    return (
      <div className="grid grow place-items-center rounded-2xl outline outline-2 outline-[#e7dad3]">
        <Description>Select a Schedule to view and configure</Description>
      </div>
    );

  return (
    <div className="no-scrollbar flex grow flex-col gap-8 overflow-y-auto rounded-2xl px-9 py-6 outline outline-2 outline-[#e7dad3]">
      <div className="flex justify-between">
        <div>
          <Title>{event?.event_name}</Title>
          <Description>{event.event_description}</Description>
        </div>
        <div className="flex gap-1">
          <Button>
            <Icon icon={"mingcute:classify-add-2-fill"} />
            <p>Add Record</p>
          </Button>
          <Dialog onOpenChange={generateQRCode}>
            <DialogTrigger asChild>
              <Button>
                <Icon icon={"mingcute:qrcode-2-line"} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code</DialogTitle>
                <DialogDescription>
                  Scan this QR code to check the event.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                <img src={qrCode} alt="QR Code" className="h-64 w-64" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conditionally render Assigned Volunteers */}
      {volunteers && volunteers.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-accent">Assigned Volunteers</h3>
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers?.map((volunteer, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    index % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                  )}
                >
                  <TableCell>{`${volunteer.users.first_name} ${volunteer.users.last_name}`}</TableCell>
                  <TableCell>{volunteer.users.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {attendance?.map((family, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold text-accent">{`${family.family_surname} Family`}</CardTitle>
            <CardDescription className="sr-only">
              Family Details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-accent">Parents</h3>
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
                {family?.parents?.map((attendee, i) => (
                  <TableRow
                    key={i}
                    className={cn(
                      i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                    )}
                  >
                    <TableCell>
                      <Switch defaultChecked={attendee.attended} />
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
            <h3 className="text-xl font-semibold text-accent">Children</h3>
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="rounded-l-lg" />
                  <TableHead>Name of Attendee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="rounded-r-lg" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {family?.children?.map((attendee, i) => (
                  <TableRow
                    key={i}
                    className={cn(
                      i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                    )}
                  >
                    <TableCell>
                      <Switch defaultChecked={attendee.attended} />
                    </TableCell>
                    <TableCell>{`${attendee.first_name} ${attendee.last_name}`}</TableCell>
                    <TableCell>
                      {attendee.attended ? "Attended" : "Pending"}
                    </TableCell>
                    <TableCell>...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleDetails;
