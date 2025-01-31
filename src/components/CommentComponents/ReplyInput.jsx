import { useEffect } from "react";
import { getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/useUser";
import PropTypes from "prop-types";

 const ReplyInput =({
  comment_id,
  isReplying,
  setIsReplying,
  setEditting,
  replyTo,
  handleAddReply
}) => {
  const { userData } = useUser();
  const { register, reset, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (replyTo) {
      setValue("reply", `@${replyTo} `);
    }
  }, []);


  return (
    <div className="mr-2 flex flex-col gap-2 mt-5">
      {isReplying && (
        <form
          onSubmit={handleSubmit((inputs) =>
            handleAddReply(
              inputs,
              userData.id,
              comment_id,
              setEditting,
              reset,
              setIsReplying
            ),
          )}
          className="flex"
        >
          <div className="flex flex-grow flex-col gap-2">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className=""
                  src={userData?.user_image ?? ""}
                  alt="@shadcn"
                />
                <AvatarFallback className="bg-accent text-white">
                  {getInitial(userData?.first_name)}
                </AvatarFallback>
              </Avatar>
              <Input
                {...register("reply", { required: true })}
                name="reply"
                placeholder="type your reply here"
              ></Input>
            </div>

            <div className="flex justify-end">
            <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-accent"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
ReplyInput.propTypes = {
  comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isReplying: PropTypes.bool.isRequired,
  setIsReplying: PropTypes.func.isRequired,
  setEditting: PropTypes.func.isRequired,
  replyTo: PropTypes.string,
  handleAddReply: PropTypes.func.isRequired,
};

export default ReplyInput
