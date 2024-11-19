import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addFamilySchema } from "@/zodSchema/AddFamilySchema";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

const FamilyRegistration = ({ skipBtn }) => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(addFamilySchema),
    defaultValues: {
      parents: [{ firstName: "", lastName: "", contactNumber: "" }],
      children: [{ firstName: "", lastName: "" }],
    },
  });
  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);
      // Simulate the process of adding family members (e.g., API call)
      // Replace this with actual logic for submitting the data, e.g., an API call
      // await submitFamilyMembers(data);

      toast({
        title: "Family Members Added Successfully",
        description:
          "The parent and child information has been successfully added to the system.",
      });
    } catch (error) {
      console.error("Error adding family members:", error);

      toast({
        title: "Error",
        description:
          "There was an issue adding the family members. Please try again.",
        variant: "destructive", // Optionally you can customize the toast style for errors
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Label>Parent/Guardian Information</Label>
        {parentFields.map((parent, index) => (
          <div
            key={parent.id}
            className="flex flex-col md:flex-row w-full gap-2"
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`parents.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`parents.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`parents.${index}.contactNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Contact Tel No." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {parentFields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeParent(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => appendParent({ firstName: "", lastName: "" })}
          >
            Add Parent/Guardian
          </Button>
        </div>

        <Label>Child Information</Label>
        {childFields.map((child, index) => (
          <div
            key={child.id}
            className="flex flex-col md:flex-row w-full gap-2"
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`children.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`children.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {childFields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeChild(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => appendChild({ firstName: "", lastName: "" })}
          >
            Add Child
          </Button>
        </div>

        <div className="flex justify-end gap-x-2">
          <Button type="button" variant="outline" onClick={skipBtn}>
            Skip
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Props validation
FamilyRegistration.propTypes = {
  skipBtn: PropTypes.func.isRequired, // Require skipBtn to be a function
};

export default FamilyRegistration;
