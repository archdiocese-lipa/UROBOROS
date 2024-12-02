import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Switch } from "@/components/ui/switch";

import { Title, Description } from "@/components/Title";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  // SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import NewProfileForm from "@/components/NewProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

import useInterObserver from "@/hooks/useInterObserver";

import { getUsers } from "@/services/userService";

import { cn } from "@/lib/utils";
// import DownIcon from "@/assets/icons/down-icon.svg";
import useActivateUser from "@/hooks/useActivateUser";

const Requests = () => {
  const [tab, setTab] = useState("volunteer");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const { mutate: activateUser } = useActivateUser(); // Use activateUser mutation hook

  const {
    data,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    _isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["users-list", tab, activeFilter], // Include activeFilter in the query key
    queryFn: async ({ pageParam }) => {
      const response = await getUsers({
        activeFilter,
        page: pageParam,
        pageSize: 10,
        role: tab,
      });

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });

  const { ref } = useInterObserver(fetchNextPage);

  const onDialogStateChange = (state) => {
    setOpen(state);
    if (!state) {
      setSelectedRow(null);
      async () => await refetch();
    }
  };

  const onRowEdit = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleStatusChange = (checked, id) => {
    // Check if the mutate function is available
    if (activateUser) {
      activateUser({
        id, // User ID
        payload: checked, // Passing the boolean value directly for activation/deactivation
      });
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="no-scrollbar flex h-full flex-col gap-7 overflow-y-auto">
      <div>
        <Title>Requests</Title>
        <Description>Manage your organisation&apos;s community.</Description>
      </div>
      <div>
        <Tabs
          onValueChange={(value) => setTab(value)}
          defaultValue={tab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="volunteer">Volunteers</TabsTrigger>
            <TabsTrigger value="parishioner">Parishioners</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-2 flex h-fit w-fit items-center gap-3">
          {/* <div className="w-fit rounded-full border border-primary py-2 pl-4 pr-1">
            <div className="flex items-center gap-4">
              <p className="text-md font-semibold text-accent">
                All Volunteers
              </p>

              <div className="flex h-7 w-11 items-center justify-center rounded-[18.5px] bg-secondary-accent px-2 text-white hover:cursor-pointer">
                <img src={DownIcon} alt={`up icon`} className="h-2 w-4" />
              </div>
            </div>
          </div> */}
          <Select onValueChange={(value) => setActiveFilter(value)}>
            <SelectTrigger className="rounded-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Dialog
            open={open}
            onOpenChange={(state) => onDialogStateChange(state)}
          >
            <DialogTrigger asChild>
              <Button>Create User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {!selectedRow ? "Create New Profile" : "Update Profile"}
                </DialogTitle>
                <DialogDescription>
                  {!selectedRow
                    ? "Create a new user profile"
                    : "Update existing user profile"}
                </DialogDescription>
              </DialogHeader>
              <NewProfileForm
                user={selectedRow}
                onFormSubmitSuccess={() => onDialogStateChange(false)}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button form="new-user-form">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {!isLoading ? (
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="rounded-l-lg text-center">Active</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Contact</TableHead>

              <TableHead className="rounded-r-lg text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.flatMap((page) =>
              page.items.map((row, j) => (
                <TableRow
                  key={j}
                  className={cn(
                    j % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                  )}
                >
                  <TableCell className="text-center">
                    <Switch
                      checked={row.is_confirmed}
                      onCheckedChange={(checked) =>
                        handleStatusChange(checked, row.id)
                      } // Trigger optimistic update
                      aria-label="Confirmation Status"
                    />
                  </TableCell>
                  <TableCell className="w-[300px] text-center">
                    {row.email}
                  </TableCell>
                  <TableCell className="w-[300px] text-center">
                    {`${row.first_name} ${row.last_name}`}
                  </TableCell>
                  <TableCell className="w-[300px] text-center">
                    {row.contact_number}
                  </TableCell>

                  <TableCell className="w-[300px] text-center">
                    <Button
                      onClick={() => onRowEdit(row)}
                      variant="outline"
                      className="h-auto rounded-xl px-2 text-accent hover:text-orange-500"
                    >
                      <Icon icon="mingcute:pencil-3-line" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {hasNextPage && (
              <TableRow ref={ref}>
                <TableCell colSpan={4}>
                  <Skeleton className="h-10 w-full rounded-xl" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <Skeleton className="h-96 w-full rounded-xl" />
      )}
    </div>
  );
};

export default Requests;
