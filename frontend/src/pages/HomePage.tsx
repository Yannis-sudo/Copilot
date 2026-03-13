import React from "react";
import { useSettings } from "../context/SettingsContext";

function HomePage() {
    const { settings } = useSettings();
    const { darkMode } = settings;

    return (
        <React.Fragment>
            <div className={`flex-1 flex items-center justify-center ${darkMode ? "bg-dark" : "bg-gray-100"}`}>
                <h1 className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Welcome to Copilot</h1>
            </div>
        </React.Fragment>
    );
}

export default HomePage;