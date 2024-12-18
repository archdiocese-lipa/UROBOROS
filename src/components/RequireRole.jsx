import { useEffect } from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/context/useUser";

import { getUser } from "@/services/userService";
import { ROLES } from "@/constants/roles";
import { supabase } from "@/services/supabaseClient";

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const RequireRole = ({ roles }) => {
  const url_code = BASE_URL.split("https://")[1].split(".supabase.co")[0];
  const auth = JSON.parse(localStorage.getItem(`sb-${url_code}-auth-token`));

  const nav = useNavigate();
  const loc = useLocation();
  const { setUserData, logout } = useUser();

  const { data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getUser(auth?.user?.id);
      return response;
    },
    enabled: !!auth,
  });

  useEffect(() => {
    const handleAuthStateChange = async () => {
      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          // Redirect to reset password screen
          nav("/reset-password");
          return;
        }
      });

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session && !auth) {
        // No session or auth token, redirect to login
        nav("/", {
          replace: true,
          state: { from: loc.pathname || "/announcements" },
        });
      }
    };

    handleAuthStateChange();

    if (isSuccess) {
      const tempRole = sessionStorage.getItem("temp-role");

      if (tempRole && data.role === ROLES[0]) {
        if (!roles.includes(tempRole)) {
          nav("/announcements", { replace: true });
        }

        if (tempRole === ROLES[0]) {
          sessionStorage.removeItem("temp-role");
          logout();
        }
        data.role = tempRole;
      }

      setUserData(data);

      if (!roles.includes(data.role)) {
        // Authenticated but lacks required role
        nav("/announcements", { replace: true });
      }
    }
  }, [auth, data, isSuccess, loc.pathname, logout, nav, roles, setUserData]);

  return <Outlet />;
};

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireRole;
