import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceEditLogs } from "@/services/attendanceService";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import Loading from "../Loading";
import { Icon } from "@iconify/react";

const AttendeeEditLogs = ({ attendance_id }) => {
  // console.log(attendance_id)
  const { data, isLoading } = useQuery({ 
    queryKey: ["update_logs", attendance_id],
    queryFn: async () => fetchAttendanceEditLogs({ attendance_id }),
    enabled: !!attendance_id,
  });

  // if (isLoading) {
  //   return <Loading />;
  // }
  if (data?.length < 1 || !data) {
    return;
  } else {
    return (
      <Dialog>
        <DialogTrigger>
          <Icon
            className="h-5 w-5 text-accent"
            icon={"mingcute:history-line"}
          ></Icon>
        </DialogTrigger>
        <DialogContent className="no-scrollbar max-h-[550px] max-w-[950px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Attendance Edit Logs</DialogTitle>
            <DialogDescription>
              This table shows the edit details done to this user.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar overflow-y-scroll">
            {isLoading ? (
              <Loading />
            ) : (
              <Table className=" ">
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader className="bg-primary">
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Contact Tel No.</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>
                      Updated By
                    </TableHead>
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
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

AttendeeEditLogs.propTypes = {
  attendance_id: PropTypes.string,
};

export default AttendeeEditLogs;
