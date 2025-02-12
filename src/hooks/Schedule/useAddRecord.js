import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  insertNewRecord,
  addSingleAttendeeFromRecord,
  addSingleWalkInAttendeeFromRecord,
  removeWalkInAttendeeFromRecord,
  removeAttendee,
  updateWalkInAttendee,
} from "@/services/attendanceService";
import { useToast } from "@/hooks/use-toast";

const useAddRecord = ({ eventId }) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
    },
  });

  return mutation;
};

const useAddAttendee = (eventId, userId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attendeeId,
      firstName,
      lastName,
      familyId,
      contactNumber,
      attendeeType,
    }) => {
      const attendeeDetails = {
        attendee: {
          id: attendeeId,
          first_name: firstName,
          last_name: lastName,
          contact: contactNumber,
          type: attendeeType,
        },
        event: { id: eventId },
        family: { id: familyId },
        time_attended: new Date().toISOString(),
        attended: true,
        registered_by: userId,
      };
      return await addSingleAttendeeFromRecord(attendeeDetails);
    },
    onMutate: () => {},
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to add attendee. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-attendance", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["search-attendees"] });
    },
  });
};

const useRemoveAttendee = (eventId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendeeId) => {
      return await removeAttendee(attendeeId, eventId);
    },
    onMutate: () => {},
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove attendee.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-attendance", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["search-attendees"] });
    },
  });
};

const useAddWalkInAttendee = (eventId, userId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      familyId,
      contactNumber,
      attendeeType,
    }) => {
      const attendeeDetails = {
        attendee: {
          first_name: firstName,
          last_name: lastName,
          contact: contactNumber,
          type: attendeeType,
        },
        event: { id: eventId },
        family: { id: familyId },
        time_attended: new Date().toISOString(),
        attended: true,
        registered_by: userId,
      };
      return await addSingleWalkInAttendeeFromRecord(attendeeDetails);
    },
    onMutate: () => {},
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to add attendee. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event-attendance", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["search-attendees"] });
    },
  });
};

// Add this hook to your existing file
const useRemoveWalkInAttendee = (eventId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ firstName, lastName }) => {
      return await removeWalkInAttendeeFromRecord(firstName, lastName, eventId);
    },
    onMutate: () => {},
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove attendee.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-attendance", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["search-attendees"] });
    },
  });
};

const useUpdateWalkInAttendee = (eventId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ firstName, lastName, state }) => {
      return await updateWalkInAttendee(firstName, lastName, eventId, state);
    },
    onMutate: () => {},
    onSettled: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: ["event-attendance", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["search-attendees"],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance", eventId],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance status.",
        variant: "destructive",
      });
    },
  });
};

export {
  useAddRecord,
  useAddAttendee,
  useAddWalkInAttendee,
  useRemoveWalkInAttendee,
  useRemoveAttendee,
  useUpdateWalkInAttendee,
};
