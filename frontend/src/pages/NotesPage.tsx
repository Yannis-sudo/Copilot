import React from "react";

interface NotesPageProps {
  darkMode?: boolean;
}

function NotesPage({ darkMode = false }: NotesPageProps) {
    return (
        <React.Fragment>
            <div className={`flex-1 flex items-center justify-center ${darkMode ? "bg-dark" : "bg-gray-100"}`}>
                <h1 className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Notes</h1>
            </div>
        </React.Fragment>
    );
}

export default NotesPage;