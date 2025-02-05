import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/context/useUser";
import { getUser } from "@/services/userService";
import { supabase } from "@/services/supabaseClient";

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const RequireRole = ({ roles }) => {
  const url_code = BASE_URL.split("https://")[1].split(".supabase.co")[0];
  const auth = JSON.parse(localStorage.getItem(`sb-${url_code}-auth-token`));

  const nav = useNavigate();
  const loc = useLocation();
  const { setUserData, logout } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(null); 

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
          nav("/reset-password");
          return;
        }
      });

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session && !auth) {
        nav("/", {
          replace: true,
          state: { from: loc.pathname || "/announcements" },
        });
      }
    };

    handleAuthStateChange();

    if (isSuccess) {
      const temporaryRole = localStorage.getItem("temporaryRole");

      setUserData(data);

      if (!roles.includes(temporaryRole)) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true); 
      }
    }
  }, [auth, data, isSuccess, loc.pathname, logout, nav, roles, setUserData]);


  if (isAuthorized === null) {
    return <p>Loading...</p>; 
  }

  if (!isAuthorized) {
    return <p>Not authorized!</p>; 
  }

  return <Outlet />;
};

RequireRole.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireRole;
