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

import {
  useFetchChildren,
  useFetchFamilyId,
  useFetchGuardian,
} from "@/hooks/useFetchFamily";
import { useUser } from "@/context/useUser";
import EditChild from "@/components/Family/EditChild";
import EditParent from "@/components/Family/EditParent";
import { useDeleteChild, useDeleteParent } from "@/hooks/useUpdateFamily";

const Family = () => {
  const { userData } = useUser();
  const userId = userData?.id;

  // Fetch familyId based on the userId
  const {
    data: familyData,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFetchFamilyId(userId);

  // Fetch guardian data based on familyId
  const {
    data: parentData,
    isLoading: isParentLoading,
    error: parentError,
  } = useFetchGuardian(familyData?.id);

  // Fetch guardian data based on familyId
  const {
    data: childData,
    isLoading: isChildLoading,
    error: childError,
  } = useFetchChildren(familyData?.id);

  // Delete pa // Delete Child
  const { mutateAsync: deleteParent } = useDeleteParent();

  const handleDeleteParent = async (parentId) => {
    try {
      await deleteParent(parentId);
    } catch (error) {
      console.error("Error deleting parent:", error.message);
    }
  };

  // Delete Child
  const { mutateAsync: deleteChild } = useDeleteChild();

  const handleDeleteChild = async (childId) => {
    try {
      await deleteChild(childId);
    } catch (error) {
      console.error("Error deleting child:", error.message);
    }
  };

  if (isFamilyLoading || isParentLoading || isChildLoading) {
    return <div>Loading...</div>;
  }

  if (familyError) {
    return <div>Error fetching family data: {familyError.message}</div>;
  }

  if (parentError || childError) {
    return <div>Error fetching parent data: {parentError.message}</div>;
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
                <p>No parent/guardian data available.</p>
              ) : (
                parentData.flatMap((parent) => (
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
                <p>No children data available.</p>
              ) : (
                childData.flatMap((child) => (
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
