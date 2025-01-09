import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import { Icon } from "@iconify/react";
import { Description, Title } from "@/components/Title";
import * as XLSX from "xlsx";
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
  DialogClose,
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
  removeAssignedVolunteer,
  addAssignedVolunteer,
} from "@/services/eventService";
import {
  getEventAttendance,
  updateAttendeeStatus,
  countEventAttendance,
  editAttendee,
} from "@/services/attendanceService";

import { useUser } from "@/context/useUser";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import AddRecord from "./AddRecord";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AttendeeEditLogs from "./AttendeeEditLogs";
import AddAttendee from "./AddAttendee";
import Loading from "../Loading";
import { childSchema, parentSchema } from "@/zodSchema/AddFamilySchema";
import useUsersByRole from "@/hooks/useUsersByRole";
import VolunteerComboBox from "./VolunteerComboBox";
import EditChildAttendeeDialog from "./EditChildAttendeeDialog";
import EditParentAttendeeDialog from "./EditParentAttendeeDialog";
import ParentAddLogs from "./AttendeeAddLogs";
import AssignVolunteerComboBox from "./AssignVolunteerComboBox";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const ScheduleDetails = ({ queryKey }) => {
  const [qrCode, setQRCode] = useState(null);
  const [disableSchedule, setDisableSchedule] = useState(false);
  const [urlPrms] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const eventId = urlPrms.get("event") || null;
  const printRef = useRef(null);
  const userData = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: volunteers } = useUsersByRole("volunteer");

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

  const { data: eventvolunteers, isLoading: _volunteersLoading } = useQuery({
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

  const onRowAttend = async (attendeeId, state, queryClient) => {
    try {
      // Update attendee status in your database
      await updateAttendeeStatus(attendeeId, state);

      // Invalidate the related query to refetch fresh data
      queryClient.invalidateQueries(["attendance"]);
    } catch (error) {
      console.error("Error updating attendee status:", error);
    }
  };

  const downloadExcel = () => {
    //Get the list of volunteers and replacement volunteers
    const volunteerList = eventvolunteers
      ? eventvolunteers.map((volunteer) => {
          if (!volunteer?.replaced) {
            return `${volunteer?.users?.first_name?.toFirstUpperCase()} ${volunteer?.users?.last_name?.toFirstUpperCase()}`;
          }
          return `${volunteer?.volunteer_replacement?.first_name?.toFirstUpperCase()} ${volunteer?.volunteer_replacement?.last_name?.toFirstUpperCase()}`;
        })
      : [];

    const headings = [
      // ["Field", "Value"],
      ["Event Name", event?.event_name || "Unknown Event"],
      ["Event Date", event?.event_date || "Unknown Date"],
      ["Event Category", event?.event_category || "Unknown Category"],
      ["Total Attended", attendance?.data?.length || "Unknown Category"],
      ["Assigned Volunteers", volunteerList.join(", ") || "No Volunteers"],
      [],
    ];

    //combine data of parents and children
    const combinedData =
      attendance?.data?.flatMap((family) => [
        ["Family Surname", family?.family_surname],
        ["Parents", "Name", "Contact", "Time In"],
        ...family.parents.map((parent) => [
          "",
          `${parent?.first_name} ${parent?.last_name}`,
          `${parent?.contact_number}`,
          `${
            parent.time_attended
              ? new Date(parent.time_attended).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "--/--"
          }`,
        ]),
        ["Children", "Name", "Contact", "Time In"],
        ...family.children.map((child) => [
          "",
          `${child?.first_name} ${child?.last_name}`,
          `${child?.contact_number ?? "N/A"}`,
          `${
            child.time_attended
              ? new Date(child.time_attended).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "--/--"
          }`,
        ]),
        [],
      ]) || [];

    //combine the heading and the attendance
    const formattedData = [...headings, [], ...combinedData];

    // Converts data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

    // Creates a new workbook and appends the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Writes workbook to file
    XLSX.writeFile(workbook, `${event?.event_name}.xlsx`);
  };

  // console.log("attendees", attendance.data);

  // const { downloadExcel,formattedData } = useDownLoadExcel({
  //   volunteers: eventvolunteers || [],
  //   event: event || {},
  //   attendees: attendance?.data || [],
  // });

  const exportAttendanceList = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(`Event Name: ${event.event_name}`, 10, 10);

    // Format Event Date
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(`Event Date: ${formattedDate}`, 10, 20);

    // Add Total Attended
    doc.text(`Total Attended: ${attendanceCount.attended}`, 150, 10);

    let currentY = 30; // Start Y position for the next section

    // Add List of Assigned Volunteers
    if (eventvolunteers && eventvolunteers?.length > 0) {
      doc.setFontSize(14);
      doc.text("List of Assigned Volunteer(s):", 10, currentY);
      currentY += 10;

      eventvolunteers?.forEach((volunteer, index) => {
        doc.setFontSize(12);
        doc.text(
          `${index + 1}. ${volunteer.users.first_name.charAt(0).toUpperCase() + volunteer.users.first_name.slice(1)} ${volunteer.users.last_name.charAt(0).toUpperCase() + volunteer.users.last_name.slice(1)}`,
          10,
          currentY
        );
        currentY += 7; // Spacing for each volunteer
      });

      currentY += 5; // Additional spacing after the volunteer list
    }

    // Loop through the family data
    attendance?.data.forEach((family) => {
      // Filter out the parents who attended
      const attendedParents = family.parents.filter(
        (parent) => parent.attended
      );

      // Filter out the children who attended
      const attendedChildren = family.children.filter(
        (child) => child.attended
      );

      // Skip families with no attendees
      if (attendedParents.length === 0 && attendedChildren?.length === 0) {
        return;
      }

      // Add Family Surname Header
      doc.setFontSize(14);
      doc.text(`${family.family_surname} Family`, 10, currentY);

      // Update currentY for the next element
      currentY += 10;

      // Add Parents Table for those who attended
      if (attendedParents?.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [["Parents/Guardians", "Contact", "Status"]],
          body: attendedParents?.map((parent) => [
            `${parent.first_name} ${parent.last_name}`,
            parent.contact_number_number || "N/A",
            "Attended",
          ]),
          theme: "striped",
        });

        // Update currentY after parents table
        currentY = doc.lastAutoTable.finalY + 5;
      }

      // Add Children Table for those who attended
      if (attendedChildren?.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [["Child's Name", "Status"]],
          body: attendedChildren?.map((child) => [
            `${child.first_name} ${child.last_name}`,
            "Attended",
          ]),
          theme: "grid",
        });

        // Update currentY after children table
        currentY = doc.lastAutoTable.finalY + 5;
      }
    });

    // Save the PDF
    doc.save(`${event.event_name}-${formattedDate}.pdf`);
  };

  useEffect(() => {
    if (!event && !userData) {
      return;
    }

    const eventDateTime = new Date(`${event?.event_date}T${event?.event_time}`);
    const currentDateTime = new Date();
    const sevenDaysAhead = new Date(
      eventDateTime.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    if (currentDateTime > sevenDaysAhead) {
      setDisableSchedule(true);
    } else {
      setDisableSchedule(false);
    }
  }, [event, userData, disableSchedule]);

  const updateMutation = useMutation({
    mutationFn: async (data) => await editAttendee(data),
    onSuccess: () => {
      toast({
        title: "Edit Successful",
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
        queryKey: ["attendance", eventId],
      });
    },
  });

  const removeAssignedVolunteerMutation = useMutation({
    mutationFn: async (volunteerId) =>
      await removeAssignedVolunteer(volunteerId),
    onSuccess: () => {
      toast({
        title: "Volunteer removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing volunteer",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["event_volunteers", eventId],
      });
    },
  });

  const addVolunteerMutation = useMutation({
    mutationFn: async (data) => addAssignedVolunteer(data),
    onSuccess: () => {
      toast({
        title: "Volunteer added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding volunteer",
        description: `${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["event_volunteers", eventId],
      });
    },
  });

  const volunteerSchema = z.object({
    assignVolunteer: z
      .array(z.string())
      .min(1, "At least one volunteer must be assigned"),
  });
  const volunteerForm = useForm({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      assignVolunteer: [],
    },
  });

  const addVolunteers = (data) => {
    addVolunteerMutation.mutate({
      assignVolunteer: data.assignVolunteer,
      eventId,
    });
  };

  const form = useForm({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      // id: "",
      first_name: "",
      last_name: "",
      contact_number: "",
    },
  });

  const childrenForm = useForm({
    resolver: zodResolver(childSchema),
    first_name: "",
    last_name: "",
  });

  const onSubmit = (data, attendeeId) => {
    updateMutation.mutate(
      {
        update_id: userData.userData.id,
        ...data,
        attendeeId,
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["update_logs", attendeeId],
          });
        },
      }
    );
  };

  if (isLoading || attendanceLoading) return <Loading />;

  if (!eventId)
    return (
      <div className="grid grow place-items-center">
        <Description>View Attendance</Description>
      </div>
    );

  if (!event) {
    return <p>No Events.</p>;
  }

  return (
    <div className="flex h-full grow flex-col gap-2 overflow-y-hidden px-3 py-2 md:px-9 md:py-6">
      <div className="flex flex-wrap justify-between">
        <div>
          <Title>{event?.event_name}</Title>
          <Description>{event?.event_description}</Description>
        </div>
        <div className="flex">
          <div className="flex flex-wrap gap-1">
            {!disableSchedule && (
              <div className="flex gap-1">
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
              </div>
            )}
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-xl px-3 py-3">
                    <Icon icon={"mingcute:download-2-line"} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem onClick={() => exportAttendanceList()}>
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadExcel}>
                    Download as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Dialog
            open={deleteDialogOpen}
            onOpenChange={(isOpen) => {
              setDeleteDialogOpen(isOpen);
            }}
          >
            {!disableSchedule && (
              <DialogTrigger className="ml-2 w-fit" asChild>
                <Button
                  // onClick={() => deleteMutation.mutate()}
                  className="rounded-xl px-3 py-3"
                >
                  <Icon icon={"mingcute:delete-3-line"} />
                </Button>
              </DialogTrigger>
            )}
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
        <div className="flex items-center gap-2">
          <Label className="text-primary-text">
            List of Assigned Volunteer(s)
          </Label>
          <Dialog>
            {!disableSchedule && (
              <DialogTrigger>
                <button className="rounded-md bg-accent p-1 hover:cursor-pointer">
                  <Icon
                    className="h-4 w-4 text-white"
                    icon="mingcute:add-fill"
                  ></Icon>
                </button>
              </DialogTrigger>
            )}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Volunteers</DialogTitle>
                <DialogDescription>
                  Select volunteers to assign on this event.
                </DialogDescription>
              </DialogHeader>
              <Form {...volunteerForm}>
                <form onSubmit={volunteerForm.handleSubmit(addVolunteers)}>
                  <FormField
                    control={volunteerForm.control}
                    name="assignVolunteer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Volunteer</FormLabel>
                        <FormControl>
                          <AssignVolunteerComboBox
                            options={volunteers?.map((volunteer) => ({
                              value: volunteer.id,
                              label: `${volunteer.first_name} ${volunteer.last_name}`,
                            }))}
                            value={field.value || null}
                            onChange={field.onChange}
                            placeholder="Select Volunteer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        {eventvolunteers?.map((volunteer, i) => (
          <div key={i} className="flex gap-2">
            <p
              className={cn("text-primary-text", {
                "line-through": volunteer.replaced === true,
              })}
            >{`${i + 1}. ${volunteer.users.first_name.toFirstUpperCase()} ${volunteer.users.last_name.toFirstUpperCase()} `}</p>
            {volunteer?.volunteer_replacement && (
              <p
                className={"text-primary-text"}
              >{`${volunteer?.volunteer_replacement?.first_name.toFirstUpperCase()} ${volunteer?.volunteer_replacement?.last_name.toFirstUpperCase()}`}</p>
            )}

            <div className="flex items-center justify-center gap-2">
              <VolunteerComboBox
                // setVolunteerDialogOpen={setVolunteerDialogOpen}
                currentVolunteer={volunteer}
                assignedVolunteers={eventvolunteers}
                oldVolunteerId={volunteer.volunteer_id}
                eventId={eventId}
                volunteers={volunteers}
                newreplacement_id={volunteer.replacedby_id}
                replaced={volunteer.replaced}
                disableSchedule={disableSchedule}
              />
              <Dialog>
                {!disableSchedule && (
                  <DialogTrigger>
                    <Icon
                      className="h-5 w-5 text-red-500 hover:cursor-pointer"
                      icon={"mingcute:delete-2-line"}
                    ></Icon>
                  </DialogTrigger>
                )}

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Remove{" "}
                      {!volunteer?.volunteer_replacement
                        ? `${volunteer.users.first_name.toFirstUpperCase()} ${volunteer.users.last_name.toFirstUpperCase()} `
                        : `${volunteer?.volunteer_replacement?.first_name.toFirstUpperCase()} ${volunteer?.volunteer_replacement?.last_name.toFirstUpperCase()}?`}
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove this volunteer?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() =>
                          removeAssignedVolunteerMutation.mutate(
                            volunteer.volunteer_id
                          )
                        }
                        className="rounded-lg"
                        variant={"destructive"}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={printRef}
        className="no-scrollbar flex max-h-dvh flex-col gap-5 overflow-y-scroll"
      >
        <div className="flex flex-wrap justify-evenly font-montserrat font-semibold text-accent">
          <p>Total Registered: {attendanceCount?.total}</p>
          <p>Total Attended: {attendanceCount?.attended}</p>
          <p>
            Total Pending: {attendanceCount?.total - attendanceCount?.attended}
          </p>
        </div>
        {attendance.data.length < 1 && (
          <div className="flex items-center justify-center">
            <p>No Family registered yet.</p>
          </div>
        )}
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
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-accent">
                      Parent(s)/Guardian(s)
                    </h3>
                    {!disableSchedule && (
                      <AddAttendee
                        attendee_type={"parents"}
                        family_id={family.family_id}
                        family_surname={family.family_surname}
                        event_id={eventId}
                      />
                    )}
                  </div>
                  {/* <Dialog>
                    <DialogTrigger className="mr-5">
                      <Icon
                        className="h-10 w-10 text-accent"
                        icon={"mingcute:calendar-time-add-fill"}
                      ></Icon>
                    </DialogTrigger>
                    <DialogContent className="no-scrollbar max-h-[550px] max-w-[950px] overflow-y-scroll">
                      <DialogHeader>
                        <DialogTitle>
                          {family.family_surname} Family Add Logs
                        </DialogTitle>
                        <DialogDescription>
                          This table shows added attendees to this family.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="no-scrollbar overflow-y-scroll"> */}
                  <ParentAddLogs family_id={family.family_id} />
                  {/* </div>
                    </DialogContent>
                  </Dialog> */}
                </div>
                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="rounded-l-lg" />
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Tel No.</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="rounded-r-lg"></TableHead>
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
                              onRowAttend(attendee?.id, state, queryClient)
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
                        </TableCell>

                        <TableCell>
                          <p>{attendee.contact_number}</p>
                        </TableCell>

                        <TableCell>
                          {attendee.time_attended
                            ? new Date(
                                attendee.time_attended
                              ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "--/--"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <EditParentAttendeeDialog
                            attendee={attendee}
                            form={form}
                            onSubmit={onSubmit}
                            disableSchedule={disableSchedule}
                          />
                        </TableCell>
                        <TableCell>
                          <AttendeeEditLogs attendance_id={attendee.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-accent">
                    Children
                  </h3>
                  {!disableSchedule && (
                    <AddAttendee
                      attendee_type={"children"}
                      family_id={family.family_id}
                      family_surname={family.family_surname}
                      event_id={eventId}
                    />
                  )}
                </div>

                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="rounded-l-lg" />
                      <TableHead>Name</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="rounded-r-lg"></TableHead>
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
                              onRowAttend(attendee?.id, state, queryClient)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
                        </TableCell>
                        <TableCell>
                          {attendee.time_attended
                            ? new Date(
                                attendee.time_attended
                              ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "--/--"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {/* MARK: put dialog */}
                          <EditChildAttendeeDialog
                            // setIdEditting={setIdEditting}
                            attendee={attendee}
                            disableSchedule={disableSchedule}
                            childrenForm={childrenForm}
                            onSubmit={onSubmit}
                          />
                        </TableCell>
                        <TableCell>
                          <AttendeeEditLogs attendance_id={attendee.id} />
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
