
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

 const EditCommentForm = ({
  comment_id,
  setEditting,
  InputDefaultValue,
  handleUpdateComment
}) => {
  const { register, handleSubmit, setValue } = useForm();
  // const { handleUpdateComment } = useComment(announcement_id);

  useEffect(() => {
    if (InputDefaultValue) {
      setValue("comment", InputDefaultValue);
    }
  }, []);
  return (
    <form
      onSubmit={handleSubmit((inputs) =>
        handleUpdateComment(inputs, comment_id,setEditting)
      )}
      className="mb-2 flex p-1 w-full flex-col gap-2"
    >
      <Input
        {...register("comment", { required: true })}
        name="comment"
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant={"outline"}
          onClick={() => setEditting(false)}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-accent hover:bg-blue-500">
          Save
        </Button>
      </div>
    </form>
  );
}

EditCommentForm.propTypes = {
  comment_id: PropTypes.string
    .isRequired,
  setEditting: PropTypes.func.isRequired,
  InputDefaultValue: PropTypes.string,
  handleUpdateComment: PropTypes.func.isRequired,
};

export default EditCommentForm