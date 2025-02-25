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

const ConfigureGroup = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Icon icon="mingcute:more-2-line" className="h-5 w-5" />
      </AlertDialogTrigger>
      <AlertDialogContent className="no-scrollbar max-h-[35rem] overflow-y-scroll rounded-3xl px-0 text-primary-text">
        <AlertDialogHeader className="flex-row items-center justify-between space-y-0 px-6 text-start leading-none">
          <div>
            <AlertDialogTitle>Ministry A</AlertDialogTitle>
            <AlertDialogDescription>
              Ministry A Description
            </AlertDialogDescription>
          </div>
          <div>
            <CreateGroup />
          </div>
        </AlertDialogHeader>
        <div className="border-y border-primary-outline/20 py-4">
          <div className="px-6">
            <Label>Groups</Label>
            <div className="group mt-2 flex items-center justify-between rounded-lg bg-primary-outline/20 px-4 py-2 hover:bg-primary">
              <div>
                <Label className="font-semibold">Group 1A</Label>
                <p className="text-xs text-primary-text">
                  Group 1A Description
                </p>
              </div>
              <div className="items-center border-l border-primary-text/30 pl-2 transition-opacity delay-150 duration-300 group-hover:flex md:hidden">
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

export default ConfigureGroup;
