import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

const useUpdateEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Accessing the query client

  // React Query mutation for updating an event
  const mutation = useMutation({
    mutationFn: updateEvent, // Use the updateEvent function from eventServices
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

      // Invalidate the 'events' query so the list of events is refetched after updating the event
      queryClient.invalidateQueries(["events"]);
    },
    onError: (error) => {
      toast({
        title: "Error Updating Event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Optional: Additional logic after mutation is settled (e.g., cleanup)
    },
  });

  return mutation;
};

export default useUpdateEvent;
