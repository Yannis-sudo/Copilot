import React from "react";

interface HomePageProps {
  darkMode?: boolean;
}

function HomePage({ darkMode = false }: HomePageProps) {
    return (
        <React.Fragment>
            <div className={`flex-1 flex items-center justify-center ${darkMode ? "bg-dark" : "bg-gray-100"}`}>
                <h1 className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Welcome to Copilot</h1>
            </div>
        </React.Fragment>
    );
}

export default HomePage;