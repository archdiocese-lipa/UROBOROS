import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  insertGuardians,
  insertMainApplicant,
} from "@/services/attendanceService";

import { useToast } from "@/hooks/use-toast";

const useGuardianManualAttendEvent = () => {
  const { toast } = useToast();
  const _queryClient = useQueryClient();

  // React Query mutation for creating an event
  const mutation = useMutation({
    mutationFn: insertGuardians, // Use the createEvent function from eventServices
    onMutate: () => {
      toast({
        title: "Registering...",
      });
    },
    onSuccess: () => {
      toast({
        title: "Register Successful",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Registering Event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

const useMainApplicantAttendEvent = () => {
  const { toast } = useToast();
  const _queryClient = useQueryClient();

  // React Query mutation for creating an event
  const mutation = useMutation({
    mutationFn: insertMainApplicant, // Use the createEvent function from eventServices
    onMutate: () => {
      console.log("registering");
    },
    onSuccess: () => {
      toast({
        title: "Register Successful",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Registering Event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export { useGuardianManualAttendEvent, useMainApplicantAttendEvent };
