import { LikeIcon } from "@/assets/icons/icons";
import useLikeDislike from "@/hooks/useLikeDislike";
import PropTypes from "prop-types";


const TriggerLikeIcon = ({ className, comment_id, user_id,columnName }) => {
  const { data, handleLike, likeCount } = useLikeDislike(comment_id, user_id,columnName);

  return (
    <button
      onClick={() => handleLike(comment_id, user_id)}
      className={className}
      
    >
      <div className="flex items-center justify-center rounded-3xl bg-blue p-1">
        {data?.isLiked ? (
          <LikeIcon className="h-5 w-5 text-accent" />
        ) : (
          <LikeIcon className="h-5 w-5 text-white" />
        )}
        <p className="text-xs text-white">{likeCount}</p>
      </div>
    </button>
  );

  
};

TriggerLikeIcon.propTypes = {
  className: PropTypes.string.isRequired,
  comment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnName: PropTypes.string.isRequired,
};



export default TriggerLikeIcon;
