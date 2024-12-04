import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  getEventById,
  fetchEventVolunteers,
  deleteEvent,
} from "@/services/eventService";
import {
  getEventAttendance,
  updateAttendeeStatus,
  countEventAttendance,
} from "@/services/attendanceService";

import { useUser } from "@/context/useUser";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import AddRecord from "./AddRecord";

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { ROLES } from "@/constants/roles";

const ScheduleDetails = ({ queryKey }) => {
  const [qrCode, setQRCode] = useState(null);
  const [disableSchedule, setDisableSchedule] = useState(false);
  const [urlPrms] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState();
  const eventId = urlPrms.get("event") || null;
  const printRef = useRef(null);
  const userData = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await getEventById(eventId);
      return response;
    },
    enabled: !!eventId,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => await deleteEvent(eventId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event deleted!",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const { data: volunteers, isLoading: _volunteersLoading } = useQuery({
    queryKey: ["event_volunteers", eventId],
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
  const { data: attendanceCount } = useQuery({
    queryKey: ["attendance-count", eventId],
    queryFn: async () => {
      const response = await countEventAttendance(eventId);

      return response;
    },
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

  const onRowAttend = async (attendeeId, state) => {
    updateAttendeeStatus(attendeeId, state);
  };

  const onEventDownload = async () => {
    window.print();
    // const input = printRef.current;
    // if (input) {
    //   // Temporarily remove overflow restrictions
    //   const originalOverflow = input.style.overflow;
    //   input.style.overflow = "visible";

    //   // Capture the entire content
    //   const canvas = await html2canvas(input);
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF();
    //   const imgProps = pdf.getImageProperties(imgData);
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    //   pdf.save("schedule-details.pdf");

    //   // Restore the original overflow settings
    //   input.style.overflow = originalOverflow;
    // }
  };

  useEffect(() => {
    if (!event && !userData) {
      return;
    }

    const eventDateTime = new Date(`${event?.event_date}T${event?.event_time}`);
    const currentDateTime = new Date();
    const twoHoursAhead = new Date(
      eventDateTime.getTime() + 2 * 60 * 60 * 1000
    );

    if (currentDateTime > twoHoursAhead) {
      setDisableSchedule(true);
    } else {
      setDisableSchedule(false);
    }
  }, [event, userData, disableSchedule]);

  if (isLoading || attendanceLoading) return <div>Loading...</div>;

  if (!eventId)
    return (
      <div className="grid grow place-items-center">
        <Description>View Attendance</Description>
      </div>
    );

  if (!event) {
    return <p>hi</p>;
  }

  return (
    <div className="flex h-full grow flex-col gap-2 overflow-y-hidden px-9 py-6">
      <div className="flex flex-wrap justify-between">
        <div>
          <Title>{event?.event_name}</Title>

          <Description>{event?.event_description}</Description>
        </div>
        <div className="flex">
          {!disableSchedule && (
            <div className="flex flex-wrap gap-1">
              <AddRecord eventId={eventId} />
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
              <div className="flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="rounded-xl px-3 py-3">
                      <Icon icon={"mingcute:download-2-line"} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem onClick={() => onEventDownload()}>
                      Download as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog>
                  <DialogTrigger></DialogTrigger>
                </Dialog>
              </div>
            </div>
          )}

          <Dialog
            open={deleteDialogOpen}
            onOpenChange={(isOpen) => {
              setDeleteDialogOpen(isOpen);
            }}
          >
            <DialogTrigger className="ml-2 w-fit" asChild>
              <Button
                // onClick={() => deleteMutation.mutate()}
                className="rounded-xl px-3 py-3"
              >
                <Icon icon={"mingcute:delete-3-line"} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-accent">
                  Delete Event?
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-accent opacity-80">
                Are you sure you want to delete this event?
              </DialogDescription>
              <DialogFooter className="mx-2 flex gap-2">
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="rounded-xl text-accent hover:text-accent"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-xl"
                  variant={"destructive"}
                  onClick={() => {
                    deleteMutation.mutate();
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <Label className="text-primary-text">Assign Volunteer:</Label>
        {volunteers?.map((volunteer, i) => (
          <p
            key={volunteer?.volunteer_id}
            className="text-primary-text"
          >{`${i + 1}. ${volunteer.users.first_name.toFirstUpperCase()} ${volunteer.users.last_name.toFirstUpperCase()}`}</p>
        ))}
      </div>

      <div
        ref={printRef}
        className="no-scrollbar flex max-h-dvh flex-col gap-5 overflow-y-scroll"
      >
        <div className="flex gap-20 font-montserrat font-semibold text-accent">
          <p>Total Registered: {attendanceCount?.total}</p>
          <p>Total Attended: {attendanceCount?.attended}</p>
          <p>
            Total Pending: {attendanceCount?.total - attendanceCount?.attended}
          </p>
        </div>
        {attendance.data?.map((family, i) => {
          const mainApplicant = family?.parents.filter(
            (parent) => parent?.main_applicant === true
          )[0];
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold text-accent">
                  {mainApplicant
                    ? `${mainApplicant?.last_name} Family`
                    : `Unknown Family`}
                </CardTitle>
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
                      <TableHead>Name of Guardian Attendee</TableHead>
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
                          <Switch
                            defaultChecked={attendee.attended}
                            disabled={disableSchedule}
                            onCheckedChange={(state) =>
                              onRowAttend(attendee?.id, state)
                            }
                          />
                        </TableCell>
                        <TableCell>{`${attendee.first_name} ${attendee.last_name}`}</TableCell>
                        <TableCell>{attendee.contact_number}</TableCell>
                        <TableCell>
                          {attendee.attended ? "Attended" : "Pending"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" disabled={disableSchedule}>
                            <Icon icon={"eva:edit-2-fill"} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <h3 className="text-xl font-semibold text-accent">Children</h3>
                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="rounded-l-lg" />
                      <TableHead>Name of Child Attendee</TableHead>
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
                          <Switch
                            defaultChecked={attendee.attended}
                            disabled={disableSchedule}
                            onCheckedChange={(state) =>
                              onRowAttend(attendee?.id, state)
                            }
                          />
                        </TableCell>
                        <TableCell>{`${attendee.first_name} ${attendee.last_name}`}</TableCell>
                        <TableCell>
                          {attendee.attended ? "Attended" : "Pending"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" disabled={disableSchedule}>
                            <Icon icon={"eva:edit-2-fill"} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
ScheduleDetails.propTypes = {
  queryKey: PropTypes.array,
};

export default ScheduleDetails;
