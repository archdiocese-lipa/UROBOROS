import { EventIcon } from "@/assets/icons/icons";
import { ROLES } from "@/constants/roles";
import { cn, formatEventDate, formatEventTimeCompact } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ScheduleDetails from "./ScheduleDetails";
import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useRoleSwitcher from "@/hooks/useRoleSwitcher";
import NewEditEventForm from "./NewEditEventForm";

const ScheduleCards = ({ event, onEventClick, urlPrms, filter }) => {
  const [disableEdit, setDisabledEdit] = useState(false);
  const { temporaryRole } = useRoleSwitcher();

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
  }, [event.event_date, event.event_time]);

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
        {!disableEdit &&
          (temporaryRole === ROLES[0] || temporaryRole === ROLES[4]) && (
            <NewEditEventForm
              initialEventData={{ ...event }}
              queryKey={[
                "schedules",
                filter,
                urlPrms.get("query")?.toString() || "",
              ]}
            />
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
        {!disableEdit &&
          (temporaryRole === ROLES[0] || temporaryRole === ROLES[4]) && (
            <NewEditEventForm
              initialEventData={{ ...event }}
              queryKey={[
                "schedules",
                filter,
                urlPrms.get("query")?.toString() || "",
              ]}
            />
          )}
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
