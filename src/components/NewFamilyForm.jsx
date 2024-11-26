import PropTypes from "prop-types"; // Import PropTypes
import { useForm } from "react-hook-form";
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

import { useToast } from "@/hooks/use-toast";
import { newFamilySchema } from "@/zodSchema/NewFamilyFormSchema";
import {
  addChild,
  addParent,
  checkDuplicateFamilyMember,
  getFamilyId,
} from "@/services/familyService";
import { useUser } from "@/context/useUser";

const NewFamilyForm = ({ id = "new-family-form" }) => {
  const { toast } = useToast();
  const { userData } = useUser();
  const userId = userData?.id;

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

  const onSubmit = async (data) => {
    if (data.type === "guardian") {
      try {
        // Fetch user id
        const familyId = await getFamilyId(userId);
        const newGuardian = {
          firstName: data.first_name.trim(),
          lastName: data.last_name.trim(),
          contactNumber: data.contact_number.trim(),
        };

        if (
          !newGuardian.firstName ||
          !newGuardian.lastName ||
          !newGuardian.contactNumber
        ) {
          toast({
            title: "Validation Error",
            description: "Please fill out all required fields.",
            variant: "destructive",
          });
          return;
        }

        // Check if the new family member already exists
        const isDuplicate = await checkDuplicateFamilyMember(
          familyId.id,
          newGuardian.firstName
        );
        if (isDuplicate) {
          toast({
            title: "Failed",
            description:
              "Family member with this first name already exists in the family.",
            variant: "destructive",
          });
          return;
        }

        // Add parent
        await addParent([newGuardian], familyId.id);

        toast({
          title: "Success",
          description: `Guardian ${newGuardian.firstName} ${newGuardian.lastName} added successfully.`,
        });
      } catch (error) {
        console.error("Error adding parent:", error);
        toast({
          title: "Error",
          description: "Failed to add guardian. Please try again.",
          variant: "destructive",
        });
      }
    } else if (data.type === "child") {
      try {
        const familyId = await getFamilyId(userId);
        const newChild = {
          firstName: data.first_name.trim(),
          lastName: data.last_name.trim(),
        };

        if (!newChild.firstName || !newChild.lastName) {
          toast({
            title: "Validation Error",
            description: "Please fill out all required fields.",
            variant: "error",
          });
          return;
        }

        // Submit data
        await addChild([newChild], familyId.id);

        toast({
          title: "Success",
          description: `${newChild.firstName} ${newChild.lastName} added successfully.`,
        });
      } catch (error) {
        console.error("Error adding child:", error);
        toast({
          title: "Error",
          description: "Failed to add child. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid Type",
        description: "Submission type is not supported.",
        variant: "error",
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
