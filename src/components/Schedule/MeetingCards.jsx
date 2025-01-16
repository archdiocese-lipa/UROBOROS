import { EventIcon } from "@/assets/icons/icons";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

 const MeetingCards = ({urlPrms,onMeetingClick,meeting}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer gap-3 rounded-[10px] bg-primary/50 px-5 py-4",
        meeting.id === urlPrms.get("meeting") &&
          "border border-primary-outline hover:underline"
      )}
      onClick={() => onMeetingClick(meeting.id)}
    >
      <EventIcon className="text-2xl text-accent" />
      <div>
        <p className="mb-[6px] text-base font-bold leading-none text-accent">
          {meeting.meeting_name}
        </p>
        <p className="text-sm text-primary-text">{meeting.details}</p>
        <p className="text-md leading-none text-primary-text">
          <span className="font-semibold">Date: </span>
          {new Date(
            `${meeting.meeting_date}T${meeting.start_time}`
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          ,{" "}
          {new Date(
            `${meeting.meeting_date}T${meeting.start_time}`
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
          .replace(":", ".")
          .replace(" ", "")
          .toLowerCase()}
        </p>
      </div>
    </div>
  );
}
MeetingCards.propTypes = {
    urlPrms: PropTypes.instanceOf(URLSearchParams).isRequired,
    onMeetingClick: PropTypes.func.isRequired,
    meeting: PropTypes.shape({
      id: PropTypes.string.isRequired,
      meeting_name: PropTypes.string.isRequired,
      details: PropTypes.string,
      meeting_date: PropTypes.string.isRequired,
      start_time: PropTypes.string.isRequired,
    }).isRequired,
  };


export default  MeetingCards