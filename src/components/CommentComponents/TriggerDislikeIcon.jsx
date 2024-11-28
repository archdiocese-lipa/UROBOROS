import useLikeDislike from "@/hooks/useLikeDislike";
import { DislikeIcon } from "@/assets/icons/icons";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const TriggerDislikeIcon = ({ className, comment_id, user_id, columnName }) => {
  const { data, addDislikeMutation, dislikeCount } = useLikeDislike(
    comment_id,
    user_id,
    columnName
  );

  return (
    <button
      disabled={addDislikeMutation?.isPending}
      onClick={() =>
        addDislikeMutation?.mutate({ comment_id, user_id, columnName })
      }
      className={className}
    >
      <div className={cn("flex items-center justify-center rounded-3xl p-1 bg-primary", {"bg-blue ":data?.isDisliked})}>
    
        <DislikeIcon className={cn("h-5 w-5 text-accent opacity-70",{"text-white opacity-100":data?.isDisliked})} />
    
        <p className={cn("text-xs text-accent opacity-70",{"text-white opacity-100" :data?.isDisliked})}>{dislikeCount}</p>
      </div>
    </button>
  );
};

TriggerDislikeIcon.propTypes = {
  className: PropTypes.string.isRequired,
  comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnName: PropTypes.string.isRequired,
};

export default TriggerDislikeIcon;
