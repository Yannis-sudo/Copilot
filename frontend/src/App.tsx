import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AIChatPage from "./pages/AIChatPage";
import NotesPage from "./pages/NotesPage";
import CreateAccountPage from "./pages/CreateAccountPage";
// Styles
import "./App.css"
import "./index.css"
// Components
import YUINavbar from "./components/layout/UINavbar";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // get current path

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [links, setLinks] = useState([
    { label: 'Home', href: '/', active: false, available: false, shown: true },
    { label: 'AI-Chat', href: '/ai-chat', active: false, available: false, shown: true },
    { label: 'Notes', href: '/notes', active: false, available: false, shown: true },
    { label: 'Login', href: '/login', active: false, available: true, shown: false },
    { label: 'Create Account', href: '/create-account', active: false, available: true, shown: false },
  ]);

  const [loginType, setLoginType] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: ""
  });

  // Update active link whenever route changes
  useEffect(() => {
    setLinks(prev =>
      prev.map(link => ({
        ...link,
        active: link.href === location.pathname
      }))
    );
  }, [location.pathname]);

  const checkLogin = () => {
    const currentLink = links.find(link => link.href === location.pathname);
    const isAvailable = currentLink?.available === true;

    if (!user.username && !user.email && !user.password && !isAvailable) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkLogin();
  }, [user, location.pathname]);

  return (
    <>
      <YUINavbar links={links.filter(link => link.shown)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </>
  );
}

export default App;