import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AIChatPage from "./pages/AIChatPage";
import NotesPage from "./pages/NotesPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import UINavbar from "./components/UINavbar";
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

interface Settings {
  // User settings
  user: User;
  // App settings
  darkMode: boolean;
}

const INITIAL_SETTINGS: Settings = {
  user: {
    username: "",
    email: "",
    password: "",
  },
  darkMode: true,
};

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

  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  const [links, setLinks] = useState<NavLink[]>(INITIAL_LINKS);
  const [activePage, setActivePage] = useState<string>("/");

  // Helper to update user settings
  const setUser = (user: User) => {
    setSettings((prev) => ({
      ...prev,
      user,
    }));
  };

  // Helper to toggle dark mode
  const toggleDarkMode = () => {
    setSettings((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

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

    if (!settings.user.email && !isPublicRoute) {
      navigate("/login");
    }
  }, [settings.user, location.pathname, links, navigate]);

  useEffect(() => {
    if (settings.user.email && settings.user.password) {
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
  }, [settings.user]);

  return (
    <div className={settings.darkMode ? "dark" : ""}>
      <UINavbar
        links={links.filter((link) => link.shown)}
        title={activePage}
        darkMode={settings.darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <Routes>
        <Route path="/" element={<HomePage darkMode={settings.darkMode} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} darkMode={settings.darkMode} />} />
        <Route path="/create-account" element={<CreateAccountPage darkMode={settings.darkMode} />} />
        <Route path="/ai-chat" element={<AIChatPage darkMode={settings.darkMode} />} />
        <Route path="/notes" element={<NotesPage darkMode={settings.darkMode} />} />
        <Route path="/email" element={<EmailPage darkMode={settings.darkMode} />} />
      </Routes>
    </div>
  );
}

export default App;