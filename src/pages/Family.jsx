import NewFamilyForm from "@/components/Family/NewFamilyForm";
import { Title } from "@/components/Title";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreeDotsIcon } from "@/assets/icons/icons";

import { useFamilyData } from "@/hooks/useFamilyData";
import { useDeleteChild, useDeleteParent } from "@/hooks/useFamily";
import EditChild from "@/components/Family/EditChild";
import EditParent from "@/components/Family/EditParent";

const Family = () => {
  const { parentData, childData, isLoading, error } = useFamilyData();

  const { mutateAsync: deleteParent } = useDeleteParent();
  const { mutateAsync: deleteChild } = useDeleteChild();

  // Handle parent deletion
  const handleDeleteParent = async (parentId) => {
    await deleteParent(parentId); // Error automatically handled by useMutation's onError
  };

  // Handle child deletion
  const handleDeleteChild = async (childId) => {
    await deleteChild(childId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Title>Family information</Title>
      <div className="mt-5">
        <NewFamilyForm />
      </div>
      {/* Family Members */}
      <div className="flex flex-col justify-center gap-2 lg:flex-row">
        <div className="no-scrollbar h-96 flex-1 overflow-scroll rounded-xl border border-primary p-5 lg:h-auto">
          <Label className="text-primary-text">Parent/Guardian</Label>
          <Table>
            <TableHeader className="rounded-xl bg-primary">
              <TableRow>
                <TableHead className="rounded-l-lg text-center">Name</TableHead>
                <TableHead className="text-center">Contact</TableHead>
                <TableHead className="rounded-r-lg text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!parentData?.length ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No parent/guardian data available.
                  </TableCell>
                </TableRow>
              ) : (
                parentData?.flatMap((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell className="text-center">{`${parent.first_name} ${parent.last_name}`}</TableCell>
                    <TableCell className="text-center">
                      {parent.contact_number}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <ThreeDotsIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <EditParent
                              parentId={parent.id}
                              parentFirstName={parent.first_name}
                              parentLastName={parent.last_name}
                              parentContactNumber={parent.contact_number}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteParent(parent.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="no-scrollbar h-96 overflow-scroll rounded-xl border-2 border-primary p-5 lg:h-auto">
          <Label className="text-primary-text">Children</Label>
          <Table>
            <TableHeader className="bg-primary">
              <TableRow className="text-center">
                <TableHead className="rounded-l-lg text-center">Name</TableHead>
                <TableHead className="rounded-r-lg text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!childData?.length ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No children data available.
                  </TableCell>
                </TableRow>
              ) : (
                childData?.flatMap((child) => (
                  <TableRow key={child.id}>
                    <TableCell className="text-center">{`${child.first_name} ${child.last_name}`}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <ThreeDotsIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <EditChild
                              childId={child.id}
                              childFirstName={child.first_name}
                              childLastName={child.last_name}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteChild(child.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Family;
