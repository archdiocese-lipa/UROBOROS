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

  // Helper function to toggle selection
  const toggleSelection = (selectedValue) => {
    if (value?.some((v) => v.id === selectedValue.id)) {
      // If the value is already selected, remove it
      onChange(value?.filter((v) => v.id !== selectedValue.id));
    } else {
      // If the value is not selected, add it
      onChange([...value, selectedValue]);
    }
  };

  const { ref } = useInterObserver(fetchNextPage);

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
          {value?.length > 0
            ? options
                ?.filter((opt) => value?.some((v) => v.id === opt.value.id))
                .map((opt) => opt.label)
                .join(", ") // Display selected labels
            : placeholder}{" "}
          {/* Show placeholder if no value is selected */}
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
                key={opt.id}
                onSelect={() => toggleSelection(opt.value)}
                disabled={disabled}
              >
                {opt.label}
                <Check
                  className={`ml-auto h-4 w-4 ${
                    value?.some((v) => v.id === opt.value.id)
                      ? "opacity-100"
                      : "opacity-0"
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
      id: PropTypes.string.isRequired, // Assuming each option has an 'id' field
      label: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string.isRequired, // Assuming value contains an 'id'
        // Add other fields if needed, e.g., name, role, etc.
      }).isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Assuming 'id' is always present
      // Add other fields if needed (e.g., label, name)
    })
  ).isRequired, // 'value' should be an array of objects with 'id' and other necessary fields
  onChange: PropTypes.func.isRequired, // onChange should always be a function
  placeholder: PropTypes.string, // placeholder is an optional string
  disabled: PropTypes.bool, // disabled is an optional boolean
  isLoading: PropTypes.bool, // isLoading is an optional boolean
  fetchNextPage: PropTypes.func.isRequired, // fetchNextPage is a required function
  hasNextPage: PropTypes.bool.isRequired, // hasNextPage is a required boolean
  isFetchingNextPage: PropTypes.bool.isRequired, // isFetchingNextPage is a required boolean
};

export default AssignVolunteerComboBox;
