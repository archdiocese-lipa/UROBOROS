import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SheetGroups = () => {
  return (
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
        <Tabs defaultValue="announcements" className="w-[400px] text-center">
          <TabsList>
            <TabsTrigger value="announcements">Announcement</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          <TabsContent value="announcements">Announcements</TabsContent>
          <TabsContent value="members">Members</TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SheetGroups;
