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

const AssignVolunteerComboBox = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[29rem] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder}`} />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                onSelect={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
                <Check
                  className={`ml-auto h-4 w-4 ${value === opt.value ? "opacity-100" : "opacity-0"}`}
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
    value: PropTypes.string, 
    onChange: PropTypes.func.isRequired, 
    placeholder: PropTypes.string, 
  };

export default AssignVolunteerComboBox;
