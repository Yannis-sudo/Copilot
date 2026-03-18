import { useSettings } from "../context/SettingsContext";

function NotFoundPage() {
  const { settings } = useSettings();
  const { darkMode } = settings;

  return (
    <div className={`h-screen flex items-center justify-center ${darkMode ? "bg-dark" : "bg-gray-100"}`}>
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>404</h1>
        <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Page not found</p>
      </div>
    </div>
  );
}

export default NotFoundPage;
