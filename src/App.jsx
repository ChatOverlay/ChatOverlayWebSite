import { BrowserRouter, Routes, Route } from "react-router-dom";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
