import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteParent } from "@/hooks/useFamily";
import { Button } from "../ui/button";

const DeleteParent = forwardRef(
  ({ parentId, openModal = false, onClose }, ref) => {
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
      if (openModal) setOpenDialog(true);
    }, [openModal]);

    const { mutateAsync: deleteParent } = useDeleteParent();

    const handleDeleteParent = async () => {
      await deleteParent(parentId);
    };
    return (
      <div ref={ref}>
        <AlertDialog
          open={openDialog}
          onOpenChange={(isOpen) => {
            setOpenDialog(isOpen);
            if (!isOpen && onClose) onClose();
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently delete any
                account linked to this member.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDeleteParent}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);

DeleteParent.propTypes = {
  parentId: PropTypes.string.isRequired,
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
};

DeleteParent.displayName = "DeleteParent";

export default DeleteParent;
