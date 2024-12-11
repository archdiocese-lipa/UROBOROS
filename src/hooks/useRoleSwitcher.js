import { useState, useEffect } from "react";
import { useUser } from "@/context/useUser";
import { useNavigate } from "react-router-dom";

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
      '/announcements?ministryId='
    )
  };


  const roles = [
    { label: "Switch to Parishioner", value: "parishioner" },
    { label: "Switch to Volunteer", value: "volunteer" },
    { label: "Switch to Admin", value: "admin" },
  ];


  const availableRoles = roles.filter((role) => {
    if (userData?.role === "volunteer") {
      if (temporaryRole === "volunteer")
        // exclude "volunteer" and show "parishioner"
        return role.value !== "volunteer" && role.value !== "admin"; 
      if (temporaryRole === "parishioner")
        // exclude "parishioner" and show "volunteer"
        return role.value !== "parishioner" && role.value !== "admin"; 
    }
    if (userData?.role === "parishioner") {
      return null;
    }
    if (userData?.role === "admin") {
        // remove current role
        return role.value !== temporaryRole; 
    }
  });

//   console.log("user",userData)
//  console.log("temprole before returning", temporaryRole)

  return { availableRoles, onSwitchRole, temporaryRole };
};

export default useRoleSwitcher;
