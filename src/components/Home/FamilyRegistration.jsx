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

const FamilyRegistration = ({ skipBtn }) => {
  const form = useForm({
    resolver: zodResolver(addFamilySchema),
    defaultValues: {
      parents: [{ firstName: "", lastName: "" }],
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

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission
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
            {form.formState.isSubmitting ? "Submitting..." : "Save"}
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
