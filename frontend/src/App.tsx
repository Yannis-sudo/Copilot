import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, use } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AIChatPage from "./pages/AIChatPage";
import NotesPage from "./pages/NotesPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import UINavbar from "./components/layout/UINavbar";
import "./App.css";
import "./index.css";
import EmailPage from "./pages/EmailPage";

interface NavLink {
  label: string;
  href: string;
  active: boolean;
  available: boolean;
  shown: boolean;
}

interface User {
  username: string;
  email: string;
  password: string;
}

const INITIAL_LINKS: NavLink[] = [
  {
    label: "Dashboard",
    href: "/",
    active: false,
    available: false,
    shown: true,
  },
  {
    label: "AI-Chat",
    href: "/ai-chat",
    active: false,
    available: false,
    shown: true,
  },
  {
    label: "Notes",
    href: "/notes",
    active: false,
    available: false,
    shown: true,
  },
  {
    label: "Email",
    href: "/email",
    active: false,
    available: false,
    shown: true,
  },
  {
    label: "Login",
    href: "/login",
    active: false,
    available: true,
    shown: false,
  },
  {
    label: "Create Account",
    href: "/create-account",
    active: false,
    available: true,
    shown: false,
  },
];

function App(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
  });

  const [links, setLinks] = useState<NavLink[]>(INITIAL_LINKS);
  const [activePage, setActivePage] = useState<string>("/");

  // Update active link whenever route changes
  useEffect(() => {
    setLinks((prev) =>
      prev.map((link) => ({
        ...link,
        active: link.href === location.pathname,
      }))
    );
  }, [location.pathname]);

  // Update active page title
  useEffect(() => {
    const currentLink = links.find((link) => link.href === location.pathname);
    setActivePage(currentLink?.label || "Copilot");
  }, [links]);

  // Check if user is logged in and redirect if accessing protected routes
  useEffect(() => {
    const currentLink = links.find((link) => link.href === location.pathname);
    const isPublicRoute = currentLink?.available === true;

    if (!user.email && !isPublicRoute) {
      navigate("/login");
    }
  }, [user, location.pathname, links, navigate]);

  useEffect(() => {
    if (user.email && user.password) {
      setLinks((prev) =>
        prev.map((link) => {
          if (link.href === "/login" || link.href === "/create-account") {
            return { ...link, shown: false };
          }
          return { ...link, available: true };
        })
      );
    } else {
      setLinks((prev) =>
        prev.map((link) => {
          if (link.href === "/login" || link.href === "/create-account") {
            return { ...link, shown: false, available: true };
          }
          return { ...link, available: false };
        })
      );
    }
  }, [user]);

  return (
    <>
      <UINavbar links={links.filter((link) => link.shown)} title={activePage} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/email" element={<EmailPage />} />
      </Routes>
    </>
  );
}

export default App;