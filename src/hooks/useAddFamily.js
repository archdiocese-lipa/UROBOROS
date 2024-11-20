import { useState } from "react";
import { addFamilyMembers } from "@/services/familyService"; // Import the service

export const useAddFamily = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to add family members
  const mutate = async (familyData) => {
    setIsLoading(true);
    setError(null);

    const response = await addFamilyMembers(familyData);

    if (response.success) {
      setIsLoading(false);
      return response;
    } else {
      setIsLoading(false);
      setError(response.error);
    }
  };

  return { mutate, isLoading, error };
};
