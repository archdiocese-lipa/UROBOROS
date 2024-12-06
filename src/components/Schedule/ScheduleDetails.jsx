import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import { Icon } from "@iconify/react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  editAttendee,
} from "@/services/attendanceService";

import { useUser } from "@/context/useUser";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import AddRecord from "./AddRecord";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { ROLES } from "@/constants/roles";

const ScheduleDetails = ({ queryKey }) => {
  const [qrCode, setQRCode] = useState(null);
  const [disableSchedule, setDisableSchedule] = useState(false);
  const [urlPrms] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState();
  const [attendeeEdit, setAttendeeEdit] = useState();
  const [childAttendeeEdit, setChildAttendeeEdit] = useState();
  const [idEditting, setIdEditting] = useState("");
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

  const exportAttendanceList = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text(`Event Name: ${event.event_name}`, 10, 10);
    doc.text(`Total Attended: ${attendanceCount.attended}`, 150, 10);

    let currentY = 20; // Start Y position for the first element

    // Loop through the family data
    attendance.data.forEach((family) => {
      // Filter out the parents who attended
      const attendedParents = family.parents.filter(
        (parent) => parent.attended
      );

      // Filter out the children who attended
      const attendedChildren = family.children.filter(
        (child) => child.attended
      );

      // Skip families with no attendees
      if (attendedParents.length === 0 && attendedChildren.length === 0) {
        return;
      }

      // Add Family Surname Header
      doc.setFontSize(14);
      doc.text(` ${family.family_surname} Family`, 10, currentY);

      // Update currentY for the next element
      currentY += 10;

      // Add Parents Table for those who attended
      if (attendedParents.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [["Parents/Guardians", "Contact", "Status"]],
          body: attendedParents.map((parent) => [
            `${parent.first_name} ${parent.last_name}`,
            parent.contact_number || "N/A",
            "Attended",
          ]),
          theme: "striped",
        });

        // Update currentY after parents table
        currentY = doc.lastAutoTable.finalY + 5;
      }

      // Add Children Table for those who attended
      if (attendedChildren.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [["Child's Name", "Status"]],
          body: attendedChildren.map((child) => [
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
    doc.save(`${event.event_name}-${event.event_date}.pdf`);
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

  const parentSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    contact: z.string().regex(/^[0-9]{11}$/, {
      message: "Contact number must be exactly 11 digits.",
    }),
  });
  const childSchema = parentSchema.omit({ contact: true });

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

  const form = useForm({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      // id: "",
      firstName: "",
      lastName: "",
      contact: "",
    },
  });

  const childrenForm = useForm({
    resolver: zodResolver(childSchema),
    firstName: "",
    lastName: "",
  });

  const onSubmit = (data) => {
    updateMutation.mutate({ ...data, attendeeId: idEditting });
    setIdEditting("");
    setAttendeeEdit(false);
    setChildAttendeeEdit(false);
  };

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
    <div className="flex h-full grow flex-col gap-2 overflow-y-hidden px-3 py-2 md:px-9 md:py-6">
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
                    <DropdownMenuItem onClick={() => exportAttendanceList()}>
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
        <Label className="text-primary-text">List of Assigned Volunteer</Label>
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
        <div className="flex flex-wrap justify-evenly font-montserrat font-semibold text-accent">
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
                <h3 className="text-xl font-semibold text-accent">
                  Parents/Guardians
                </h3>

                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="rounded-l-lg" />
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Tel No.</TableHead>
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

                        <TableCell>
                          {/* {idEditting === attendee.id ? (
                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="First name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="Last name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              ) : (
                                <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
                              )} */}
                          <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
                        </TableCell>

                        <TableCell>
                          {/* {idEditting === attendee.id ? (
                                <FormField
                                  control={form.control}
                                  name="contact"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Contact"
                                          type="text"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              ) : (
                                <p>{attendee.contact_number}</p>
                              )} */}

                          <p>{attendee.contact_number}</p>
                        </TableCell>

                        <TableCell>
                          {attendee.attended ? "Attended" : "Pending"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {/* {idEditting === attendee.id ? (
                                <Button
                                  type="button"
                                  onClick={() => setIdEditting("")}
                                >
                                   <Icon icon={"mingcute:close-fill"}/>
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={() => {
                                    // form.setValue(
                                    //   "id",
                                    //   `${attendee.id}`
                                    // );
                                    form.setValue(
                                      "firstName",
                                      `${attendee.first_name}`
                                    );
                                    form.setValue(
                                      "lastName",
                                      `${attendee.last_name}`
                                    );
                                    form.setValue(
                                      "contact",
                                      `0${attendee.contact_number.toString()}`
                                    );
                                    setIdEditting(attendee.id);
                                  }}
                                  variant="ghost"
                                  disabled={disableSchedule}
                                >
                                  <Icon
                                    disabled={disableSchedule}
                                    icon={"eva:edit-2-fill"}
                                  />
                                </Button>
                              )} */}
                          {/* {idEditting === attendee.id && (
                                <Button type="submit">
                                   <Icon icon={"mingcute:check-fill"}/></Button>
                              )} */}

                          <Dialog
                            open={attendeeEdit}
                            onOpenChange={setAttendeeEdit}
                          >
                            <DialogTrigger>
                              <Button
                                type="button"
                                onClick={() => {
                                  // form.setValue(
                                  //   "id",
                                  //   `${attendee.id}`
                                  // );
                                  form.setValue(
                                    "firstName",
                                    `${attendee.first_name}`
                                  );
                                  form.setValue(
                                    "lastName",
                                    `${attendee.last_name}`
                                  );
                                  form.setValue(
                                    "contact",
                                    `0${attendee.contact_number.toString()}`
                                  );
                                  setIdEditting(attendee.id);
                                }}
                                variant="ghost"
                                disabled={disableSchedule}
                              >
                                <Icon
                                  disabled={disableSchedule}
                                  icon={"eva:edit-2-fill"}
                                />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Parent Attendee</DialogTitle>
                                <DialogDescription>
                                  Edit attendee information
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                  <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            className="text-accent"
                                            placeholder="First name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            className="text-accent"
                                            placeholder="Last name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Contact</FormLabel>

                                        <FormControl>
                                          <Input
                                            className="text-accent"
                                            placeholder="Contact"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="mt-2 flex justify-end">
                                    <Button>Submit</Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
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
                        <TableCell>
                          {/* {idEditting === attendee.id ? (
                                <div className="flex gap-2">
                                  <FormField
                                    control={childrenForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="First name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={childrenForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="Last name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              ) : (
                                <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
                              )} */}
                          <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
                        </TableCell>
                        <TableCell>
                          {attendee.attended ? "Attended" : "Pending"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {/* {idEditting === attendee.id ? (
                                <Button
                                  type="button"
                                  onClick={() => setIdEditting("")}
                                >
                                  Cancel
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={() => {
                                    childrenForm.setValue(
                                      "firstName",
                                      `${attendee.first_name}`
                                    );
                                    childrenForm.setValue(
                                      "lastName",
                                      `${attendee.last_name}`
                                    );
                                    setIdEditting(attendee.id);
                                  }}
                                  variant="ghost"
                                  disabled={disableSchedule}
                                >
                                  <Icon
                                    disabled={disableSchedule}
                                    icon={"eva:edit-2-fill"}
                                  />
                                </Button>
                              )}
                              {idEditting === attendee.id && (
                                <Button type="submit">Save</Button>
                              )} */}

                          <Dialog
                            open={childAttendeeEdit}
                            onOpenChange={setChildAttendeeEdit}
                          >
                            <DialogTrigger>
                              <Button
                                type="button"
                                onClick={() => {
                                  childrenForm.setValue(
                                    "firstName",
                                    `${attendee.first_name}`
                                  );
                                  childrenForm.setValue(
                                    "lastName",
                                    `${attendee.last_name}`
                                  );
                                  setIdEditting(attendee.id);
                                }}
                                variant="ghost"
                                disabled={disableSchedule}
                              >
                                <Icon
                                  disabled={disableSchedule}
                                  icon={"eva:edit-2-fill"}
                                />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Child Attendee</DialogTitle>
                                <DialogDescription>
                                  Edit child attendee details
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...childrenForm}>
                                <form
                                  onSubmit={childrenForm.handleSubmit(onSubmit)}
                                >
                                  <FormField
                                    control={childrenForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="First name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={childrenForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Last name"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="mt-2 flex justify-end">
                                    <Button type="submit">Submit</Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
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
