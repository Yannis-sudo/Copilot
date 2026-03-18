import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AIChatPage from "./pages/AIChatPage";
import NotesPage from "./pages/NotesPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import DevPage from "./pages/DevPage";
import EmailPage from "./pages/EmailPage";
import UINavbar from "./components/UINavbar";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";
import "./index.css";
import { useSettings } from "./context/SettingsContext";
import EmailSetupPage from "./pages/EmailSetupPage";

interface NavLink {
  label: string;
  href: string;
  active: boolean;
  available: boolean;
  shown: boolean;
}

// Routes that do not require a logged-in user.
// Defined as a constant so the auth guard never has to wait for state to update.
const PUBLIC_ROUTES = ["/login", "/create-account"];

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
    label: "Dev",
    href: "/dev",
    active: false,
    available: true,
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
  {
    label: "Email Setup",
    href: "/email-setup",
    active: false,
    available: false,
    shown: false,
  },
];

function App(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const { settings, toggleDarkMode } = useSettings();

  const [links, setLinks] = useState<NavLink[]>(INITIAL_LINKS);
  const [activePage, setActivePage] = useState<string>("/");

  // Update the active link highlight whenever the route changes
  useEffect(() => {
    setLinks((prev) =>
      prev.map((link) => ({
        ...link,
        active: link.href === location.pathname,
      }))
    );
  }, [location.pathname]);

  // Update the navbar title to match the current page
  useEffect(() => {
    const currentLink = links.find((link) => link.href === location.pathname);
    setActivePage(currentLink?.label || "Copilot");
  }, [links]);

  // Auth guard — redirect to login if the user is not logged in and the route is protected.
  // Uses PUBLIC_ROUTES constant instead of links.available to avoid a race condition where
  // the links state has not updated yet when the guard runs after navigation.
  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    if (!settings.user.email && !isPublicRoute) {
      navigate("/login");
    }
  }, [settings.user, location.pathname, navigate]);

  // Unlock all nav links once the user is logged in
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/email-setup" element={<EmailSetupPage />} />
        <Route path="/dev" element={<DevPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;