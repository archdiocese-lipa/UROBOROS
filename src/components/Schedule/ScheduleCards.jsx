import { EventIcon } from "@/assets/icons/icons";
import { ROLES } from "@/constants/roles";
import { useUser } from "@/context/useUser";
import { cn, formatEventDate, formatEventTimeCompact } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ScheduleDetails from "./ScheduleDetails";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import CreateEvent from "./CreateEvent";
import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";
import NewCreateEventForm from "./NewCreateEventForm";

const ScheduleCards = ({
  editDialogOpenIndex,
  setEditDialogOpenIndex,
  event,
  onEventClick,
  urlPrms,
  filter,
  sheetEditDialogOpenIndex,
  setSheetEditDialogOpenIndex,
  i,
  j,
}) => {
  const { userData } = useUser();
  const { temporaryRole } = useRoleSwitcher();
  const [disableEdit, setDisabledEdit] = useState(false);

  useEffect(() => {
    if (event.event_date) {
      const eventDate = new Date(`${event.event_date}T${event.event_time}`);
      const sevenDaysAhead = new Date(
        eventDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      const currentDate = new Date();
      if (sevenDaysAhead < currentDate) {
        setDisabledEdit(true);
      } else {
        setDisabledEdit(false);
      }
    }
  }, [event.event_date]);

  return (
    <div className="relative">
      <div
        className={cn(
          "hidden cursor-pointer items-start justify-between gap-3 rounded-[10px] bg-primary/50 px-5 py-4 xl:flex",
          event.id === urlPrms.get("event") && "border border-primary-outline"
        )}
        onClick={() => onEventClick(event.id)}
      >
        <div className="flex gap-3">
          <EventIcon className="text-2xl text-accent" />
          <div>
            <p className="mb-[6px] text-base font-bold leading-none text-accent">
              {event.requires_attendance
                ? `${event?.event_name}, ${formatEventTimeCompact(event?.event_time)}`
                : event.event_name}
            </p>
            <p className="text-sm text-primary-text">{event.description}</p>
            <p className="text-sm leading-tight text-primary-text">
              {event.event_category} - {event.event_visibility}
            </p>
            <p className="text-md font-bold leading-none text-primary-text">
              <span className="font-semibold">Date: </span>
              {formatEventDate(event.event_date)}
            </p>
          </div>
        </div>
        {(userData?.role === ROLES[0] || userData?.role === ROLES[4]) && (
          <div>
            <Button
              variant="ghost"
              size="xs"
              className="-mt-3 font-semibold text-accent hover:text-accent hover:underline"
              onClick={() => setEditDialogOpenIndex(`${i}-${j}`)}
            >
              Edit
            </Button>

            {/* Render form in a portal to avoid layout issues */}
            {editDialogOpenIndex === `${i}-${j}` && (
              <NewCreateEventForm
                isEditMode={true}
                initialEventData={event}
                onSuccess={() => setEditDialogOpenIndex(null)}
                queryKey={[
                  "schedules",
                  filter,
                  urlPrms.get("query")?.toString() || "",
                ]}
                isOpen={editDialogOpenIndex === `${i}-${j}`}
                onOpenChange={(isOpen) =>
                  setEditDialogOpenIndex(isOpen ? `${i}-${j}` : null)
                }
              />
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          "lg flex w-full cursor-pointer items-start gap-3 rounded-[10px] bg-primary/50 px-5 py-4 xl:hidden",
          event.id === urlPrms.get("event") && "border border-primary-outline"
        )}
        onClick={() => onEventClick(event.id)}
      >
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex flex-1 gap-3">
              <EventIcon className="text-2xl text-accent" />
              <div>
                <p className="mb-[6px] text-base font-bold leading-none text-accent">
                  {event.requires_attendance
                    ? `${event?.event_name}, ${formatEventTimeCompact(event?.event_time)}`
                    : event.event_name}
                </p>
                <p className="text-sm text-primary-text">{event.description}</p>
                <p className="text-sm leading-tight text-primary-text">
                  {event.event_category} - {event.event_visibility}
                </p>
                <p className="text-md font-bold leading-none text-primary-text">
                  <span className="font-semibold">Date: </span>
                  {formatEventDate(event.event_date)}
                </p>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent className="w-full p-0 md:w-full xl:hidden">
            {urlPrms.get("event") && (
              <ScheduleDetails
                queryKey={[
                  "schedules",
                  filter,
                  urlPrms.get("query")?.toString() || "",
                ]}
              />
            )}
          </SheetContent>
        </Sheet>
        <Dialog
          open={sheetEditDialogOpenIndex === `${i}-${j}`}
          onOpenChange={(isOpen) =>
            setSheetEditDialogOpenIndex(isOpen ? `${i}-${j}` : null)
          }
        >
          {temporaryRole === ROLES[0] && !disableEdit && (
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="-mt-3 p-0 font-semibold text-accent hover:underline"
              >
                Edit
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Events</DialogTitle>
              <DialogDescription>Schedule an upcoming event.</DialogDescription>
            </DialogHeader>
            <CreateEvent
              id="update-event"
              eventData={{ ...event }}
              setDialogOpen={(isOpen) => {
                setSheetEditDialogOpenIndex(isOpen ? `${i}-${j}` : null);
              }}
              queryKey={[
                "schedules",
                filter,
                urlPrms.get("query")?.toString() || "",
              ]}
            />
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <Button type="submit" form="update-event">
                  Edit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
ScheduleCards.propTypes = {
  editDialogOpenIndex: PropTypes.string,
  setEditDialogOpenIndex: PropTypes.func.isRequired,
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    event_name: PropTypes.string.isRequired,
    event_date: PropTypes.string.isRequired,
    event_time: PropTypes.string,
    event_category: PropTypes.string,
    event_visibility: PropTypes.string,
    description: PropTypes.string,
    requires_attendance: PropTypes.bool.isRequired,
  }).isRequired,
  onEventClick: PropTypes.func.isRequired,
  urlPrms: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  sheetEditDialogOpenIndex: PropTypes.bool.isRequired,
  setSheetEditDialogOpenIndex: PropTypes.func.isRequired,
  i: PropTypes.number.isRequired,
  j: PropTypes.number.isRequired,
};

export default memo(ScheduleCards);
