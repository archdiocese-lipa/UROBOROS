import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import AttendeeEditLogs from "./AttendeeEditLogs";
import { memo } from "react";
import EditParentAttendeeDialog from "./EditAttendeeDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import PropTypes from "prop-types";

const AttendanceTable = ({
  attendance,
  disableSchedule,
  onSubmit,
  onRowAttend,
}) => {
  return (
    <Table>
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead className="rounded-l-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon className="h-5 w-5" icon="mingcute:question-line" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click the switch to attend</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="rounded-r-lg"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {attendance.length < 1 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              <div className="flex w-full items-center justify-center">
                <p>No data found.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
        {attendance.map((attendee, i) => (
          <TableRow
            key={i}
            className={cn(
              i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
            )}
          >
            <TableCell className="py-1 md:p-4">
              <Switch
                defaultChecked={attendee.attended}
                disabled={disableSchedule}
                onCheckedChange={(state) => onRowAttend(attendee?.id, state)}
              />
            </TableCell>

            <TableCell className="text-nowrap py-1 md:p-4">
              <p>{`${attendee.first_name} ${attendee.last_name}`}</p>
            </TableCell>

            <TableCell className="text-nowrap p-1 md:p-4">
              {attendee.time_attended
                ? new Date(attendee.time_attended).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "--/--"}
            </TableCell>

            <TableCell className="py-1 md:p-4">
              <p>{attendee.contact_number ?? "N/A"}</p>
            </TableCell>
            <TableCell className="flex gap-2 py-1">
              <EditParentAttendeeDialog
                attendee={attendee}
                onSubmit={onSubmit}
                disableSchedule={disableSchedule}
              />
            </TableCell>
            <TableCell className="py-1 md:p-4">
              <AttendeeEditLogs attendance_id={attendee.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

AttendanceTable.propTypes = {
  attendance: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      attended: PropTypes.bool,
      time_attended: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      contact_number: PropTypes.string,
    })
  ).isRequired,
  disableSchedule: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onRowAttend: PropTypes.func.isRequired,
};

export default memo(AttendanceTable);
