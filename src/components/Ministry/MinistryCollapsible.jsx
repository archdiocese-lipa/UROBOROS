import { useState } from "react";
import { Label } from "../ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MinistryCollapsible = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-5 py-2">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="rounded-xl border border-primary-outline p-2 hover:bg-primary"
      >
        <div className="flex items-center justify-between px-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <div>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <Label className="font-bold">Ministry A</Label>
                  <p className="text-xs">3 Groups</p>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <AlertDialog>
            <AlertDialogTrigger>
              <Icon icon="mingcute:more-2-line" className="h-5 w-5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CollapsibleContent>
          <div className="mt-1 pl-16 pr-10">
            <ul className="border-l-2 border-primary-outline pl-2">
              <Sheet>
                <SheetTrigger className="rounded-full p-2 font-medium hover:bg-primary-outline">
                  Group 1
                </SheetTrigger>
                <SheetContent className="w-full">
                  <SheetHeader>
                    <div>
                      <SheetTitle>Group 1</SheetTitle>
                      <SheetDescription>Group 1 Description</SheetDescription>
                    </div>
                  </SheetHeader>
                  <Tabs
                    defaultValue="announcements"
                    className="w-[400px] text-center"
                  >
                    <TabsList>
                      <TabsTrigger value="announcements">
                        Announcement
                      </TabsTrigger>
                      <TabsTrigger value="members">Members</TabsTrigger>
                    </TabsList>
                    <TabsContent value="announcements">
                      Announcements
                    </TabsContent>
                    <TabsContent value="members">Members</TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MinistryCollapsible;
