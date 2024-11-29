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

const AssignVolunteerComboBox = ({ options=[], value, onChange, placeholder,disabled }) => {
  const [open, setOpen] = useState(false);

  // Helper function to toggle selection
  const toggleSelection = (selectedValue) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue)); // Remove if already selected
    } else {
      onChange([...value, selectedValue]); // Add if not selected
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-primary hover:bg-primary"
        >
          {value.length > 0
            ? options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ") // Display selected labels
            : placeholder} {/* Show placeholder if no value is selected */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[29rem] p-0">
        <Command>
          <CommandInput placeholder={`${placeholder}`} />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                onSelect={() => toggleSelection(opt.value)}
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
  value: PropTypes.arrayOf(PropTypes.string).isRequired, // Changed to an array for multi-select
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default AssignVolunteerComboBox;
