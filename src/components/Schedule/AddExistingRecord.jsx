import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  addSingleAttendeeFromRecord,
  getAttendee,
  removeAttendeeFromRecord,
  searchAttendee,
  updateAttendee,
  attendWalkInAttendee,
  removeWalkInAttendee,
  updateWalkInAttendee,
} from "@/services/attendanceService";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "../ui/label";
import useInterObserver from "@/hooks/useInterObserver";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Switch } from "../ui/switch";
import { useUser } from "@/context/useUser";

const AddExistingRecord = ({ eventId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();
  const userData = useUser();
  const userId = userData?.userData?.id;

  // Fetch existing attendees
  const { data: attendanceData } = useQuery({
    queryKey: ["attendee-attendance", eventId],
    queryFn: () => getAttendee(eventId),
    enabled: !!eventId,
  });

  // Track existing attendees
  const {
    existingAttendees,
    attendanceStatus,
    existingWalkInAttendees,
    walkInAttendanceStatus,
  } = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) {
      return {
        existingAttendees: new Set(),
        attendanceStatus: new Map(),
        existingWalkInAttendees: new Set(),
        walkInAttendanceStatus: new Map(),
      };
    }

    return {
      existingAttendees: new Set(attendanceData.map((a) => a.attendee_id)),
      attendanceStatus: new Map(
        attendanceData.map((a) => [a.attendee_id, a.attended])
      ),
      existingWalkInAttendees: new Set(
        attendanceData.map(
          (a) => `${a.first_name.trim()} ${a.last_name.trim()}`
        )
      ),
      walkInAttendanceStatus: new Map(
        attendanceData.map((a) => [
          `${a.first_name} ${a.last_name}`,
          a.attended,
        ])
      ),
    };
  }, [attendanceData]);

  // Update infinite query configuration
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["search-attendees", debounceSearchTerm],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await searchAttendee({
          searchTerm: debounceSearchTerm,
          page: pageParam,
          pageSize: 10,
        });
        return response;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.hasMore) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });
  // Combine all families from all pages
  const allFamilies = useMemo(() => {
    return data?.pages?.flatMap((page) => page.families) ?? [];
  }, [data?.pages]);

const allWalkInAttendees = useMemo(() => {
  const uniqueAttendees = new Set();
  return (data?.pages ?? []).flatMap((page) => {
    return (page?.walkInAttendees ?? []).filter((attendee) => {
      // Check if attendee is defined and has the necessary properties
      if (attendee && attendee.id && attendee.first_name && attendee.last_name) {
        if (!uniqueAttendees.has(attendee.id)) {
          uniqueAttendees.add(attendee.id);
          return true; // Include this attendee
        }
      }
      return false; // Skip if attendee is invalid or already included
    });
  });
}, [data?.pages]);

  const addAttendee = async (
    attendeeId,
    firstName,
    lastName,
    eventId,
    familyId,
    contactNumber,
    attendeeType
  ) => {
    try {
      const attendeeDetails = {
        attendee: {
          id: attendeeId,
          first_name: firstName,
          last_name: lastName,
          contact: contactNumber,
          type: attendeeType,
        },
        event: {
          id: eventId,
        },
        family: {
          id: familyId,
        },
        time_attended: new Date().toISOString(),
        attended: true,
        registered_by: userId,
      };
      await addSingleAttendeeFromRecord(attendeeDetails);
      await queryClient.invalidateQueries(["attendance", eventId]);
      await queryClient.invalidateQueries(["search-attendees"]);
    } catch (error) {
      console.error("Error adding attendee:", error);
    }
  };

  const removeAttendance = async (attendeeId) => {
    try {
      await removeAttendeeFromRecord(attendeeId, eventId);

      // Refresh queries
      await queryClient.invalidateQueries(["event-attendance", eventId]);
      await queryClient.invalidateQueries(["search-attendees"]);
    } catch (error) {
      console.error("Error removing attendee:", error);
    }
  };

  const onAttend = async (attendeeId, state) => {
    try {
      // Fix parameter order - eventId first, then state
      await updateAttendee(attendeeId, eventId, state);

      // Update query key to match the one used in useQuery
      await queryClient.invalidateQueries(["attendance", eventId]);
      await queryClient.invalidateQueries({
        queryKey: ["search-attendees"],
      });
    } catch (error) {
      console.error("Error updating attendee status:", error);
    }
  };

  const walkInattend = async (
    firstName,
    lastName,
    eventId,
    familyId,
    contactNumber,
    attendeeType
  ) => {
    try {
      const attendeeDetails = {
        attendee: {
          first_name: firstName,
          last_name: lastName,
          contact: contactNumber,
          type: attendeeType,
        },
        event: {
          id: eventId,
        },
        family: {
          id: familyId,
        },
        time_attended: new Date().toISOString(),
        attended: true,
        registered_by: userId,
      };
      await attendWalkInAttendee(attendeeDetails);
      await queryClient.invalidateQueries(["attendance", eventId]);
      await queryClient.invalidateQueries(["search-attendees"]);
    } catch (error) {
      console.error("Error adding attendee:", error);
    }
  };

  const removeWalkIn = async (first_name, last_name) => {
    try {
      await removeWalkInAttendee(first_name, last_name, eventId);

      // Refresh queries
      await queryClient.invalidateQueries(["event-attendance", eventId]);
      await queryClient.invalidateQueries(["search-attendees"]);
    } catch (error) {
      console.error("Error removing attendee:", error);
    }
  };

  const onAttendWalkIn = async (first_name, last_name, state) => {
    try {
      // Call the function to update the attendance status of the walk-in attendee
      await updateWalkInAttendee(first_name, last_name, eventId, state);

      // Invalidate the relevant query keys to refresh the data
      await queryClient.invalidateQueries(["attendance", eventId]);
      await queryClient.invalidateQueries({
        queryKey: ["search-attendees"],
      });
    } catch (error) {
      console.error("Error updating attendee status:", error);
    }
  };

  // intersection observer for infinite scroll
  const { ref } = useInterObserver(hasNextPage ? fetchNextPage : null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add from Record</Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar block h-[42rem] overflow-y-scroll sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add from Existing Record</DialogTitle>
          <DialogDescription>
            Add a new record from the existing in the database.
          </DialogDescription>
          <div className="flex h-10 items-center rounded-full bg-primary px-2">
            <SearchIcon className="h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full border-0 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {allFamilies.length === 0 ? (
                <Label className="flex items-center justify-center">
                  No data found
                </Label>
              ) : (
                allFamilies?.map((family) => (
                  <div
                    key={family?.familyId}
                    className="rounded-lg bg-primary p-2"
                  >
                    {/* Parents Section */}
                    {family.parents?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-primary-text">
                          Parents/Guardians
                        </Label>
                        <ul className="space-y-2">
                          {family.parents?.map((parent) => (
                            <li
                              key={parent?.id}
                              className="rounded-lg bg-white px-5 py-1 text-primary-text"
                            >
                              <div className="flex items-center justify-between">
                                {existingAttendees?.has(parent.id) && (
                                  <Switch
                                    checked={attendanceStatus?.get(parent.id)}
                                    onCheckedChange={(checked) =>
                                      onAttend(parent.id, checked)
                                    }
                                  />
                                )}
                                <Label>
                                  {parent.first_name} {parent.last_name}
                                </Label>
                                <div>
                                  {existingAttendees?.has(parent.id) ? (
                                    <Button
                                      onClick={() =>
                                        removeAttendance(parent.id)
                                      }
                                      className="rounded-xl bg-red-100 text-[12px] text-red-600"
                                    >
                                      Remove
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() =>
                                        addAttendee(
                                          parent.id,
                                          parent.first_name,
                                          parent.last_name,
                                          eventId,
                                          parent.family_id,
                                          parent.contact_number,
                                          (parent.attendee_type = "parents")
                                        )
                                      }
                                      className="rounded-xl bg-[#EFDED6] text-[12px] text-primary-text"
                                    >
                                      Add
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Children Section */}
                    {family.children?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-primary-text">Children</Label>
                        <ul className="space-y-2">
                          {family.children.map((child) => (
                            <li
                              key={child.id}
                              className="rounded-lg bg-white px-5 py-1 text-primary-text"
                            >
                              <div className="flex items-center justify-between">
                                {existingAttendees.has(child.id) && (
                                  <Switch
                                    checked={attendanceStatus.get(child.id)}
                                    onCheckedChange={(checked) =>
                                      onAttend(child.id, checked)
                                    }
                                  />
                                )}
                                <Label>
                                  {child.first_name} {child.last_name}
                                </Label>
                                <div>
                                  {existingAttendees.has(child.id) ? (
                                    <Button
                                      onClick={() => removeAttendance(child.id)}
                                      className="rounded-xl bg-red-100 text-[12px] text-red-600"
                                    >
                                      Remove
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() =>
                                        addAttendee(
                                          child.id,
                                          child.first_name,
                                          child.last_name,
                                          eventId,
                                          child.family_id,
                                          child.contact_number,
                                          (parent.attendee_type = "children")
                                        )
                                      }
                                      className="rounded-xl bg-[#EFDED6] text-[12px] text-primary-text"
                                    >
                                      Add
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Walk-in Attendees Section */}
              {allWalkInAttendees?.length > 0 && (
                <div className="rounded-lg bg-primary py-2">
                  <div className="text-center">
                    <Label className="text-md text-center text-primary-text md:text-lg">
                      Manual Record (from Walk-in and Volunteers input)
                    </Label>
                  </div>
                  <ul className="space-y-2">
                    {allWalkInAttendees?.map((attendee) => (
                      <li key={attendee?.id} className="px-3 text-primary-text">
                        <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1">
                          <div className="flex items-center gap-2">
                            {existingWalkInAttendees?.has(
                              `${attendee?.first_name} ${attendee?.last_name}`
                            ) && (
                              <Switch
                                checked={walkInAttendanceStatus.get(
                                  `${attendee?.first_name} ${attendee?.last_name}`
                                )}
                                onCheckedChange={(checked) =>
                                  onAttendWalkIn(
                                    attendee?.first_name,
                                    attendee?.last_name,
                                    checked
                                  )
                                }
                              />
                            )}
                            <Label>
                              {attendee?.first_name} {attendee?.last_name}
                              <span className="text-muted text-[12px]">
                                {" "}
                                {attendee?.attendee_type === "parents"
                                  ? "(Parent)"
                                  : "(Child)"}
                              </span>
                            </Label>
                          </div>

                          <div className="flex items-center gap-2">
                            {existingWalkInAttendees?.has(
                              `${attendee.first_name} ${attendee.last_name}`
                            ) ? (
                              <Button
                                onClick={() =>
                                  removeWalkIn(
                                    attendee?.first_name,
                                    attendee?.last_name,
                                    eventId
                                  )
                                }
                                className="rounded-xl bg-red-100 text-[12px] text-red-600"
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button
                                onClick={() =>
                                  walkInattend(
                                    attendee?.first_name,
                                    attendee?.last_name,
                                    eventId,
                                    attendee?.family_id,
                                    attendee?.contact_number,
                                    attendee?.attendee_type
                                  )
                                }
                                className="rounded-xl bg-[#EFDED6] text-[12px] text-primary-text"
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* div for intersection observer */}
              {hasNextPage && (
                <div ref={ref} className="h-4">
                  {isFetchingNextPage && (
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchIcon = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
};

AddExistingRecord.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default AddExistingRecord;
