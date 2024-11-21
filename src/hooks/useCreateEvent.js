import { useMutation } from "@tanstack/react-query";
import { createEvent } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

const useCreateEvent = () => {
  const { toast } = useToast();

  // React Query mutation for creating an event
  const mutation = useMutation({
    mutationFn: createEvent, // Use the createEvent function from eventServices
    onMutate: () => {
      toast({
        title: "Creating Event...",
        description: "Your event is being created.",
        variant: "info",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Event Created",
        description: `The event "${data.event_name}" has been created successfully!`,
        variant: "success",
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
      // Optional: Handle additional cleanup or refetching if necessary
    },
  });

  return mutation;
};

export default useCreateEvent;
