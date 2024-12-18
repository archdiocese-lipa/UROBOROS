import { useUser } from "@/context/useUser";
import {
  useFetchChildren,
  useFetchFamilyId,
  useFetchGuardian,
} from "@/hooks/useFamily";

export const useFamilyData = () => {
  const { userData } = useUser();
  const userId = userData?.id;

  // Fetch familyId based on userId
  const {
    data: familyData,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFetchFamilyId(userId);

  const familyId = familyData?.id;

  // Fetch guardian data based on familyId
  const {
    data: parentData,
    isLoading: isParentLoading,
    error: parentError,
  } = useFetchGuardian(familyId);

  // Fetch child data based on familyId
  const {
    data: childData,
    isLoading: isChildLoading,
    error: childError,
  } = useFetchChildren(familyId);

  // Consolidate loading and error states
  const isLoading = isFamilyLoading || isParentLoading || isChildLoading;
  const error = familyError || parentError || childError;

  return {
    userId,
    familyId,
    familyData,
    parentData,
    childData,
    isLoading,
    error,
  };
};
