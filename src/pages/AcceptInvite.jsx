import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.post(
          // `${import.meta.env.VITE_UROBOROS_API_URL}/accept-invite`,
          "https://uroboros-api.onrender.com/accept-invite",
          {
            token,
          }
        );

        if (response.status === 200) {
          // Invitation accepted successfully
          alert("Invitation accepted successfully!");
          navigate("/"); // Redirect to dashboard
        } else {
          // Handle errors
          alert(response.data.error || "Failed to accept invitation");
          navigate("/");
        }
      } catch (error) {
        console.error("Error accepting invite:", error);
        alert("Failed to accept invitation");
        navigate("/");
      }
    };

    acceptInvitation();
  }, [token, navigate]);

  return null;
};

export default AcceptInvite;
