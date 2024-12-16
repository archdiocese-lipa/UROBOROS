import { useEffect } from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { useUser } from "@/context/useUser";

import { getUser } from "@/services/userService";
import { ROLES } from "@/constants/roles";
import { supabase } from "@/services/supabaseClient";


// const BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const RequireRole = ({ roles }) => {
  // const url_code = BASE_URL.split("https://")[1].split(".supabase.co")[0];
  // const auth = JSON.parse(localStorage.getItem(`sb-${url_code}-auth-token`));

  const nav = useNavigate();
  const loc = useLocation();
  const { setUserData, logout } = useUser();

  useEffect(() => {
    const handleAuthChange = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Redirect to login if session is missing
      if (!session) {
        nav("/", {
          replace: true,
          state: { from: loc.pathname || "/announcements" },
        });
      }

      // Add listener for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "PASSWORD_RECOVERY") {
            nav("/reset-password");
          } else if (session) {
            // Update user state when session is available
            const response = await getUser(session.user.id);
            handleRoleValidation(response);
          }
        }
      );

      // Clean up listener on unmount
      return () => {
        authListener?.unsubscribe();
      };
    };

    const handleRoleValidation = (user) => {
      const tempRole = sessionStorage.getItem("temp-role");
      if (tempRole && user.role === ROLES[0]) {
        if (!roles.includes(tempRole)) {
          nav("/announcements", { replace: true });
        }

        if (tempRole === ROLES[0]) {
          sessionStorage.removeItem("temp-role");
          logout();
        }
        user.role = tempRole;
      }

      setUserData(user);

      if (!roles.includes(user.role)) {
        nav("/announcements", { replace: true });
      }
    };

    handleAuthChange();
  }, [roles, nav, loc, setUserData, logout]);

  return <Outlet />;
};


RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireRole;
