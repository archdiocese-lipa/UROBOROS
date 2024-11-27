
import PropTypes from "prop-types";


const SetShowReplyButton =({replyCount,showReply, setShowReply}) => {
  return (
    <button
    type="button"
    onClick={() => setShowReply((prevState) => !prevState)}
    className=" px-1 text-accent rounded-2xl w-fit hover:underline mb-1"
  >
    {showReply ? "Hide Replies" : `Show Replies (${replyCount})`} 
  </button>
  )
}
SetShowReplyButton.propTypes = {
  replyCount: PropTypes.number.isRequired,
  showReply: PropTypes.bool.isRequired,
  setShowReply: PropTypes.func.isRequired,
};
export default SetShowReplyButton
