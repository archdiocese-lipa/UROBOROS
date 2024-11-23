import { useMutation } from "@tanstack/react-query";
import { insertEventAttendance } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

const useWalkInAttendance = () => {
  const { toast } = useToast();

  // React Query mutation for inserting event attendance
  const mutation = useMutation({
    mutationFn: insertEventAttendance, // Use the insertEventAttendance function from eventServices
    onMutate: () => {
      toast({
        title: "Submitting Attendance...",
        description: "Your attendance is being recorded.",
        variant: "info",
      });
    },
    onSuccess: () => {
      toast({
        title: "Attendance Registered",
        description: "Your attendance has been successfully recorded.",
        variant: "success",
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

export default useWalkInAttendance;
