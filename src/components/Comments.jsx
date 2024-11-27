import { useUser } from "@/context/useUser";
import { getInitial } from "@/lib/utils";
import CommentInput from "./CommentComponents/CommentInput";
import useComment from "@/hooks/useComment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CommentDetails from "./CommentComponents/CommentDetails";
import PropTypes from "prop-types";


const Comments = ({ announcement_id }) => {
  const { userData } = useUser();
  const Initial = getInitial(userData?.first_name);
  const { HandleAddComment, commentData, isLoading } = useComment(
    announcement_id,
    null
  );

  return (
    <div className="p-1">
      <h1 className="text-md mb-2 font-bold text-accent">
        {" "}
        {commentData?.length} Comments
      </h1>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        commentData?.map((comment, index) => (
          // <p>{comment.comment_content}</p>
          <CommentDetails
            key={index}
            comment={comment}
            announcement_id={announcement_id}
          />
        ))
      )}
      <div className="flex w-full items-start justify-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={""} alt="@shadcn" />
          <AvatarFallback className="bg-green-600">{Initial}</AvatarFallback>
        </Avatar>
        <CommentInput
          HandleAddComment={HandleAddComment}
          announcement_id={announcement_id}
        />
      </div>
      {/* <Separator className="my-3" /> */}
    </div>
  );
};
Comments.propTypes = {
  announcement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default Comments;
