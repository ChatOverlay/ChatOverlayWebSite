import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async (token) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/verifyToken`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );
        return response.ok;
      } catch (error) {
        console.error("토큰 검증 실패:", error);
        return false;
      }
    };

    const isAuthenticated = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
      return await verifyToken(token);
    };

    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        navigate("/", { replace: true, state: "잘못된 접근입니다." });
      }
    };

    checkAuthentication();
  }, [navigate]);

  return <Outlet />;
};

export default PrivateRoute;
