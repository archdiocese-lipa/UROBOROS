import { Icon } from "@iconify/react";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Announcement from "@/components/Announcements/Announcement";
import Filter from "@/components/Announcements/Filter";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GlobeIcon } from "@/assets/icons/icons";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AnnouncementSchema } from "@/zodSchema/AnnouncementSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import useAnnouncements from "@/hooks/useAnnouncements";
import { useUser } from "@/context/useUser";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllMinistries } from "@/services/ministryService";
import AssignVolunteerComboBox from "@/components/Schedule/AssignVolunteerComboBox";

const Announcements = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUser();
  const [visibility, setVisibility] = useState("public");
  const [formVisibility, setFormVisibility] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("");

  const { data: ministries } = useQuery({
    queryFn: async () => await getAllMinistries(),
    queryKey: ["ministries"],
  });

  const form = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
      file: "",
      ministry: [],
      visibility: "",
    },
  });

  const {
    addAnnouncementMutation,
    deleteAnnouncementMutation,
    editAnnouncementMutation,
    data,
    isLoading,
  } = useAnnouncements(selectedMinistry);

  const { reset, formState } = form;

  const onSubmit = (announcementData) => {

    console.log("Form data before submit:",announcementData, form.getValues()); // Log form values
    addAnnouncementMutation.mutate({
      announcementData,
      user_id: userData.id,
      reset,
      setIsOpen,
    });
  };

  console.log(formState.errors);
  return (
    <div className="flex h-full w-full gap-8">
      <div className="flex w-3/4 flex-col">
        <div className="mb-6 flex items-end justify-between">
          <div className="">
            <Title>Announcements</Title>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-[15px]" variant="primary">
                <Icon icon={"mingcute:announcement-fill"} className="h-5 w-5" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="no-scrollbar h-[450px] w-[600px] overflow-y-scroll border-none px-9 pt-8 sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-accent">
                  Create Announcement
                </DialogTitle>
              </DialogHeader>

              <Form id="announcement-form" {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                  encType="multipart/form-data"
                >
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Announcement Title</FormLabel>
                        <FormControl>
                          <Input
                            className="text-accent"
                            placeholder="Title of your announcement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Announcement Content</FormLabel>
                        <FormControl>
                          <Textarea
                            className="focus:ring-none no-scrollbar rounded-3xl border-none bg-primary text-accent placeholder:text-accent"
                            placeholder="Content of your announcement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Field */}
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Announcement Image</FormLabel>
                        <FormControl>
                          <Input
                            // {...fieldProps}
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Visibility Select */}
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Announcement Visibility</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              // When visibility changes to 'public', set ministry to "wow"
                              if (value === "public") {
                                form.setValue("ministry", []); // Set ministry to "wow" when public
                                setFormVisibility("public"); // Set form visibility to public
                              } else {
                                setFormVisibility("private"); // Set form visibility to private
                              }

                              field.onChange(value); // Update the visibility field value
                            }}
                          >
                            <SelectTrigger className="w-full rounded-3xl">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent className="rounded-3xl">
                              <SelectGroup>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ministry Select */}
                  <FormField
                    control={form.control}
                    name="ministry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Announcement Ministry</FormLabel>
                        <FormControl>
                          <AssignVolunteerComboBox
                            options={ministries?.data?.map((ministry) => ({
                              value: ministry.id, // Use 'id' as the value
                              label: `${ministry.ministry_name}`, // Combine first name and last name
                            }))}
                            value={Array.isArray(field.value) ? field.value : []} // Ensure it's always an array
                            onChange={field.onChange} // Handle change to update the form state
                            placeholder="Select Ministry"
                            disabled={formVisibility !== "private"} // Disable combo box if visibility is not private
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <DialogFooter>
                    <Button
                      disabled={addAnnouncementMutation.isPending}
                      className="w-full"
                      type="submit"
                    >
                      {addAnnouncementMutation.isPending
                        ? "Submitting..."
                        : "Submit"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Announcements List */}
        <div className="no-scrollbar w-full flex-1 overflow-y-scroll rounded-2xl border border-primary-outline bg-primary px-9 py-6">
          {isLoading && <p>Loading...</p>}

          {data?.map((announcement, index) => (
            <div
              key={index}
              className="mb-3 w-full rounded-[10px] border border-primary-outline bg-white px-8 pb-6 pt-5"
            >
              <Announcement
                // form={editform}
                announcement={announcement}
                editAnnouncementMutation={editAnnouncementMutation}
                deleteAnnouncementMutation={deleteAnnouncementMutation}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="no-scrollbar mt-[64px] w-1/4 overflow-y-scroll rounded-[15px] border border-primary-outline px-8 py-6">
        <p className="mb-3 font-bold text-accent">Filter by your groups.</p>
        <div
          className={cn("rounded-xl border border-gray bg-white", {
            "bg-accent": visibility === "public",
          })}
        >
          <button
            onClick={() => {
              setVisibility("public"), setSelectedMinistry("");
            }}
            className="relative w-full px-[18px] py-3"
          >
            <div className="flex justify-between">
              <h3
                className={cn("font-bold text-accent", {
                  "text-white": visibility === "public",
                })}
              >
                All
              </h3>
              <div className="flex h-7 items-center justify-center rounded-[18.5px] bg-primary px-3 py-3 text-accent hover:cursor-pointer">
                {/* <img src={GlobeIcon} alt="up icon" className="bg-pr h-5 w-5" /> */}
                <GlobeIcon className="h-4 w-4" />
              </div>
            </div>
            <p
              className={cn(
                "pb-1 text-start text-[13px] font-medium text-accent opacity-60",
                { "text-white opacity-60": visibility === "public" }
              )}
            >
              This shows all group announcements
            </p>
            {/* <div className="relative flex h-8 w-full justify-start">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    left: ${i * 20}px,
                    zIndex: 10 - i,
                  }}
                  className={cn(absolute rounded-full bg-white p-[3px], {
                    "bg-accent": visibility === "public",
                  })}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div> */}
            {selectedMinistry === "" && (
              <div className="absolute -left-4 top-1/2 h-8 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-accent"></div>
            )}
          </button>
        </div>

        <Separator className="my-3 bg-gray" />
        <div className="mb-3">
          {ministries?.data?.map((ministry, i) => (
            <Filter
              key={i}
              ministry={ministry}
              selectedMinistry={selectedMinistry}
              setSelectedMinistry={setSelectedMinistry}
              setVisibility={setVisibility}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;