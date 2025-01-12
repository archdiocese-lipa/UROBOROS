import { useEffect, useState } from "react";
import { useUser } from "@/context/useUser";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/constants/roles";

const useRoleSwitcher = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  const [temporaryRole, setTemporaryRole] = useState(
    localStorage.getItem("temporaryRole")
  );

   useEffect(() => {
    if (userData?.role && !temporaryRole) {
      setTemporaryRole(userData.role);
      localStorage.setItem("temporaryRole", userData.role);
    }
  }, []);
  const onSwitchRole = (role) => {
    if (!userData) return;
    setTemporaryRole(role);
    localStorage.setItem("temporaryRole", role);
    navigate("/announcements");
  };

  const roles = [
    { label: "Switch to Parishioner", value: ROLES[2] },
    { label: "Switch to Volunteer", value: ROLES[1] },
    { label: "Switch to Admin", value: ROLES[0] },
  ];

  const availableRoles = roles.filter((role) => {
    if (userData?.role === ROLES[1]) {
      if (temporaryRole === ROLES[1]) {
        // Exclude volunteer and show parishioner
        return role.value !== ROLES[1] && role.value !== ROLES[0];
      }
      if (temporaryRole === ROLES[2]) {
        // Exclude parishioner and show volunteer
        return role.value !== ROLES[2] && role.value !== ROLES[0];
      }
    } else if (userData?.role === ROLES[2]) {
      // Do not return any role
      return null;
    } else if (userData?.role === ROLES[0]) {
      // Returns all role except the current temporary role
      return role.value !== temporaryRole;
    }
  });
  return { availableRoles, onSwitchRole, temporaryRole };
};

export default useRoleSwitcher;
