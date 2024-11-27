import useLikeDislike from "@/hooks/useLikeDislike";
import { DislikeIcon } from "@/assets/icons/icons";
import PropTypes from "prop-types";

const TriggerDislikeIcon = ({ className, comment_id, user_id, columnName }) => {
  const { data, handleDislike, dislikeCount } = useLikeDislike(
    comment_id,
    user_id,
    columnName
  );

  console.log("data", data, "my dislike count", dislikeCount);

  return (
    <button
      onClick={() => handleDislike(comment_id, user_id)}
      className={className}
    >
      <div className="flex items-center justify-center rounded-3xl bg-blue p-1">
        {data?.isDisliked ? (
          <DislikeIcon className="h-5 w-5 text-accent" />
        ) : (
          <DislikeIcon className="h-5 w-5 text-white" />
        )}
        <p className="text-xs text-white">{dislikeCount}</p>
      </div>
    </button>
  );
};


TriggerDislikeIcon.propTypes = {
  className: PropTypes.string.isRequired,
  comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnName: PropTypes.string.isRequired,
};

export default TriggerDislikeIcon;
