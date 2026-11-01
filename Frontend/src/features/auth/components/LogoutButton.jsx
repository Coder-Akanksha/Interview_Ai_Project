import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../auth.context.jsx";
import { logout } from "../services/auth.api.js";
import "./logout-button.scss";

const LogoutButton = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      className="logout-button"
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </button>
  );
};

export default LogoutButton;