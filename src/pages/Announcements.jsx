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

import ReactSelect from "react-select";

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
import useInterObserver from "@/hooks/useInterObserver";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";

const Announcements = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUser();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState();
  const [formVisibility, setFormVisibility] = useState("public");
  const [searchParams, setSearchParams] = useSearchParams();
  const ministryId = searchParams.get("ministryId") || "";

  const { data: ministries } = useQuery({
    queryFn: async () => await fetchUserMinistries(userData?.id),
    queryKey: ["ministries", userData?.id],
    enabled: !!userData?.id,
  });

  const ministriesid = ministries?.map((ministry) => ministry.id);

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
    ministry_id: !searchParams.get("ministryId")
      ? ministriesid
      : searchParams.get("ministryId"),
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
    reset();
    setIsOpen(false);
  };

  const { ref } = useInterObserver(fetchNextPage);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex h-full w-full flex-col">
      {/* <div className="flex w-3/4 justify-between"> */}
      <div className="mb-2 flex w-3/4 items-end justify-between lg:mb-6">
        <div className="">
          <Title className="mb-0 lg:mb-3">Announcements</Title>
        </div>

        {(userData?.role == "admin" || userData.role == "volunteer") && (
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setImagePreview(null);
                form.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="absolute bottom-16 right-10 z-20 rounded-[15px] lg:static"
                variant="primary"
              >
                <Icon icon={"mingcute:announcement-fill"} className="h-5 w-5" />
                <p className="hidden lg:block"> Create Announcement</p>
              </Button>
            </DialogTrigger>
            <DialogContent className=" h-fit border-none px-9 pt-8 sm:rounded-3xl md:w-[600px]">
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
                            className="focus:ring-none no-scrollbar resize-none rounded-3xl border-none bg-primary text-accent placeholder:text-accent"
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
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file),
                                setImagePreview(URL.createObjectURL(file));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {imagePreview && (
                    <div className="flex items-center justify-center">
                      <img src={imagePreview} alt="image preview" />
                    </div>
                  )}

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
                  {formVisibility === "private" &&<FormField
                    control={form.control}
                    name="ministry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ministry</FormLabel>
                        <FormControl>
                          <ReactSelect
                            isMulti
                            options={ministries?.map((ministry) => ({
                              value: ministry.id,
                              label: `${ministry.ministry_name}`,
                            }))}
                            value={field.value.map((value) => ({
                              value,
                              label:
                                ministries?.find(
                                  (ministry) => ministry.id === value
                                )?.ministry_name || "",
                            }))}
                            onChange={(selectedOptions) => {
                              field.onChange(
                                selectedOptions.map((option) => option.value)
                              ); // Update field value to an array of ids
                            }}
                            placeholder="Select Ministry"
                            // disabled={formVisibility !== "private"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}

                  {/* Submit Button */}
                  <DialogFooter>
                    <div className="flex justify-end">
                      <Button
                        disabled={addAnnouncementMutation.isPending}
                        className="w-fit"
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
        )}
      </div>

      <div className="no-scrollbar flex h-full w-full flex-col-reverse gap-4 overflow-y-scroll lg:flex-row">
        {/* Announcements List */}
        <div className="no-scrollbar w-full flex-1 overflow-y-scroll rounded-none border-t border-primary-outline p-1 pt-3 md:rounded-xl md:border md:bg-primary md:px-9 md:py-6">
          {isLoading && <Loading />}

          {data?.pages?.flatMap((page) => page.items).length === 0 ? (
            <p>No announcements yet.</p>
          ) : (
            data?.pages?.flatMap((page) =>
              page?.items?.map((announcement) => (
                <div
                  key={announcement.id}
                  className="mb-3 w-full rounded-lg border border-primary-outline bg-[#f9f7f7b9] px-4 pb-6 pt-3 md:bg-white md:px-8 md:pt-5"
                >
                  <Announcement
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

          {hasNextPage && <div className="mt-20" ref={ref}></div>}
        </div>
        {/* Sidebar */}
        <div className="no-scrollbar flex w-full flex-row gap-2 overflow-y-hidden overflow-x-scroll rounded-[120px] border border-primary-outline px-2 py-[6px] md:gap-3 md:rounded-[15px] lg:w-1/4 lg:flex-col lg:gap-0 lg:overflow-y-scroll lg:p-2 lg:px-8 lg:py-6">
          <p className="hidden font-bold text-accent lg:mb-3 lg:block">
            Filter by your ministry.
          </p>
          <div
            className={cn(
              "h-fit rounded-[100px] border border-gray/0 bg-accent/5 md:rounded-xl md:border-gray lg:bg-white",
              {
                "bg-accent lg:bg-accent": !searchParams.get("ministryId"),
              }
            )}
          >
            <button
              onClick={() => {
                navigate("/announcements");
              }}
              className="relative h-10 w-full px-[18px] md:h-20 lg:h-fit lg:py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={cn("font-bold text-accent", {
                    "text-white": !searchParams.get("ministryId"),
                  })}
                >
                  All
                </h3>
                <div className="flex h-6 items-center justify-center rounded-[18.5px] bg-[#D3C9C5] px-3 py-3 text-accent hover:cursor-pointer lg:h-7 lg:bg-primary">
                  {/* <img src={GlobeIcon} alt="up icon" className="bg-pr h-5 w-5" /> */}
                  <GlobeIcon className="h-4 w-4" />
                </div>
              </div>
              <p
                className={cn(
                  "hidden pb-1 text-start text-[13px] font-medium text-accent opacity-60 lg:block",
                  { "text-white opacity-60": !searchParams.get("ministryId") }
                )}
              >
                This shows all group announcements
              </p>
              {!searchParams.get("ministryId") && (
                <div className="left-0 top-1/2 hidden h-8 w-2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-accent lg:absolute lg:-left-4 lg:block"></div>
              )}
            </button>
          </div>

          <Separator className="my-3 hidden bg-gray lg:block" />
          <div className="flex items-center justify-center gap-2 md:items-stretch md:gap-3 lg:mb-3 lg:block">
            {ministries?.map((ministry) => (
              <Filter
                key={ministry.id}
                ministry={ministry}
                selectedMinistry={ministryId}
                setSelectedMinistry={setSearchParams}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
