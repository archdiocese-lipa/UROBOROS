import { Title, Description } from "@/components/Title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { INVOICES } from "@/constants/invoices";

import DownIcon from "@/assets/icons/down-icon.svg";

const Requests = () => {
  return (
    <>
      <Title>Requests</Title>
      <Description>Manage your organisation&apos;s community.</Description>

      <Tabs defaultValue="volunteers" className="w-full mt-7">
        <TabsList>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="parishioners">Parishioners</TabsTrigger>
        </TabsList>

        <div className=" mt-2 py-2 pl-4 pr-1 rounded-full border border-primary w-fit p ">
          <div className=" items-center flex gap-4">
            <p className=" font-semibold text-accent text-md">All Volunteers</p>
            <div className=" hover:cursor-pointer flex items-center justify-center w-11 h-7 bg-secondary-accent text-white rounded-[18.5px] px-2">
              <img src={DownIcon} alt={`up icon`} className="h-2 w-4" />
            </div>
          </div>
        </div>

        <TabsContent value="volunteers">
          <Table>
            <TableHeader className=" bg-primary ">
              <TableRow>
                <TableHead className="text-center rounded-l-lg">
                  Email
                </TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Contact</TableHead>
                <TableHead className="text-center rounded-r-lg">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice, index) => (
                <TableRow
                  className={cn(
                    index % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                  )}
                  key={invoice.email}
                >
                  <TableCell className="text-center w-[300px]">
                    {invoice.email}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
                    {invoice.name}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
                    {invoice.contact}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
                    {invoice.action}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="parishioners">
          <Table>
            <TableHeader className=" bg-primary ">
              <TableRow>
                <TableHead className="text-center rounded-l-lg">
                  Email
                </TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Contact</TableHead>
                <TableHead className="text-center rounded-r-lg">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice, index) => (
                <TableRow
                  className={cn(
                    index % 2 !== 0 ? "bg-primary bg-opacity-35" : "bg-white"
                  )}
                  key={invoice.email}
                >
                  <TableCell className="text-center w-[300px]">
                    {invoice.email}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
                    {invoice.name}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
                    {invoice.contact}
                  </TableCell>
                  <TableCell className="text-center w-[300px]">
                    {invoice.action}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Requests;
