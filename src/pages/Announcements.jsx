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
import { fetchUserMinistries } from "@/services/ministryService";
import AssignVolunteerComboBox from "@/components/Schedule/AssignVolunteerComboBox";
import useInterObserver from "@/hooks/useInterObserver";

const Announcements = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUser();
  const [visibility, setVisibility] = useState("public");
  const [formVisibility, setFormVisibility] = useState("public");
  const [selectedMinistry, setSelectedMinistry] = useState("");

  const { data: ministries } = useQuery({
    queryFn: async () => await fetchUserMinistries(userData?.id),
    queryKey: ["ministries", userData?.id],
    enabled: !!userData?.id,
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

  const { reset } = form;

  const {
    addAnnouncementMutation,
    fetchNextPage,
    deleteAnnouncementMutation,
    hasNextPage,
    editAnnouncementMutation,
    data,
    isLoading,
  } = useAnnouncements({
    ministry_id: selectedMinistry,
    reset,
    setIsOpen,
    user_id: userData?.id,
  });

  const onSubmit = (announcementData) => {
    addAnnouncementMutation.mutate({
      announcementData,
      first_name: userData?.first_name,
      last_name: userData?.last_name,
    });
    reset, setIsOpen(false);
  };

  const { ref } = useInterObserver(fetchNextPage);

  if (!userData) return <div>Loading...</div>;

  console.log("selected ministry",selectedMinistry)

  return (
    <div className="flex h-full w-full flex-col">
      {/* <div className="flex w-3/4 justify-between"> */}
      <div className="mb-6 flex w-3/4 items-end justify-between">
        <div className="">
          <Title className="mb-0 lg:mb-3">Announcements</Title>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="absolute bottom-16 right-10 z-20 rounded-[15px] lg:static"
              variant="primary"
            >
              <Icon icon={"mingcute:announcement-fill"} className="h-5 w-5" />
              <p className="hidden lg:block"> Create Announcement</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="no-scrollbar h-full w-fullp md:h-[450px] md:w-[600px] overflow-y-scroll border-none px-9 pt-8 sm:rounded-3xl">
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
                      <FormLabel>Title</FormLabel>
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
                      <FormLabel>Content</FormLabel>
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
                      <FormLabel>Image/File</FormLabel>
                      <FormControl>
                        <Input
                          // {...fieldProps}
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
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
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            if (value === "public") {
                              form.setValue("ministry", []);
                              setFormVisibility("public");
                            } else {
                              setFormVisibility("private");
                            }

                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent className="">
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
                      <FormLabel>Ministry</FormLabel>
                      <FormControl>
                        <AssignVolunteerComboBox
                          options={ministries?.map((ministry) => ({
                            value: ministry.id,
                            label: `${ministry.ministry_name}`,
                          }))}
                          value={Array.isArray(field.value) ? field.value : []}
                          onChange={field.onChange}
                          placeholder="Select Ministry"
                          disabled={formVisibility !== "private"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <DialogFooter>
                  <div className="flex justify-end">
                  <Button
                    disabled={addAnnouncementMutation.isPending}
                    className=" w-fit"
                    type="submit"
                  >
                    {addAnnouncementMutation.isPending
                      ? "Posting..."
                      : "Post"}
                  </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 
      </div> */}

      <div className="no-scrollbar flex h-full w-full flex-col-reverse gap-4 overflow-y-scroll lg:flex-row">
        {/* Announcements List */}
        <div className="no-scrollbar w-full flex-1 overflow-y-scroll rounded-2xl border border-primary-outline bg-primary px-9 py-6">
          {isLoading && <p>Loading...</p>}

          {data?.pages?.flatMap((page) => page.items).length === 0 ? (
            <p>No announcements yet.</p>
          ) : (
            data?.pages?.flatMap((page) =>
              page?.items?.map((announcement) => (
                <div
                  key={announcement.id}
                  className="mb-3 w-full rounded-[10px] border border-primary-outline bg-white px-8 pb-6 pt-5"
                >
                  <Announcement
                    // form={editform}
                    ministries={ministries}
                    fetchNextPage={fetchNextPage}
                    announcement={announcement}
                    editAnnouncementMutation={editAnnouncementMutation}
                    deleteAnnouncementMutation={deleteAnnouncementMutation}
                  />
                </div>
              ))
            )
          )}

          {hasNextPage && <div ref={ref}></div>}
        </div>
        {/* Sidebar */}
        <div className="no-scrollbar flex w-full flex-row gap-3 overflow-x-scroll overflow-y-hidden rounded-[15px] border border-primary-outline p-2 lg:w-1/4 lg:flex-col lg:gap-0 lg:overflow-y-scroll lg:px-8 lg:py-6">
          <p className="font-bold text-accent lg:mb-3">
            Filter by your ministry.
          </p>
          <div
            className={cn("h-fit rounded-xl border border-gray bg-white", {
              "bg-accent": visibility === "public",
            })}
          >
            <button
              onClick={() => {
                setVisibility("public"), setSelectedMinistry("");
              }}
              className="relative h-20 w-full px-[18px] py-3 lg:h-fit"
            >
              <div className="flex justify-between gap-3">
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
                  "hidden pb-1 text-start text-[13px] font-medium text-accent opacity-60 lg:block",
                  { "text-white opacity-60": visibility === "public" }
                )}
              >
                This shows all group announcements
              </p>
              {selectedMinistry === "" && (
                <div className=" -left-4 top-1/2 hidden lg:block h-8 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-accent lg:absolute"></div>
              )}
            </button>
          </div>

          <Separator className="my-3 hidden bg-gray lg:block" />
          <div className="flex gap-3 lg:mb-3 lg:block">
            {ministries?.map((ministry, i) => (
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
    </div>
  );
};

export default Announcements;
