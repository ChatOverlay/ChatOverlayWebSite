import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Settings from './pages/Settings'
import Chat from './pages/Chat'
import { useEffect } from 'react';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const selectedClassroom = localStorage.getItem('selectedClassroom');
    if (selectedClassroom) {
      navigate('/chat');
    }
  }, [navigate]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}
