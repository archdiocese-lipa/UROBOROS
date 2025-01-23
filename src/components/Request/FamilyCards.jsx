import useInterObserver from "@/hooks/useInterObserver";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { fetchFamilies } from "@/services/familyService";
import Loading from "../Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";

const FamilyCards = () => {
  const {
    data,
    isLoading,
    _refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["family-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchFamilies({
        page: pageParam,
        pageSize: 10,
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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading families.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.pages?.flatMap((page) =>
        page?.items?.map((family) => (
          <Card key={family.id} className="p-2">
            <CardHeader className="p-2">
              <CardTitle className="font-montserrat font-bold text-accent">
                {family?.users?.last_name} Family
              </CardTitle>
              <CardDescription className="sr-only">
                Family Details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-1">
              {/* Parent(s) */}
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-accent">
                    Parent(s)/ Guardian(s)
                  </h3>
                </div>
              </div>
              {family.parents && (
                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* {family.parents.length < 1 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          <div className="flex w-full items-center justify-center">
                            <p>No data found.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )} */}
                    {/* <TableRow>
                      <TableCell>
                        <p>{`${family?.users?.first_name} ${family?.users?.last_name}`}</p>
                      </TableCell>
                      <TableCell>
                        <p>{`${family?.users?.contact_number}`}</p>
                      </TableCell>
                    </TableRow> */}
                    {family.parents.map((parent, i) => (
                      <TableRow
                        key={i}
                        className={cn(
                          i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                        )}
                      >
                        <TableCell className="text-nowrap py-1 md:p-4">
                          <p>{`${parent.first_name} ${parent.last_name}`}</p>
                        </TableCell>
                        <TableCell className="text-nowrap py-1 md:p-4">
                          <p>{`${parent.contact_number}`}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Children */}
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-accent">Children</h3>
              </div>
              {family.children && (
                <Table>
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {family.children.length < 1 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          <div className="flex w-full items-center justify-center">
                            <p>No data found.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {family.children.map((child, i) => (
                      <TableRow
                        key={i}
                        className={cn(
                          i % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                        )}
                      >
                        <TableCell className="text-nowrap py-1 md:p-4">
                          <p>{`${child.first_name} ${child.last_name}`}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ))
      )}
      

      {/* Loading Next Page */}
      {isFetchingNextPage && <Loading />}

      {/* Trigger for infinite scroll */}
      {hasNextPage && <div ref={ref}></div>}
    </div>
  );
};

export default FamilyCards;
