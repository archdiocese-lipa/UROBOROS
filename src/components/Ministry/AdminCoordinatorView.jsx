import PropTypes from "prop-types";

const AdminCoordinatorView = ({ ministryId }) => {
  return <p>test{console.log(ministryId)}</p>;
};

AdminCoordinatorView.propTypes = {
  ministryId: PropTypes.string.isRequired,
};

export default AdminCoordinatorView;
