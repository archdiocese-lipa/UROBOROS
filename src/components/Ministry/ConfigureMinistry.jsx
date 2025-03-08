import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThreeDotsIcon } from "@/assets/icons/icons";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AddCoordinators from "./AddCoordinators";
import RemoveCoordinator from "./RemoveCoordinator";
import useMinistry from "@/hooks/useMinistry";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { z } from "zod";
import useGroups from "@/hooks/useGroups";
import { Loader2, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const titleSchema = z.string().min(2, {
  message: "Ministry Title must be at least 2 characters.",
});

const descriptionSchema = z.string().optional();

const ConfigureMinistry = ({
  coordinators,
  ministryId,
  ministryTitle,
  ministryDescription,
}) => {
  // Separate editing states for title and description
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(ministryTitle);
  const [description, setDescription] = useState(ministryDescription || "");
  const { deleteMutation, updateMinistryMutation } = useMinistry({
    ministryId,
  });

  // Reset local states when props change
  useEffect(() => {
    setTitle(ministryTitle);
    setDescription(ministryDescription || "");
  }, [ministryTitle, ministryDescription]);

  // Fetch groups
  const {
    groups: { data: groups = [] },
    isLoading: isLoadingGroups,
  } = useGroups({
    ministryId,
  });

  const handleDeleteMinistry = () => {
    deleteMutation.mutate(ministryId);
  };

  const validateAndSaveTitle = () => {
    try {
      const validatedTitle = titleSchema.parse(title);
      updateMinistryMutation.mutate(
        {
          ministryId,
          ministry_name: validatedTitle,
        },
        {
          onSuccess: () => {
            setIsEditingTitle(false);
          },
          onError: () => {
            // Revert to original on error
            setTitle(ministryTitle);
          },
        }
      );
    } catch (error) {
      // Show error or revert to original
      setTitle(ministryTitle);
      console.error("Validation error:", error);
    }
  };

  const validateAndSaveDescription = () => {
    try {
      const validatedDescription = descriptionSchema.parse(description);
      updateMinistryMutation.mutate(
        {
          ministryId,
          ministry_description: validatedDescription,
        },
        {
          onSuccess: () => {
            setIsEditingDescription(false);
          },
          onError: () => {
            // Revert to original on error
            setDescription(ministryDescription || "");
          },
        }
      );
    } catch (error) {
      // Show error or revert to original
      setDescription(ministryDescription || "");
      console.error("Validation error:", error);
    }
  };

  const cancelTitleEdit = () => {
    setTitle(ministryTitle);
    setIsEditingTitle(false);
  };

  const cancelDescriptionEdit = () => {
    setDescription(ministryDescription || "");
    setIsEditingDescription(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <ThreeDotsIcon />
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl px-0 text-primary-text">
        <DialogHeader className="px-6">
          <div className="mb-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-x-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-64 text-lg font-bold"
                  placeholder="Ministry Title"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    onClick={validateAndSaveTitle}
                    variant="outline"
                    disabled={
                      updateMinistryMutation.isPending ||
                      !title ||
                      title === ministryTitle
                    }
                  >
                    {updateMinistryMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelTitleEdit}
                    disabled={updateMinistryMutation.isPending}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-1"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px] resize-none"
                  placeholder="Ministry Description (optional)"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    onClick={validateAndSaveDescription}
                    disabled={
                      updateMinistryMutation.isPending ||
                      description === ministryDescription
                    }
                  >
                    {updateMinistryMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelDescriptionEdit}
                    disabled={updateMinistryMutation.isPending}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <DialogDescription>
                  {description || "No description provided."}
                </DialogDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-1"
                  onClick={() => setIsEditingDescription(true)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="border-y border-primary/100">
          <div className="flex flex-col gap-y-4 px-6 py-4">
            <div className="flex items-center justify-between">
              <Label>Coordinators</Label>
              <AddCoordinators ministryId={ministryId} />
            </div>
            <div className="no-scrollbar max-h-32 space-y-2 overflow-y-scroll">
              {coordinators?.map((coordinator) => (
                <div
                  key={coordinator.id}
                  className="flex items-center justify-between rounded-2xl bg-primary p-4"
                >
                  <Label className="font-semibold">
                    {coordinator.users.first_name} {coordinator.users.last_name}
                  </Label>
                  <RemoveCoordinator
                    ministryId={ministryId}
                    coordinator_id={coordinator.id}
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Groups</Label>
                {isLoadingGroups && (
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                )}
              </div>
            </div>
            <div className="no-scrollbar max-h-32 space-y-2 overflow-y-scroll">
              {isLoadingGroups ? (
                <div className="flex h-16 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : groups.length < 1 ? (
                <div className="flex items-center justify-center py-2">
                  <p className="text-muted-foreground text-sm">
                    No groups created yet.
                  </p>
                </div>
              ) : (
                groups?.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl bg-primary/50 p-4 hover:bg-primary"
                  >
                    <Label className="font-semibold">{group.name}</Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex rounded-full p-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="grow">
                Delete Ministry
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ministry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this ministry? This action
                  cannot be undone.
                </AlertDialogDescription>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={handleDeleteMinistry}
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Ministry"
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ConfigureMinistry.propTypes = {
  ministryTitle: PropTypes.string.isRequired,
  ministryDescription: PropTypes.string,
  ministryId: PropTypes.string.isRequired,
  coordinators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      users: PropTypes.shape({
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ConfigureMinistry;
