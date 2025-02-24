import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeCoordinator } from "@/services/ministryService";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import PropTypes from "prop-types";

const RemoveCoordinator = ({coordinator_id,ministryId}) => {
  const queryClient = useQueryClient()
  const {mutate} = useMutation({
    mutationFn: removeCoordinator,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ministryCoordinators",ministryId],
      });
      toast({
        title: "Coordinator removed",
        description: "coordinator has been deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing coordinator",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },

  })

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Icon icon="mingcute:minus-circle-fill" height="20" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to remove  this coordinator?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate({ministryId,coordinator_id})}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
RemoveCoordinator.propTypes = {
  coordinator_id: PropTypes.string.isRequired,
  ministryId: PropTypes.string.isRequired,
};

export default RemoveCoordinator;
