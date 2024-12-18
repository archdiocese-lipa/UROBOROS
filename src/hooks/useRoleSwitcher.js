import { useState, useEffect } from "react";
import { useUser } from "@/context/useUser";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/constants/roles";

const useRoleSwitcher = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  const [temporaryRole, setTemporaryRole] = useState("");

  useEffect(() => {
    if (userData?.role && !temporaryRole) {
      setTemporaryRole(userData.role);
    }
  }, [userData]); 

  const onSwitchRole = (role) => {
    if (!userData) return;
    setTemporaryRole(role);
    navigate(
      '/announcements'
    )
  };


  const roles = [
    { label: "Switch to Parishioner", value: ROLES[2] },
    { label: "Switch to Volunteer", value: ROLES[1]},
    { label: "Switch to Admin", value: ROLES[0]},
  ];


  const availableRoles = roles.filter((role) => {
    if (userData?.role === ROLES[1]) {
      if (temporaryRole === ROLES[1])
        // exclude "volunteer" and show "parishioner"
        return role.value !== ROLES[1] && role.value !== ROLES[0]; 
      if (temporaryRole === "parishioner")
        // exclude "parishioner" and show "volunteer"
        return role.value !== ROLES[2] && role.value !== ROLES[0]; 
    }
    if (userData?.role === ROLES[2]) {
      return null;
    }
    if (userData?.role === ROLES[0]) {
        // remove current role
        return role.value !== temporaryRole; 
    }
  });

//   console.log("user",userData)
//  console.log("temprole before returning", temporaryRole)

  return { availableRoles, onSwitchRole, temporaryRole };
};

export default useRoleSwitcher;
