import { LikeIcon } from "@/assets/icons/icons";
import useLikeDislike from "@/hooks/useLikeDislike";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const TriggerLikeIcon = ({ className, comment_id, user_id, columnName }) => {
  const { data, addLikeMutation, likeCount } = useLikeDislike(
    comment_id,
    user_id,
    columnName
  );

  return (
    <button
      disabled={addLikeMutation?.isPending}
      onClick={() =>
        addLikeMutation?.mutate({ comment_id, user_id, columnName })
      }
      className={className}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-3xl bg-primary p-1",
          { "bg-blue": data?.isLiked }
        )}
      >
        <LikeIcon
          className={cn("h-5 w-5 text-accent opacity-70", {
            "text-white opacity-100": data?.isLiked,
          })}
        />

        <p
          className={cn("text-xs text-accent opacity-70", {
            "text-white opacity-100": data?.isLiked,
          })}
        >
          {likeCount}
        </p>
      </div>
    </button>
  );
};

TriggerLikeIcon.propTypes = {
  className: PropTypes.string.isRequired,
  comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnName: PropTypes.string.isRequired,
};

export default TriggerLikeIcon;
