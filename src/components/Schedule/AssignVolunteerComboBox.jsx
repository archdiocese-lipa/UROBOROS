import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import PropTypes from "prop-types";
import useInterObserver from "@/hooks/useInterObserver";
import Loading from "../Loading";

const AssignVolunteerComboBox = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const [open, setOpen] = useState(false);

  // Helper function to toggle selection for multiple values (IDs)
  const toggleSelection = (selectedValue) => {
    // Check if the value already exists in the selected values
    const isSelected = value.includes(selectedValue);
    const updatedValue = isSelected
      ? value.filter((v) => v !== selectedValue) // Remove if already selected
      : [...value, selectedValue]; // Add if not selected

    onChange(updatedValue); // Update parent component's state with the new value array
  };

  const { ref } = useInterObserver(fetchNextPage);

  // Get labels for the selected values (IDs)
  const selectedLabels = options?.filter((opt) => value.includes(opt.value)) // Filter to get labels for the selected values (IDs)
    .map((opt) => opt.label); // Extract the labels

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-full w-full max-w-full justify-between text-wrap bg-primary text-start hover:bg-primary"
        >
          {selectedLabels?.length > 0
            ? selectedLabels.join(", ") // Show selected labels
            : placeholder}{" "}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 sm:w-[29rem]">
        <Command>
          <CommandInput placeholder={`${placeholder}`} />
          <CommandEmpty>
            {isLoading ? "Loading..." : "No options found."}
          </CommandEmpty>
          <CommandGroup
            className="h-fit overflow-y-scroll"
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (
                scrollHeight - scrollTop <= clientHeight + 100 &&
                hasNextPage
              ) {
                fetchNextPage();
              }
            }}
          >
            {options?.map((opt) => (
              <CommandItem
                key={opt.value}
                onSelect={() => toggleSelection(opt.value)} // Toggle selected ID
                disabled={disabled}
              >
                {opt.label}
                <Check
                  className={`ml-auto h-4 w-4 ${
                    value.includes(opt.value) ? "opacity-100" : "opacity-0"
                  }`}
                />
              </CommandItem>
            ))}
            {hasNextPage && <div ref={ref}></div>}
            {isFetchingNextPage && <Loading />}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

AssignVolunteerComboBox.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired, // The value should be an array of IDs
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  fetchNextPage: PropTypes.func.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  isFetchingNextPage: PropTypes.bool.isRequired,
};

export default AssignVolunteerComboBox;
