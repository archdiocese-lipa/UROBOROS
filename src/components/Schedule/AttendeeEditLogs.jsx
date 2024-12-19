
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceEditLogs } from "@/services/attendanceService";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import Loading from "../Loading";

const AttendeeEditLogs = ({ attendance_id, family_id }) => {

  const { data, isLoading } = useQuery({
    queryKey: ["update_logs",attendance_id,family_id],
    queryFn: async () => fetchAttendanceEditLogs({ attendance_id,family_id }),
    enabled: !!attendance_id || !!family_id,
  });
  if (isLoading) {
    return <Loading/>;
  }
  if (data?.length < 1 || !data) {
    return <div className=" flex items-start justify-center">
        <p>No edit history yet.</p>
    </div>
  }

  return (
    
    <Table className=" ">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Contact Number</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>{family_id ?"Added by":"Updated By"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((log, i) => (
          <TableRow
            key={i}
            className={cn(
              i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
            )}
          >
            <TableCell>{log?.first_name}</TableCell>
            <TableCell>{log?.last_name}</TableCell>
            <TableCell>{log?.contact_number}</TableCell>
            <TableCell>
              {new Date(log?.updated_at).toLocaleDateString()}
            </TableCell>
            <TableCell>{`${log?.users?.first_name} ${log?.users?.last_name}`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

AttendeeEditLogs.propTypes = {
  attendance_id: PropTypes.string.isRequired,
  family_id: PropTypes.string.isRequired,
};

export default AttendeeEditLogs;
