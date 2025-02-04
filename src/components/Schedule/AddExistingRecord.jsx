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
import { getAttendee, searchAttendee } from "@/services/attendanceService";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "../ui/label";
import useInterObserver from "@/hooks/useInterObserver";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const AddExistingRecord = ({ eventId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 500);

  // Fetch existing attendees
  const { data: attendanceData } = useQuery({
    queryKey: ["event-attendance", eventId],
    queryFn: () => getAttendee(eventId),
    enabled: !!eventId,
  });

  // Track existing attendees
  const existingAttendees = useMemo(() => {
    if (!attendanceData) return new Set();
    return new Set(attendanceData.map((a) => a.attendee_id));
  }, [attendanceData]);

  // Update infinite query configuration with debug logs
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

  // intersection observer for infinite scroll
  const { ref } = useInterObserver(hasNextPage ? fetchNextPage : null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add from Record</Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar h-[35rem] overflow-y-scroll sm:max-w-[625px]">
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
              {allFamilies.map((family) => (
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
                              <Label>
                                {parent.first_name} {parent.last_name}
                              </Label>
                              <Button
                                className={cn(
                                  "rounded-xl text-[12px]",
                                  existingAttendees.has(parent.id)
                                    ? "bg-red-100 text-red-600"
                                    : "bg-[#EFDED6] text-primary-text"
                                )}
                              >
                                {existingAttendees.has(parent.id)
                                  ? "Remove"
                                  : "Add"}
                              </Button>
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
                              <Label>
                                {child.first_name} {child.last_name}
                              </Label>
                              <Button
                                className={cn(
                                  "rounded-xl text-[12px]",
                                  existingAttendees.has(child.id)
                                    ? "bg-red-100 text-red-600"
                                    : "bg-[#EFDED6] text-primary-text"
                                )}
                              >
                                {existingAttendees.has(child.id)
                                  ? "Remove"
                                  : "Add"}
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
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
