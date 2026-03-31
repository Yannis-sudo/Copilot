import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Folder } from "../types/api";
import { fetchEmails } from "../api";
import { AUTH_MESSAGES } from "../constants";

export interface UserSettings {
  username: string;
  email: string;
  password: string;
}

export interface AppSettings {
  user: UserSettings;
  darkMode: boolean;
  showFolderPreview: boolean; // email list panel option
  emails: Folder[];
  emailsLoading: boolean;
  [key: string]: unknown;
}

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  setUser: (user: UserSettings) => void;
  toggleDarkMode: () => void;
  setShowFolderPreview: (value: boolean) => void;
  setEmails: (emails: Folder[]) => void;
  setEmailsLoading: (loading: boolean) => void;
  loadEmails: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  user: {
    username: "",
    email: "",
    password: "",
  },
  darkMode: true,
  showFolderPreview: true,
  emails: [],
  emailsLoading: false,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  setUser: () => {},
  toggleDarkMode: () => {},
  setShowFolderPreview: () => {},
  setEmails: () => {},
  setEmailsLoading: () => {},
  loadEmails: async () => {},
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

  const setEmails = (emails: Folder[]) => {
    setSettings((prev) => ({ ...prev, emails }));
  };

  const setEmailsLoading = (loading: boolean) => {
    setSettings((prev) => ({ ...prev, emailsLoading: loading }));
  };

  const loadEmails = async () => {
    const email = settings.user.email;
    const password = settings.user.password;
    if (!email || !password) return;

    setEmailsLoading(true);
    try {
      const res = await fetchEmails({ email, password });
      if (res.message === AUTH_MESSAGES.EMAILS_FETCHED && (res as any).emails) {
        const apiData = (res as any).emails;
        const transformedFolders: Folder[] = apiData.folders.map((folderName: string) => ({
          id: folderName,
          label: folderName.split('/').pop() || folderName,
          emails: apiData.emails
            .filter((email: any) => email.folder === folderName)
            .map((email: any) => ({
              folder: email.folder,
              from: email.from,
              subject: email.subject,
              date: email.date,
              message_id: email.message_id,
              body: email.body,
              attachments: email.attachments || [],
              has_attachments: email.has_attachments || false
            }))
        }));
        setEmails(transformedFolders);
      }
      // If EMAIL_NOT_FOUND, just ignore, don't load
    } catch (error) {
      console.error("Error loading emails:", error);
    } finally {
      setEmailsLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, setUser, toggleDarkMode, setShowFolderPreview, setEmails, setEmailsLoading, loadEmails }}
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
