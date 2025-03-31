import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  createEvent,
  // getAllEvents,
  getEvents,
  getQuickAccessEvents,
  getWalkInEvents,
  updateEvent,
} from "@/services/eventService";

const useEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onMutate: () => {
      toast({
        title: "Creating Event...",
        description: "Your event is being created.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: `The event has been created successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: updateEvent, // This function expects {eventId, updatedData}
    onMutate: () => {
      toast({
        title: "Updating Event...",
        description: "Your event is being updated.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Event Updated",
        description: `The event has been updated successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // For full calendar in dashboard
  // const { data: calendarEvents } = useQuery({
  //   queryKey: ["calendarevents"],
  //   queryFn: getAllEvents,
  // });

  const { data: walkInEvents } = useQuery({
    queryKey: ["walkinevents"],
    queryFn: getWalkInEvents,
  });

  const { data: quickAccessEvents } = useQuery({
    queryKey: ["quick_access_events"],
    queryFn: getQuickAccessEvents,
  });

  return {
    quickAccessEvents,
    events,
    // calendarEvents,
    walkInEvents,
    createEventMutation,
    updateEventMutation,
  };
};

export default useEvent;
