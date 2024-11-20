import { useEffect } from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const RequireRole = ({ roles }) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  useEffect(() => {
    // Get the user from the query cache
    const validateUser = async () => {
      // Cancel any outgoing refetches
      // (so they don't overwrite existing data)
      await queryClient.cancelQueries({ queryKey: ["user"] });
      // get the user from the cache
      const cache = queryClient.getQueryData("user");
      // Check the user in Context API, we can use it to validate the role.

      // Example:
      // const { user: context } = useAuth();
      // then update the if statement below to use compare the contextUser and the user from the cache
      // const match = context?.role === cache?.role;
      // if (!match) {
      //   nav("/", { replace: true });
      //   return;
      // }
      // if (!roles.includes(context.role) && !roles.includes(cache.role)) {
      //   nav("/unauthorized", { replace: true });
      // }

      // If the user is not logged in, redirect to the login page
      if (!cache) {
        nav("/", { replace: true });
        return;
      }
      // If the user does not have the role needed, redirect to the path '/unauthorized';
      if (!roles.includes(cache.role)) {
        nav("/unauthorized", { replace: true });
      }
    };
    // Call the function to validate the user.
    validateUser();
  }, [queryClient, nav, roles]);

  // If the user has the role needed, render the child routes
  return <Outlet />;
};

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireRole;
