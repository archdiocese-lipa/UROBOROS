import { useEffect } from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/context/useUser";

import { getUser } from "@/services/userService";
import { ROLES } from "@/constants/roles";

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
      const response = await getUser(auth.user?.id);
      return response;
    },
    enabled: !!auth,
  });

  useEffect(() => {
    if (!auth) {
      nav("/", {
        replace: true,
        state: { from: loc.pathname || "/announcements" },
      });
    }
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
    }
    if (isSuccess && !roles.includes(data.role)) {
      // if the user is authenticated but doesn't have the role needed
      nav("/announcements", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  return <Outlet />;
};

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireRole;
