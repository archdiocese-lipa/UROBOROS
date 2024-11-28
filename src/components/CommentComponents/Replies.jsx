import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentDate from "./CommentDate";
import { ReplyIcon, KebabIcon } from "@/assets/icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import ReplyInput from "./ReplyInput";
import { cn, getInitial } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import EditReplyForm from "./EditReplyForm";
import PropTypes from "prop-types";
import { useUser } from "@/context/useUser";
import { useState } from "react";
import TriggerLikeIcon from "./TriggerLikeIcon";
import TriggerDislikeIcon from "./TriggerDislikeIcon";

const Replies = ({
  reply,
  showReply,
  commentId,
  handleUpdateReply,
  handleDeleteReply,
  handleAddReply,
}) => {
  const { userData } = useUser();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditting, setEditting] = useState(false);

  return (
    <div
      key={reply.id}
      className={cn(
        "mb-2 flex flex-col gap-2 overflow-hidden text-xs transition-all duration-500",
        {
          "h-fit": showReply === true,
          "h-0": showReply === false,
        }
      )}
    >
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={reply?.users?.user_image ?? ""}
            alt="profile picture"
          />
          <AvatarFallback className="bg-green-600">
            {getInitial(reply?.users?.first_name)}
          </AvatarFallback>
        </Avatar>

        {isEditting ? (
          <EditReplyForm
            comment_id={reply.id}
            setEditting={setEditting}
            InputDefaultValue={reply.comment_content}
            handleUpdateReply={handleUpdateReply}
          />
        ) : (
          <div className="relative flex-grow rounded-3xl bg-primary px-5 py-4">
            <div className="flex flex-grow justify-between">
              <div className="flex flex-col">
                <p className="font-bold text-accent">{`${reply?.users?.first_name} ${reply?.users?.last_name}`}</p>
                <div className="flex gap-1">
                  <CommentDate
                    date={reply.created_at}
                    isEdited={reply.edited}
                    InputDefaultValue={reply.comment_content}
                  />
                </div>
              </div>
              <div></div>
            </div>
            <div>
              <p className="text-sm text-accent">{reply.comment_content}</p>
              <div className="flex items-center">
                <TriggerDislikeIcon
                  className="absolute -bottom-4 right-2 w-14 rounded-3xl bg-white p-1"
                  comment_id={reply.id}
                  user_id={userData?.id}
                  columnName="comment_id"
                />
                <TriggerLikeIcon
                  className="absolute -bottom-4 right-16 w-14 rounded-3xl bg-white p-1"
                  comment_id={reply.id}
                  user_id={userData?.id}
                  columnName="comment_id"
                />
              </div>
            </div>
          </div>
        )}
        {userData?.id === reply?.users?.id && (
          <Popover>
            <PopoverTrigger>
              {/* <img src={kebab} alt="kebab icon" /> */}
              <KebabIcon className="h-5 w-5 text-accent" />
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-32 overflow-hidden rounded-2xl p-0 outline-none"
            >
              <Button
                onClick={() => setEditting(true)}
                className="w-full p-3 text-center text-accent hover:cursor-pointer"
                variant={"outline"}
              >
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full rounded-t-none text-center hover:cursor-pointer"
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Comment</DialogTitle>
                    <DialogDescription>
                      Delete Your Comment Permanently
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="default">
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleDeleteReply(reply.id)}
                        variant={"destructive"}
                        type="submit"
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        )}
        <button
          onClick={() => setIsReplying(true)}
          className="ml-2 rounded-2xl"
        >
          <ReplyIcon className="h-5 w-5 hover:cursor-pointer text-accent" />
        </button>
      </div>
      <ReplyInput
        replyTo={`${reply.users.first_name} ${reply.users.last_name}`}
        setEditting={setEditting}
        comment_id={commentId}
        isReplying={isReplying}
        handleAddReply={handleAddReply}
        setIsReplying={setIsReplying}
      />
    </div>
  );
};

Replies.propTypes = {
  reply: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    comment_content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    edited: PropTypes.bool.isRequired,
    users: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      user_image: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
  }).isRequired,
  showReply: PropTypes.bool.isRequired,
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleUpdateReply: PropTypes.func.isRequired,
  handleDeleteReply: PropTypes.func.isRequired,
  handleAddReply: PropTypes.func.isRequired,
};

export default Replies;
