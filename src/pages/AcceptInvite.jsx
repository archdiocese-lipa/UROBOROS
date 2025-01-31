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
          `${import.meta.env.VITE_UROBOROS_API_URL}/accept-invite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: { token },
            credentials: true,
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Invitation accepted successfully
          alert("Invitation accepted successfully!");
          navigate("/"); // Redirect to dashboard
        } else {
          // Handle errors
          alert(data.error || "Failed to accept invitation");
          navigate("/");
        }
      } catch (error) {
        console.error("Error accepting invite:", error);
        alert("Failed to accept invitation");
      }
    };

    acceptInvitation();
  }, [token, navigate]);

  return (
    <div>
      <h1>Processing Invitation...</h1>
    </div>
  );
};

export default AcceptInvite;
