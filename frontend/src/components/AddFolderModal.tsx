import React, { useState } from "react";
import UIButton from "./UIButton";
import UITextInput from "./UITextInput";

interface AddFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddFolder: (folderName: string, parentFolder?: string) => void;
    darkMode?: boolean;
    availableFolders?: string[];
}

export default function AddFolderModal({
    isOpen,
    onClose,
    onAddFolder,
    darkMode = false,
    availableFolders = [],
}: AddFolderModalProps): React.ReactElement {
    const [folderName, setFolderName] = useState("");
    const [parentFolder, setParentFolder] = useState<string>("");

    if (!isOpen) return React.createElement(React.Fragment, null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (folderName.trim()) {
            const selectedParent = parentFolder === "" ? undefined : parentFolder;
            onAddFolder(folderName.trim(), selectedParent);
            setFolderName("");
            setParentFolder("");
            onClose();
        }
    };

    const handleCancel = () => {
        setFolderName("");
        setParentFolder("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleCancel}
            />
            
            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="rounded-2xl p-6 border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_48px_rgba(124,58,237,0.15)] backdrop-blur-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-100">Add New Folder</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <UITextInput
                            type="text"
                            label="Folder Name"
                            placeholder="Enter folder name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            darkMode={darkMode}
                            autoFocus
                        />
                        
                        {availableFolders.length > 0 && (
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    Parent Folder (optional)
                                </label>
                                <select
                                    value={parentFolder}
                                    onChange={(e) => setParentFolder(e.target.value)}
                                    className={`
                                        w-full px-4 py-2 rounded-lg
                                        bg-[rgba(124,58,237,0)]
                                        border border-[#7c3aed]
                                        text-sm
                                        transition-all duration-200
                                        focus:outline-none
                                        focus:ring-2 focus:ring-[#7c3aed]
                                        focus:ring-offset-0
                                        focus:bg-[rgba(124,58,237,0.15)]
                                        ${darkMode ? "text-white" : "text-gray-800"}
                                    `}
                                >
                                    <option value="">Create in main folder</option>
                                    {availableFolders.map((folder) => (
                                        <option key={folder} value={folder}>
                                            {folder}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-end">
                            <UIButton 
                                type="button" 
                                onClick={handleCancel} 
                                variant="secondary" 
                                darkMode={darkMode}
                            >
                                Cancel
                            </UIButton>
                            <UIButton 
                                type="submit"
                                disabled={!folderName.trim()}
                                darkMode={darkMode}
                            >
                                Add Folder
                            </UIButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
