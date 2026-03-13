import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface UserSettings {
  username: string;
  email: string;
  password: string;
}

export interface AppSettings {
  user: UserSettings;
  darkMode: boolean;
  showFolderPreview: boolean; // email list panel option
  [key: string]: unknown;
}

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  setUser: (user: UserSettings) => void;
  toggleDarkMode: () => void;
  setShowFolderPreview: (value: boolean) => void;
}

const defaultSettings: AppSettings = {
  user: {
    username: "",
    email: "",
    password: "",
  },
  darkMode: true,
  showFolderPreview: false,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  setUser: () => {},
  toggleDarkMode: () => {},
  setShowFolderPreview: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const setUser = (user: UserSettings) => {
    setSettings((prev) => ({ ...prev, user }));
  };

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setShowFolderPreview = (value: boolean) => {
    setSettings((prev) => ({ ...prev, showFolderPreview: value }));
  };

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, setUser, toggleDarkMode, setShowFolderPreview }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
