import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { insertNewRecord } from "@/services/attendanceService";
import { useToast } from "@/hooks/use-toast";

const useAddRecord = ({eventId}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient()

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
      console.log("revalidating")
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
    },
  });

  return mutation;
};

export default useAddRecord;
