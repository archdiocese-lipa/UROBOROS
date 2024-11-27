import { useQuery } from "@tanstack/react-query";
import {
  getChildren,
  getFamilyId,
  getGuardian,
} from "@/services/familyService";

export const useFetchFamilyId = (userId) => {
  return useQuery({
    queryKey: ["family_group", userId], // Include userId in the query key to ensure unique caching
    queryFn: () => getFamilyId(userId), // Pass the userId to getGuardian
    enabled: !!userId, // Only run the query if userId is available
  });
};

export const useFetchGuardian = (familyId) => {
  return useQuery({
    queryKey: ["parents", familyId], // Include userId in the query key to ensure unique caching
    queryFn: () => getGuardian(familyId), // Pass the userId to getGuardian
    enabled: !!familyId, // Only run the query if userId is available
  });
};

export const useFetchChildren = (familyId) => {
  return useQuery({
    queryKey: ["children", familyId], // Include userId in the query key to ensure unique caching
    queryFn: () => getChildren(familyId), // Pass the userId to getGuardian
    enabled: !!familyId, // Only run the query if userId is available
  });
};
