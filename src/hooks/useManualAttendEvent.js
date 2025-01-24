import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  insertChildren,
  insertGuardians,
  fetchAlreadyRegistered,
  removeAttendee,
  // insertMainApplicant,
} from "@/services/attendanceService";

import { useToast } from "@/hooks/use-toast";

// const useMainApplicantAttendEvent = () => {
//   const { toast } = useToast();
//   const _queryClient = useQueryClient();

//   // React Query mutation for creating an event
//   const mutation = useMutation({
//     mutationFn: insertMainApplicant, // Use the createEvent function from eventServices
//     onMutate: () => {},
//     onError: (error) => {
//       toast({
//         title: "Error Registering Event",
//         description: error.message || "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   return mutation;
// };

const useGuardianManualAttendEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // React Query mutation for creating an event
  const mutation = useMutation({
    mutationFn: insertGuardians, // Use the createEvent function from eventServices
    onMutate: () => {
      toast({
        title: "Registering...",
      });
      queryClient.invalidateQueries(["attendance"]);
    },
    onError: (error) => {
      toast({
        title: "Error Registering Event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["attendance"]); // Ensure the query is invalidated on success or error
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
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["attendance"]); // Ensure the query is invalidated on success or error
    },
  });

  return mutation;
};

const useFetchAlreadyRegistered = (eventId, attendeeIds) => {
  return useQuery({
    queryKey: ["attendance", eventId, attendeeIds],
    queryFn: () => fetchAlreadyRegistered(eventId, attendeeIds), // Pass eventId and attendeeIds explicitly
    enabled: !!eventId && !!attendeeIds?.length, // Only run the query if eventId and attendeeIds are provided
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
