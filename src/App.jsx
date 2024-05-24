import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { useCallback, useEffect } from 'react';

function AppRoutes() {
  const navigate = useNavigate();

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL2}/api/verifyToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        navigate("/settings");
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("토큰 검증 실패:", error);
      localStorage.removeItem("token");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/settings' element={<Settings />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
