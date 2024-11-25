import PropTypes from "prop-types"; // Import PropTypes
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const newFamilySchema = z.object({
  first_name: z.string().min(1, "First Name is Required"),
  last_name: z.string().min(1, "Last Name is Required"),
  type: z.string().min(1, "Type is Required"),
  contact_number: z
    .string()
    //   .regex(/^\d{11}$/, "Contact Number must be 11 digits")
    .optional(),
});
// .refine(
//   (data) => {
//     if (data.type === "guardian" && !data.contact_number) {
//       return false; // Contact number is required for guardians
//     }
//     return true;
//   },
//   {
//     message: "Contact Number is required for guardians.",
//     path: ["contact_number"],
//   }
// );

import { useToast } from "@/hooks/use-toast";

const NewFamilyForm = ({ id = "new-family-form", onSuccess }) => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(newFamilySchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      type: "guardian",
      contact_number: "",
    },
  });

  // Reset the fields if the type changes
  const handleTypeChange = (value) => {
    form.setValue("type", value);
    form.setValue("first_name", "");
    form.setValue("last_name", "");
    if (value !== "guardian") {
      form.setValue("contact_number", "");
    }
  };

  const onSubmit = (values) => {
    try {
      console.log(values);

      toast({
        title: "Successfully added a new family",
      });

      onSuccess(); // Close the dialog if success
    } catch (error) {
      toast({
        title: "Failed to add",
        description: error.message,
      });
    }
  };

  return (
    <Form id={id} {...form}>
      <form
        id={id}
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={handleTypeChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="guardian">Parent/Guardian</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conditionally render the Contact Number field based on the type */}
        {form.watch("type") === "guardian" && (
          <FormField
            control={form.control}
            name="contact_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Tel No.</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
};

// Prop validation
NewFamilyForm.propTypes = {
  id: PropTypes.string, 
  onSuccess: PropTypes.func.isRequired, 
};

export default NewFamilyForm;
