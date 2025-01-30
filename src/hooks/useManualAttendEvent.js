import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  insertChildren,
  insertGuardians,
  fetchAlreadyRegistered,
  removeAttendee,
  // insertMainApplicant,
} from "@/services/attendanceService";

import { useToast } from "@/hooks/use-toast";

const useGuardianManualAttendEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // React Query mutation for creating an event
  const mutation = useMutation({
    mutationFn: insertGuardians, // Use the createEvent function from eventServices
    onMutate: () => {
      toast({
        title: "Registering...",
        duration: 3000, // 3 seconds
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully registered for event",
      });
      queryClient.invalidateQueries(["attendance"]);
      queryClient.invalidateQueries(["alreadyRegistered"]);
    },
    onError: (error) => {
      toast({
        title: "Error Registering Event",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always invalidate after completion
      queryClient.invalidateQueries(["attendance"]);
    },
  });

  return mutation;
};

const useChildrenManualAttendance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // React Query mutation for creating an event
  const mutation = useMutation({
    mutationFn: insertChildren, // Use the createEvent function from eventServices
    onMutate: () => {
      toast({
        title: "Registering...",
        duration: 3000, // 3 seconds
      });
    },
    onSuccess: () => {
      toast({
        title: "Register Successful",
      });
      queryClient.invalidateQueries(["attendance"]);
    },
    onError: (error) => {
      toast({
        title: "Error Registering Event",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

const useFetchAlreadyRegistered = (eventId, attendeeIds) => {
  return useQuery({
    queryKey: ["alreadyRegistered", eventId, attendeeIds],
    queryFn: () => fetchAlreadyRegistered(eventId, attendeeIds),
    enabled: !!eventId && !!attendeeIds?.length,
  });
};

const useRemoveAttendee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: removeAttendee,
    onSuccess: () => {
      toast({
        title: "Attendee Removed",
      });
      queryClient.invalidateQueries("attendance"); // Invalidate the query to refetch the data
    },
    onError: (error) => {
      toast({
        title: "Error Removing Attendee",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export {
  useGuardianManualAttendEvent,
  // useMainApplicantAttendEvent,
  useChildrenManualAttendance,
  useFetchAlreadyRegistered,
  useRemoveAttendee,
};
