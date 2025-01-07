import { useUser } from "@/context/useUser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import PropTypes from "prop-types";

const CommentInput = ({ announcement_id, HandleAddComment, columnName }) => {
  const { register, handleSubmit, reset } = useForm();
  const { userData } = useUser();
  const [isCommenting, setIsCommenting] = useState(false);

  return (
    <div className="mt-2 flex-grow">
      <form
        onSubmit={handleSubmit((data) =>
          HandleAddComment(
            data,
            userData.id,
            announcement_id,
            columnName,
            setIsCommenting,
            reset
          )
        )}
        id={`comment${announcement_id}`}
        className="flex-1"
      >
        <Textarea
          className="rounded-2xl border-accent/30 bg-white md:bg-primary resize-none"
          {...register(`comment${announcement_id}`,{ required: true })}
          onFocus={() => setIsCommenting(true)}
          name={`comment${announcement_id}`}
          placeholder="Write a comment..."
        />
      </form>

      {isCommenting && (
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => setIsCommenting(false)}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            // onClick={()=>{console.log(announcement_id)}}
            type="submit"
            form={`comment${announcement_id}`}
            className="bg-accent"
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  );
};
CommentInput.propTypes = {
  announcement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  HandleAddComment: PropTypes.func.isRequired,
  columnName: PropTypes.string.isRequired,
};

export default CommentInput;
