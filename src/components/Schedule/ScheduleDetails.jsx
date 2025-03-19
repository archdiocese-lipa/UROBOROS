import { useEffect, memo, useState } from "react";
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
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  updateTimeOut,
} from "@/services/attendanceService";

import { useUser } from "@/context/useUser";
import { cn, downloadExcel, exportAttendanceList } from "@/lib/utils";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import AddRecord from "./AddRecord";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddAttendee from "./AddAttendee";
import Loading from "../Loading";
import useUsersByRole from "@/hooks/useUsersByRole";
import ParentAddLogs from "./AttendeeAddLogs";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import VolunteerSelect from "./VolunteerSelect";
import { Input } from "../ui/input";
import { Search } from "@/assets/icons/icons";
import { useDebounce } from "@/hooks/useDebounce";
import AttendanceTable from "./AttendanceTable";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";
import AddExistingRecord from "./AddExistingRecord";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CustomReactSelect from "../CustomReactSelect";

const ScheduleDetails = () => {
  const [qrCode, setQRCode] = useState(null);
  const [disableSchedule, setDisableSchedule] = useState(false);
  const [urlPrms, setUrlPrms] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredParentAttendance, setFilteredParentAttendance] = useState([]);
  const [filteredChildAttendance, setFilteredChildAttendance] = useState([]);
  const eventId = urlPrms.get("event") || null;
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { temporaryRole } = useRoleSwitcher();

  const { data: volunteers } = useUsersByRole("volunteer");
  const { data: admins } = useUsersByRole("admin");

  // Fetch volunteers and admins for assigning volunteers
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
      queryClient.invalidateQueries([
        "schedules",
        "events",
        userData,
        temporaryRole,
        urlPrms.get("month")?.toString(),
        urlPrms.get("year")?.toString(),
        urlPrms.get("query")?.toString() || "",
      ]);
      urlPrms.delete("event");
      setUrlPrms(urlPrms);
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

  const assignedUsers = [...(volunteers || []), ...(admins || [])];

  const previousVolunteerIds = new Set(
    // Create a set of volunteer IDs that have already been replaced
    eventvolunteers
      ?.filter((volunteer) => volunteer.replaced) // Filter for volunteers that have been replaced
      .map((volunteer) => volunteer.volunteer_id) // Extract the volunteer_id for those replaced volunteers
  );

  const replacementVolunteerIds = new Set(
    // Create a set of volunteer IDs that are replacements (i.e., volunteers who replaced someone)
    eventvolunteers
      ?.filter((volunteer) => volunteer.replaced) // Filter for volunteers that have been replaced
      .map((volunteer) => volunteer.replacedby_id) // Extract the replacedby_id (the ID of the replacement volunteer)
  );

  const filteredVolunteers = assignedUsers?.filter(
    (volunteer) =>
      // Include volunteers that are either not yet assigned or are previous replacements
      (!eventvolunteers?.some(
        (assignedVolunteer) => assignedVolunteer.volunteer_id === volunteer.id
      ) ||
        previousVolunteerIds.has(volunteer.id)) &&
      // Exclude volunteers who are currently replacements
      !replacementVolunteerIds.has(volunteer.id)
  );

  const volunteerOptions = filteredVolunteers?.map((volunteer) => ({
    value: volunteer.id,
    label: `${volunteer.first_name} ${volunteer.last_name}`,
  }));

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

  const debouncedSearch = useDebounce(search, 500);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const allAttendance = attendance?.data?.flatMap((family) => [
      ...family.parents.map((parent) => parent),
      ...family.children.map((child) => child),
    ]);

    const filteredSearch = allAttendance?.filter((attendee) =>
      `${attendee.first_name} ${attendee.last_name}`
        .toLocaleLowerCase()
        .includes(debouncedSearch.toLocaleLowerCase())
    );

    if (filteredSearch?.length === allAttendance?.length) {
      // If no search term or all attendees match, clear filters
      setFilteredParentAttendance([]);
      setFilteredChildAttendance([]);
    } else {
      // Separate filtered results into parents and children
      setFilteredParentAttendance(
        filteredSearch.filter(
          (attendee) => attendee.attendee_type === "parents"
        )
      );
      setFilteredChildAttendance(
        filteredSearch.filter(
          (attendee) => attendee.attendee_type === "children"
        )
      );
    }
  }, [debouncedSearch, attendance?.data]);

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
    try {
      // Update attendee status in your database
      await updateAttendeeStatus(attendeeId, state);

      // Invalidate the related query to refetch fresh data
      queryClient.invalidateQueries(["attendance", eventId]);
      queryClient.invalidateQueries(["event-attendance", eventId]);
    } catch (error) {
      console.error("Error updating attendee status:", error);
    }
  };

  const onTimeOut = async (attendeeId) => {
    await updateTimeOut(attendeeId);

    queryClient.invalidateQueries(["attendance", eventId]);
  };

  const handleDownloadExcel = () => {
    downloadExcel(event, eventvolunteers, attendance, attendanceCount);
  };

  const handleDownloadPDF = () => {
    exportAttendanceList(event, eventvolunteers, attendance, attendanceCount);
  };

  useEffect(() => {
    if (!event || !userData) {
      return;
    }

    const eventDateTime = new Date(`${event?.event_date}T${event?.event_time}`);
    const currentDateTime = new Date();

    let offset = 0;
    if (userData.role === "volunteer") {
      // 24 hours ahead for volunteer
      offset = 24 * 60 * 60 * 1000;
    } else if (userData.role === "admin") {
      // 7 days ahead for admin
      offset = 7 * 24 * 60 * 60 * 1000;
    }

    const adjustedEventDateTime = new Date(eventDateTime.getTime() + offset);

    if (currentDateTime > adjustedEventDateTime) {
      setDisableSchedule(true);
    } else {
      setDisableSchedule(false);
    }
  }, [event, userData]);

  const removeAssignedVolunteerMutation = useMutation({
    mutationFn: async (volunteerId) =>
      await removeAssignedVolunteer(volunteerId, eventId),
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
    <div className="no-scrollbar flex h-full grow flex-col gap-2 overflow-y-scroll px-3 py-2 md:px-9 md:py-6">
      <div className="flex flex-wrap justify-between">
        <div>
          <Title>
            {`${event.event_name}, ${new Date(
              `${event.event_date}T${event.event_time}`
            )
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
              .replace(":", ".")
              .replace(" ", "")
              .toLowerCase()}`}
          </Title>
          <Label className="text-2xl text-primary-text">
            Date:{" "}
            {new Date(event?.event_date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Label>
          <Description>{event?.event_description}</Description>
        </div>
        <div className="flex">
          <div className="flex gap-1">
            {!disableSchedule && (
              <div className="flex flex-wrap gap-1">
                <AddExistingRecord eventId={eventId} />
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
            <div className="flex flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-xl px-3 py-3">
                    <Icon icon={"mingcute:download-2-line"} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem onClick={handleDownloadPDF}>
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadExcel}>
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
            {((!disableSchedule && temporaryRole === "admin") ||
              (!disableSchedule && temporaryRole === "coordinator")) && (
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
            {!disableSchedule && temporaryRole !== "volunteer" && (
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
                          <CustomReactSelect
                            options={volunteerOptions}
                            onChange={(selectedOptions) => {
                              field.onChange(
                                selectedOptions.map((option) => option.value)
                              ); // Extract IDs from selected options
                            }}
                            placeholder="Select Volunteer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-2 flex justify-end">
                    <DialogClose>
                      <Button type="submit">Add</Button>
                    </DialogClose>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        {eventvolunteers?.map((volunteer, i) => (
          <div key={i} className="flex gap-2">
            <p>{`${i + 1}.`}</p>
            <p
              className={cn("text-primary-text", {
                "line-through": volunteer.replaced === true,
              })}
            >{`${volunteer.users.first_name.toFirstUpperCase()} ${volunteer.users.last_name.toFirstUpperCase()} `}</p>
            {volunteer?.volunteer_replacement && (
              <p
                className={"text-primary-text"}
              >{`${volunteer?.volunteer_replacement?.first_name.toFirstUpperCase()} ${volunteer?.volunteer_replacement?.last_name.toFirstUpperCase()}`}</p>
            )}

            <div className="flex items-center justify-center gap-2">
              {!disableSchedule && (
                <VolunteerSelect
                  // setVolunteerDialogOpen={setVolunteerDialogOpen}
                  currentVolunteer={volunteer}
                  assignedVolunteers={eventvolunteers}
                  admins={admins}
                  oldVolunteerId={volunteer.volunteer_id}
                  eventId={eventId}
                  volunteers={volunteers}
                  newreplacement_id={volunteer.replacedby_id}
                  replaced={volunteer.replaced}
                  disableSchedule={disableSchedule}
                />
              )}
              <Dialog>
                {((!disableSchedule && temporaryRole === "admin") ||
                  (!disableSchedule && temporaryRole === "coordinator")) && (
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
      <div className="flex flex-wrap justify-evenly font-montserrat font-semibold text-accent">
        <p>Total Registered: {attendanceCount?.total}</p>
        <p>Total Attended: {attendanceCount?.attended}</p>
        <p>
          Total Pending: {attendanceCount?.total - attendanceCount?.attended}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative w-8/12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl text-accent" />
          <Input
            value={search}
            onChange={handleSearch}
            className="border-none pl-12"
            placeholder="Search attendee"
          />
        </div>
      </div>

      {attendance?.data?.length < 1 && (
        <div className="flex items-center justify-center">
          <p>No Family registered yet.</p>
        </div>
      )}
      {search !== "" ? (
        <Card className="">
          <CardHeader className="p-2">
            <CardDescription className="sr-only">
              Family Details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-accent">
                  Parent(s) / Guardian(s)
                </h3>
              </div>
            </div>
            <AttendanceTable
              updateTimeOut={onTimeOut}
              // onSubmit={onSubmit}
              attendeeType={"parents"}
              disableSchedule={disableSchedule}
              attendance={filteredParentAttendance}
              onRowAttend={onRowAttend}
            />

            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-accent">Children</h3>
            </div>
            <AttendanceTable
              updateTimeOut={onTimeOut}
              // onSubmit={onSubmit}
              disableSchedule={disableSchedule}
              attendance={filteredChildAttendance}
              onRowAttend={onRowAttend}
            />
          </CardContent>
        </Card>
      ) : (
        attendance.data?.map((family, i) => {
          const mainApplicant = family?.registered_by;
          const walkInMainApplicant = family?.parents?.find(
            (parent) => parent.main_applicant
          );

          const applicantName = walkInMainApplicant
            ? `${walkInMainApplicant?.first_name} ${walkInMainApplicant?.last_name} Family`
            : `Added by ${mainApplicant?.first_name} ${mainApplicant?.last_name} `;

          return (
            <Card className="p-2" key={i}>
              <CardHeader className="p-2">
                <CardTitle className="font-montserrat font-bold text-accent">
                  {applicantName}
                </CardTitle>
                <CardDescription className="sr-only">
                  Family Details
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 p-1">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-accent">
                      Parent(s) / Guardian(s)
                    </h3>
                    {!disableSchedule && (
                      <>
                        <AddAttendee
                          attendee_type={"parents"}
                          family_id={family.family_id}
                          event_id={eventId}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Icon
                              className="h-5 w-5 text-primary-text"
                              icon="mingcute:question-line"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <p>
                              This button allows you to add a parent or guardian
                              to this family.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </>
                    )}
                  </div>
                  <ParentAddLogs family_id={family.family_id} />
                </div>
                <AttendanceTable
                  updateTimeOut={onTimeOut}
                  // onSubmit={onSubmit}
                  attendeeType="parents"
                  disableSchedule={disableSchedule}
                  attendance={family.parents}
                  onRowAttend={onRowAttend}
                />

                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-accent">
                    Children
                  </h3>
                  {!disableSchedule && (
                    <>
                      <AddAttendee
                        attendee_type={"children"}
                        family_id={family.family_id}
                        event_id={eventId}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Icon
                            className="h-5 w-5 text-primary-text"
                            icon="mingcute:question-line"
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>
                            This button allows you to add a child to this
                            family.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </>
                  )}
                </div>

                <AttendanceTable
                  updateTimeOut={onTimeOut}
                  // onSubmit={onSubmit}
                  disableSchedule={disableSchedule}
                  attendance={family.children}
                  onRowAttend={onRowAttend}
                />
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default memo(ScheduleDetails);
