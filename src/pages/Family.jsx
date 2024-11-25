import { useState } from "react";
import { Title } from "@/components/Title";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NewFamilyForm from "@/components/NewFamilyForm";

const Family = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
      <Title>Family information</Title>
      <div className="mt-5">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Family Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Required Information</DialogTitle>
              <DialogDescription>
                Please provide the necessary details to add a new family member.
              </DialogDescription>
            </DialogHeader>
            <NewFamilyForm onSuccess={handleDialogClose} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button form="new-family-form">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Family;
