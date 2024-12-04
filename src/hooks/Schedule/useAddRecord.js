import { useMutation } from "@tanstack/react-query";
import { insertNewRecord } from "@/services/attendanceService";
import { useToast } from "@/hooks/use-toast";

const useAddRecord = () => {
  const { toast } = useToast();

  // React Query mutation for inserting event attendance
  const mutation = useMutation({
    mutationFn: insertNewRecord, // Use the insertEventAttendance function from eventServices
    onMutate: () => {
      toast({
        title: "Submitting Attendance...",
        description: "Your attendance is being recorded.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Attendance Registered",
        description: "Your attendance has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Optionally handle additional cleanup or refetching if necessary
    },
  });

  return mutation;
};

export default useAddRecord;
