import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <Label>Parent/Guardian Information</Label>
        <div className="flex flex-col md:flex-row w-full gap-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="parentFirstName"
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
              name="parentLastName"
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
        </div>
        <Label>Child Information</Label>
        <div className="flex flex-col md:flex-row w-full gap-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="childFirstName"
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
              name="childLastName"
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
