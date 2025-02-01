import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchFamilies, fetchParents } from "@/services/familyService";
import Loading from "../Loading";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useInterObserver from "@/hooks/useInterObserver";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AssignVolunteerComboBox from "./AssignVolunteerComboBox";
import { useFetchChildren } from "@/hooks/useFamily";
import { useEffect, useState,useMemo } from "react";
import useAddRecord from "@/hooks/Schedule/useAddRecord";
import { existingRecordSchema } from "@/zodSchema/AddFamilySchema";
import PropTypes from "prop-types";


const AddExistingRecord = ({ eventId }) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [open,setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(existingRecordSchema),
    defaultValues: {
      family: { userid: "", id: "", value: "" },
      parents: [],
      children: [],
    },
  });

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["family-list"],
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchFamilies({
          page: pageParam,
          pageSize: 100,
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.nextPage ? lastPage.currentPage + 1 : undefined,
    });

  const {data:parentData, isLoading:isParentLoading, isFetching:isParentFetching} = useQuery({
    queryKey: ["parent", selectedFamilyId],
    queryFn: async () => fetchParents(selectedFamilyId),
    enabled: !!selectedFamilyId
  })
  const {
    data: childData,
    isLoading: isChildLoading,
    isFetching: isChildFetching,
  } = useFetchChildren(selectedFamilyId);

  const familyOptions = useMemo(() => {
    return data?.pages
      ?.flatMap((page) => page.items)
      ?.map((family) => ({
        userid: family.users.id,
        id: family.id,
        value: `${family.users.first_name} ${family.users.last_name}`,
      })) || [];
  }, [data]);

  const parentOptions = useMemo(() => {
    return Array.isArray(parentData)
      ? parentData.map((parent) => ({
          id: parent.id,
          value: parent,
          label: `${parent.first_name} ${parent.last_name}`,
        }))
      : [];
  }, [parentData]);

  const childOptions = useMemo(() => {
    return Array.isArray(childData)
      ? childData?.map((child) => ({
          id: child.id,
          value: child,
          label: `${child.first_name} ${child.last_name}`,
        }))
      : [];
  }, [childData]);
  const { ref } = useInterObserver(fetchNextPage);


  const mutation = useAddRecord({eventId});
  const onSubmit = (values) => {
    mutation.mutate({
      event: eventId,
      parents: values.parents.map((parent) => ({
        parentFirstName: parent.first_name,
        parentLastName: parent.last_name,
        parentContactNumber: parent.contact_number,
      })),
      children: values.children.map((child) => ({
        childFirstName: child.first_name,
        childLastName: child.last_name,
      })),
      registered_by: form.getValues().family.userid,
    });
    form.reset();
    setOpen(false);
  };
useEffect(() => {
  if(selectedFamilyId){
    form.setValue("parents", []);
    form.setValue("children", []);
  }

},[selectedFamilyId,open])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add From Family Record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-accent">Add From Existing Family Record</DialogTitle>
          <DialogDescription>
            Add a new record from the existing family in the database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <FormField
              control={form.control}
              name="family"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family</FormLabel>
                  <FormControl>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value.id
                            ? `${field?.value?.value}`
                            : "Select family..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="h-40 p-0 sm:w-[29rem]"
                        align="start"
                      >
                        <Command shouldFilter={true}>
                          <CommandInput placeholder="Search families..." />
                          <CommandList>
                            <CommandEmpty>
                              {isLoading ? "Loading..." : "No families found"}
                            </CommandEmpty>
                            <CommandGroup>
                              {familyOptions.map((family) => (
                                <CommandItem
                                  key={family.id}
                                  value={family.value}
                                  onSelect={() => {
                                    setSelectedFamilyId(family.id),
                                    field.onChange(family);
                                  }}
                                >
                                  {family.value}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      field.value.id === family.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                              {hasNextPage && <div ref={ref} className="h-2" />}
                              {isFetchingNextPage && (
                                <Loading className="p-4" />
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parents<span className=" text-xs text-zinc-400">(Optional)</span></FormLabel>
                  <FormControl>
                
                      <AssignVolunteerComboBox
                        isLoading={isParentLoading || isParentFetching}
                        options={parentOptions || []}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Parents"
                        disabled={form.getValues().family.id === ""}
                      />
         
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Children</FormLabel>
                  <FormControl>
              
                      <AssignVolunteerComboBox
                        isLoading={isChildLoading || isChildFetching}
                        options={childOptions || []}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Children"
                        disabled={form.getValues().family.id === ""}
                      />
               
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => form.reset()} type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="outline">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

AddExistingRecord.propTypes = {
  eventId: PropTypes.string.isRequired, 
};

export default AddExistingRecord;
