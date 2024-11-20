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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "../ui/dialog";
import { useAddFamily } from "@/hooks/useAddFamily";
import { useUser } from "@/context/useUser"; // Custom hook for accessing UserContext

const FamilyRegistration = ({ skipBtn }) => {
  const { toast } = useToast();
  const { regData } = useUser(); // Access registration data
  const { mutate, isLoading } = useAddFamily(); // Destructure the hook

  // Use `regData` to prepopulate the first parent
  const form = useForm({
    resolver: zodResolver(addFamilySchema),
    defaultValues: {
      parents: [
        {
          firstName: "",
          lastName: "",
          contactNumber: "",
        },
      ],
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
    const familyData = {
      userId: regData?.id, // Use `regData` for userId
      parents: data.parents,
      children: data.children,
    };

    mutate(familyData, {
      onSuccess: () => {
        toast({
          title: "Family Members Added Successfully",
          description:
            "The parent and child information has been successfully added to the system.",
        });
      },
      onError: (error) => {
        console.error("Error adding family members:", error);
        toast({
          title: "Error",
          description:
            "There was an issue adding the family members. Please try again.",
          variant: "destructive",
        });
      },
    });
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
            className="flex w-full flex-col gap-2 md:flex-row"
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
            className="flex w-full flex-col gap-2 md:flex-row"
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
          {/* Skip Button */}
          {skipBtn && (
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={skipBtn}>
                Skip
              </Button>
            </DialogClose>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || form.formState.isSubmitting}
          >
            {isLoading || form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Props validation
FamilyRegistration.propTypes = {
  skipBtn: PropTypes.func, // Require skipBtn to be a function, made optional here
};

export default FamilyRegistration;
