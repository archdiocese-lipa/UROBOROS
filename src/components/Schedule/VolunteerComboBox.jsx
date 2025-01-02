import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { replaceVolunteer } from "@/services/eventService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

const VolunteerComboBox = ({
  disableSchedule,
  assignedVolunteers,
  oldVolunteerId,
  volunteers,
  eventId,
  replaced,
  newreplacement_id,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);

  const previousVolunteerIds = new Set(
    assignedVolunteers
      .filter((volunteer) => volunteer.replaced)
      .map((volunteer) => volunteer.volunteer_id)
  );

  const replacementVolunteerIds = new Set(
    assignedVolunteers
      .filter((volunteer) => volunteer.replaced)
      .map((volunteer) => volunteer.replacedby_id)
  );

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      // Ensure the volunteer is either not assigned or is a previous volunteer
      (!assignedVolunteers.some(
        (assignedVolunteer) => assignedVolunteer.volunteer_id === volunteer.id
      ) ||
        previousVolunteerIds.has(volunteer.id)) &&
      !replacementVolunteerIds.has(volunteer.id) // Exclude replacement volunteers
  );

  const replaceVolunteerMutation = useMutation({
    mutationFn: async (data) => replaceVolunteer(data),
    onSuccess: () => {
      toast({
        title: "Volunteer replaced successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error replacing volunteer",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["event_volunteers", eventId],
      });
    },
  });

  const handleSubmit = () => {
    if (!value) {
      setError("Please select a volunteer.");
      return;
    }

    replaceVolunteerMutation.mutate({
      oldVolunteerId,
      replacedby_id: value,
      replaced,
      eventId,
      newreplacement_id,
    });
    setVolunteerDialogOpen(false);
  };
  return (
    <Dialog open={volunteerDialogOpen} onOpenChange={setVolunteerDialogOpen}>
      {!disableSchedule && (
        <DialogTrigger>
          <Icon
            className="h-5 w-5 text-accent hover:cursor-pointer"
            icon={"eva:edit-2-fill"}
          />
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Assigned Volunteer</DialogTitle>
          <DialogDescription>
            Select a volunteer to replacement{" "}
            {/* {`${currentVolunteer?.users?.first_name.toFirstUpperCase()} ${currentVolunteer?.users?.last_name.toFirstUpperCase()}`} */}
            
          </DialogDescription>
        </DialogHeader>
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? `${filteredVolunteers.find((volunteer) => volunteer.id === value)?.first_name} ${
                      volunteers.find((volunteer) => volunteer.id === value)
                        ?.last_name
                    }`
                  : "Select Volunteer..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[450px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search volunteer..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No volunteer found.</CommandEmpty>
                  <CommandGroup>
                    {filteredVolunteers?.map((volunteer) => (
                      <CommandItem
                        key={volunteer.id}
                        value={volunteer.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                          setError("");
                        }}
                      >
                        {volunteer.first_name} {volunteer.last_name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === volunteer.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {error && (
            <div className="mt-2 text-sm font-semibold text-red-500">
              {error}
            </div>
          )}{" "}
          {/* Display error message */}
          <div className="flex justify-end">
            <Button className="mt-2" onClick={handleSubmit}>
              Replace Volunteer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
VolunteerComboBox.propTypes = {
  currentVolunteer: PropTypes.shape({
    users: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
  }),
  disableSchedule: PropTypes.bool.isRequired,
  assignedVolunteers: PropTypes.arrayOf(
    PropTypes.shape({
      volunteer_id: PropTypes.string.isRequired,
      replaced: PropTypes.bool,
      replacedby_id: PropTypes.string,
    })
  ),
  oldVolunteerId: PropTypes.string.isRequired,
  volunteers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  eventId: PropTypes.string.isRequired,
  replaced: PropTypes.bool.isRequired,
  newreplacement_id: PropTypes.string,
};

export default VolunteerComboBox;
