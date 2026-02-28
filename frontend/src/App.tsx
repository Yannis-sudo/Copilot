import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AIChatPage from "./pages/AIChatPage";
import NotesPage from "./pages/NotesPage";

// Styles
import "./App.css"

// Components
import YUINavbar from "./components/UINavbar";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [links, setLinks] = useState([
    { label: 'Home', href: '/', active: false },
    { label: 'AI-Chat', href: '/ai-chat', active: false },
    { label: 'Notes', href: '/notes', active: false },
  ]);

  // Functions
  const checkLogin = () => {
    if (!user.username && !user.email && !user.password) {
      navigate("/login");
    } else {
      console.log("User logged in:", user);
    }
  };

  // Effects
  useEffect(() => {
    checkLogin();
  }, [user]);

  return (
    <>
      <YUINavbar links={links} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </>
  );
}

export default App;