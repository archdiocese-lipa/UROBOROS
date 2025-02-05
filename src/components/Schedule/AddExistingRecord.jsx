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
    queryKey: ["event-attendance", eventId],
    queryFn: () => getAttendee(eventId),
    enabled: !!eventId,
  });

  // Track existing attendees
  const { existingAttendees, attendanceStatus } = useMemo(() => {
    if (!attendanceData) {
      return {
        existingAttendees: new Set(),
        attendanceStatus: new Map(),
      };
    }
    return {
      existingAttendees: new Set(attendanceData.map((a) => a.attendee_id)),
      attendanceStatus: new Map(
        attendanceData.map((a) => [a.attendee_id, a.attended])
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
          pageSize: 2,
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
      await queryClient.invalidateQueries(["event-attendance", eventId]);
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

  // intersection observer for infinite scroll
  const { ref } = useInterObserver(hasNextPage ? fetchNextPage : null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add from Record</Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar block h-[35rem] overflow-y-scroll sm:max-w-[625px]">
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
                allFamilies.map((family) => (
                  <div
                    key={family.familyId}
                    className="rounded-lg bg-primary p-4"
                  >
                    {/* Parents Section */}
                    {family.parents?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-primary-text">
                          Parents/Guardians
                        </Label>
                        <ul className="space-y-2">
                          {family.parents.map((parent) => (
                            <li
                              key={parent.id}
                              className="rounded-lg bg-white px-5 py-3 text-primary-text"
                            >
                              <div className="flex items-center justify-between">
                                {existingAttendees.has(parent.id) && (
                                  <Switch
                                    checked={attendanceStatus.get(parent.id)}
                                    onCheckedChange={(checked) =>
                                      onAttend(parent.id, checked)
                                    }
                                  />
                                )}
                                <Label>
                                  {parent.first_name} {parent.last_name}
                                </Label>
                                <div>
                                  {existingAttendees.has(parent.id) ? (
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
                              className="rounded-lg bg-white px-5 py-3 text-primary-text"
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
