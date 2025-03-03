import PropTypes from "prop-types";
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
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import { Label } from "../ui/label";
import CreateGroup from "./CreateGroup";
import useGroups from "@/hooks/useGroups";

const ConfigureGroup = ({ ministryId, ministryName, ministryDescription }) => {
  const { groups } = useGroups({ ministryId });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          <Icon icon="mingcute:more-2-line" className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="no-scrollbar max-h-[35rem] overflow-y-scroll rounded-3xl px-0 text-primary-text">
        <AlertDialogHeader className="flex-row items-center justify-between space-y-0 px-6 text-start leading-none">
          <div>
            <AlertDialogTitle>{ministryName}</AlertDialogTitle>
            <AlertDialogDescription>
              {ministryDescription}
            </AlertDialogDescription>
          </div>
          <div>
            <CreateGroup ministryId={ministryId} />
          </div>
        </AlertDialogHeader>
        <div className="border-y border-primary-outline/20 py-4">
          <div className="px-6">
            {groups?.data?.length < 1 ? (
              <p>No groups created yet.</p>
            ) : (
              <Label>Groups</Label>
            )}
            {groups?.data?.map((group) => (
              <div
                key={group.id}
                className="group mt-2 flex items-center justify-between rounded-lg bg-primary-outline/20 px-4 py-2 hover:bg-primary"
              >
                <div>
                  <Label className="font-semibold">{group.name}</Label>
                  <p className="text-xs text-primary-text">
                    {group.description}
                  </p>
                </div>
                <div className="flex items-center gap-x-2 border-l border-primary-text/30 pl-2 transition-opacity delay-150 duration-300 group-hover:flex md:hidden">
                  <Button
                    size="xs"
                    className="bg-primary-outline/60 font-medium text-primary-text"
                  >
                    Members
                  </Button>
                  <Button
                    size="xs"
                    className="bg-primary-outline/60 font-medium text-primary-text"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AlertDialogFooter className="px-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ConfigureGroup.propTypes = {
  ministryId: PropTypes.string.isRequired,
  ministryName: PropTypes.string.isRequired,
  ministryDescription: PropTypes.string,
};

export default ConfigureGroup;
