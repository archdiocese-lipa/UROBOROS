import { Separator } from "@/components/ui/separator";
import { KebabIcon, GlobeIcon, PersonIcon } from "@/assets/icons/icons";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { AnnouncementSchema } from "@/zodSchema/AnnouncementSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/context/useUser";
import Comments from "../Comments";
import TriggerLikeIcon from "../CommentComponents/TriggerLikeIcon";
import AssignVolunteerComboBox from "../Schedule/AssignVolunteerComboBox";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncementMinistryId } from "@/services/AnnouncementsService";

const Announcement = ({
  ministries,
  announcement,
  editAnnouncementMutation,
  deleteAnnouncementMutation,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState();
  const [editDialogOpen, setEditDialogOpen] = useState();
  const { userData } = useUser();
  const [formVisibility, setFormVisibility] = useState(announcement.visibility);

  const form = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: announcement.title,
      content: announcement.content,
      file: null,
      ministry: [],
      visibility: announcement.visibility,
    },
  });

  const { data: MinistryIds } = useQuery({
    queryFn: async () => await getAnnouncementMinistryId(announcement?.id),
    queryKey: ["ministryIds", announcement?.id],
    enabled: !!announcement?.id,
  });


  useEffect(() => {
    // Ensure the form is reset with the latest announcement data
    form.reset({
      title: announcement.title,
      content: announcement.content,
      file: null,
      ministry: MinistryIds ? MinistryIds : [],
      visibility: announcement.visibility,
    });
  }, [announcement, MinistryIds, form]);

  const onSubmit = (announcementData) => {
    editAnnouncementMutation.mutate({
      announcementData: {
        ...announcementData,
        user_id: userData?.id,
        announcement_id: announcement.id,
        filePath: announcement.file_path,
      },
      first_name: userData?.first_name,
      last_name: userData?.last_name,
    });
    form.reset();
    setEditDialogOpen(false);
  };

  if (!userData) {
    return null;
  }
  // console.log("single announcement", announcement);

  // console.log("ministryIDs", MinistryIds);
  return (
    <div>
      <div className="mb-3 flex justify-between">
        <div>
          <h2 className="text-lg font-bold text-accent">
            {announcement.title}
          </h2>
          <div className="flex gap-2">
            <p className="text-sm font-bold text-accent">
              {`${announcement?.users?.first_name} ${announcement?.users?.last_name}`}
            </p>
            <p className="text-sm text-accent">
              {new Date(announcement.created_at).toDateTime()}
            </p>
            {/* <img src={GlobeIcon} alt="icon" /> */}
            {announcement.visibility === "public" ? (
              <GlobeIcon className="h-4 w-4 text-accent" />
            ) : (
              <PersonIcon className="h-4 w-4 text-accent" />
            )}
          </div>
        </div>

        {userData?.id === announcement?.user_id && (
          <Popover>
            <PopoverTrigger>
              <KebabIcon className="h-6 w-6 text-accent" />
            </PopoverTrigger>
            <PopoverContent align="center" className="w-32 overflow-hidden p-0">
              <div className="p-2">
                <p className="text-center font-semibold">Actions</p>
              </div>
              <Separator />
              <Dialog
                open={editDialogOpen}
                onOpenChange={(open) => {
                  setEditDialogOpen(open);
                  // open && editSetValue("classname", classdata.class_name);
                  // !open && reset();
                }}
              >
                <DialogTrigger className="w-full" asChild>
                  <Button
                    variant="ghost"
                    // onClick={() => deleteClassMutation.mutate(classdata.id)}
                    className="w-full rounded-none p-3 hover:cursor-pointer"
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-md max-h-[75%] overflow-y-scroll no-scrollbar">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-accent">
                      Edit Announcement
                    </DialogTitle>
                    {/* <Separator /> */}
                  </DialogHeader>
                  <div>
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
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0])
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-center">
                        <img src={announcement.file_url} alt="" />
                        </div>

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
                                    // Reset the ministry field to an empty array when the visibility is public
                                    if (value === "public") {
                                      form.setValue("ministry", []);
                                    }
                                    setFormVisibility(`${value}`);
                                    field.onChange(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select visibility" />
                                  </SelectTrigger>
                                  <SelectContent className="">
                                    <SelectGroup>
                                      <SelectItem value="public">
                                        Public
                                      </SelectItem>
                                      <SelectItem value="private">
                                        Private
                                      </SelectItem>
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
                                  value={
                                    Array.isArray(field.value)
                                      ? field.value
                                      : []
                                  } // Ensure it's always an array
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
                              disabled={editAnnouncementMutation.isPending}
                              className="w-full"
                              type="submit"
                            >
                              {editAnnouncementMutation.isPending
                                ? "Editting..."
                                : "Edit"}
                            </Button>
                          </div>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={(isOpen) => {
                  setDeleteDialogOpen(isOpen);
                }}
              >
                <DialogTrigger className="w-full" asChild>
                  <Button
                    variant="ghost"
                    className="w-full rounded-none text-start hover:cursor-pointer"
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-accent">
                      Delete Announcement?
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="text-accent opacity-80">
                    Are you sure you want to delete this Announcement?
                  </DialogDescription>
                  <DialogFooter className="mx-2 flex gap-2">
                    <Button
                      onClick={() => setDeleteDialogOpen(false)}
                      className="rounded-xl text-accent hover:text-accent"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-xl"
                      variant={"destructive"}
                      onClick={() => {
                        deleteAnnouncementMutation.mutate({
                          announcement_id: announcement.id,
                          filePath: announcement.file_path,
                        });
                        setDeleteDialogOpen(false);
                      }}
                      disabled={deleteAnnouncementMutation.isPending}
                    >
                      {deleteAnnouncementMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <p className="mb-4 text-justify text-accent">{announcement.content}</p>

      {announcement?.file_type &&
        announcement?.file_type.startsWith("image") && (
          <img className="mb-2" src={announcement.file_url} alt="file" />
        )}
      {announcement?.file_type &&
        announcement?.file_type.startsWith("application") && (
          <div>
            <a href={announcement.file_url} target="_blank" download>
              <p>{announcement.file_name}</p>
            </a>
          </div>
        )}
      {announcement?.file_type &&
        announcement?.file_type.startsWith("video") && (
          <video
            className="mb-2"
            controls
            src={announcement.file_url}
            alt="file"
          />
        )}
      <div className="flex items-end justify-between">
        <div className="relative h-5">
          {/* <img src={LikeIcon} alt={`up icon`} className="h-5 w-5" /> */}

          {/* </div> */}
          <TriggerLikeIcon
            className={"absolute w-14 rounded-3xl bg-white p-1"}
            comment_id={announcement.id}
            user_id={userData?.id}
            columnName={"announcement_id"}
          />
          {/* <div className="flex h-6 w-12 items-center justify-center gap-1 rounded-[18.5px] bg-primary px-3 py-3 text-accent hover:cursor-pointer">
          <img src={EyeIcon} alt={`up icon`} className="h-5 w-5" />
          <p className="text-sm font-semibold text-accent">1</p>*/}
        </div>
      </div>
      <Separator className="my-5" />

      <Comments
        announcement_id={announcement?.id}
        // columnName={"entity_id"}
      />
    </div>
  );
};

Announcement.propTypes = {
  announcement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    file_path: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    visibility: PropTypes.string.isRequired,
    file_url: PropTypes.string,
    file_name: PropTypes.string.isRequired,
    file_type: PropTypes.string,
    ministry_id: PropTypes.string,
    user_id: PropTypes.string.isRequired,
    users: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  ministries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ministry_name: PropTypes.string,
    })
  ),
  editAnnouncementMutation: PropTypes.shape({
    mutate: PropTypes.func.isRequired,
    isPending: PropTypes.bool.isRequired,
  }).isRequired,
  deleteAnnouncementMutation: PropTypes.shape({
    mutate: PropTypes.func.isRequired,
    isPending: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Announcement;
