import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useIsAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async (token) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/verifyToken`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          console.error('Token verification failed:', response.statusText);
          return false;
        }

        const result = await response.json();
        return result.success;
      } catch (error) {
        console.error("Token verification failed:", error);
        return false;
      }
    };

    const isAuthenticated = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found in localStorage');
        return false;
      }
      return await verifyToken(token);
    };

    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      
      if (authenticated) {
        navigate("./home", { replace: true });
      }
   };

    checkAuthentication();
  }, [navigate]);
}
