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

const VolunteerComboBox = ({assignedVolunteers, oldVolunteerId, volunteers, eventId, replaced, newreplacement_id }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const filteredVolunteer = volunteers.filter(
    (volunteer) =>
      !assignedVolunteers.some((assignedVolunteer) => assignedVolunteer.volunteer_id === volunteer.id)
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
      queryClient.invalidateQueries({ queryKey: ["event_volunteers", eventId] });
    },
  });

  const handleSubmit = () => {
    if (!value) {
      setError("Please select a volunteer.");
      return;
    }

    // Submit the volunteer's ID for the replacement.
    replaceVolunteerMutation.mutate({
      oldVolunteerId,
      replacedby_id: value,
      replaced,
      eventId,
      newreplacement_id,
    });
  };

  console.log("old id",oldVolunteerId)
  console.log("newreplacement_id",newreplacement_id)
  return (
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
              ? `${filteredVolunteer.find((volunteer) => volunteer.id === value)?.first_name} ${volunteers.find(
                  (volunteer) => volunteer.id === value
                )?.last_name}`
              : "Select Volunteer..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[450px] p-0">
          <Command>
            <CommandInput placeholder="Search volunteer..." className="h-9" />
            <CommandList>
              <CommandEmpty>No volunteer found.</CommandEmpty>
              <CommandGroup>
                {filteredVolunteer.map((volunteer) => (
                  <CommandItem
                    key={volunteer.id}
                    value={volunteer.id} // Use the volunteer's ID as the value.
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setError(""); // Clear the error message when a volunteer is selected.
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
      {error && <div className="text-red-500 text-sm mt-2 font-semibold">{error}</div>} {/* Display error message */}
      <Button className="mt-2 w-full" onClick={handleSubmit}>
        Replace Volunteer
      </Button>
    </div>
  );
};
VolunteerComboBox.propTypes = {
    assignedVolunteers: PropTypes.array.isRequired,
    oldVolunteerId: PropTypes.string.isRequired,
    volunteers: PropTypes.array.isRequired,
    eventId: PropTypes.string.isRequired,
    replaced: PropTypes.bool.isRequired,
    newreplacement_id: PropTypes.string,
  };
export default VolunteerComboBox;
