import React, { useState, useEffect } from "react";
import UIButton from "../components/UIButton";
import UITextInput from "../components/UITextInput";
import UIIconButton from "../components/UIIconButton";
import UIEmailDetail from "../components/containers/UIEmailDetail";
import AddFolderModal from "../components/AddFolderModal";
import { useSettings } from "../context/SettingsContext";
import { fetchEmails, addFolder, getFolders } from "../api";
import { AUTH_MESSAGES } from "../constants";
import { useNavigate } from "react-router-dom";

// Types for emails and folders
interface Email {
    id: string;
    from: string;
    subject: string;
    date: string;
    folder: string;
    message_id: string;
    body: string;
}

interface Folder {
    id: string;
    label: string;
    emails: Email[];
}

// Initial empty folders - will be populated from API
const initialFolders: Folder[] = [];

function EmailPage() {
    const navigate = useNavigate();

    const { settings, setShowFolderPreview } = useSettings();
    const { darkMode } = settings;
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [selectedFolderId, setSelectedFolderId] = useState<string>("inbox");
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [availableFolders, setAvailableFolders] = useState<string[]>([]);

    // Track which folders are collapsed in the sidebar
    const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

    const selectedFolder = folders.find((f) => f.id === selectedFolderId) || (folders.length > 0 ? folders[0] : null);
    const selectedEmail = selectedFolder?.emails.find((e) => e.id === selectedEmailId) || null;
    const showFolderPreview = settings.showFolderPreview;

    // Fetch emails from the backend on page load.
    // The backend uses the stored credentials to connect to the user's mail server.
    const getEmails = async () => {
        const email = settings.user.email;
        const password = settings.user.password;
        console.log("Fetching emails with credentials:", { email, password: "***" });
        
        const res = await fetchEmails({ email, password });
        console.log("Fetch emails response:", res);

        if (res.message === AUTH_MESSAGES.INVALID_CREDENTIALS) {
            // Credentials are wrong — send back to login
            alert("Invalid credentials. Please check your email and password.");
            navigate("/login");
            return;
        }

        if (res.message === AUTH_MESSAGES.EMAIL_NOT_FOUND) {
            // No mail account configured yet — redirect to setup page
            console.log("Email not found, redirecting to setup");
            navigate("/email-setup");
            return;
        }

        // On success, transform API data to frontend format
        if (res.message === AUTH_MESSAGES.EMAILS_FETCHED && (res as any).emails) {
            const apiData = (res as any).emails;
            
            // Transform folders and emails from API to frontend format
            const transformedFolders: Folder[] = apiData.folders.map((folderName: string) => ({
                id: folderName,
                label: folderName,
                emails: apiData.emails
                    .filter((email: any) => email.folder === folderName)
                    .map((email: any) => ({
                        id: email.message_id,
                        from: email.from,
                        subject: email.subject,
                        date: email.date,
                        folder: email.folder,
                        message_id: email.message_id,
                        body: email.body
                    }))
            }));
            
            setFolders(transformedFolders);
        }
    };

    // Run getEmails once when the component mounts
    useEffect(() => {
        getEmails();
    }, []);

    const handleSelectFolder = (folderId: string) => {
        setSelectedFolderId(folderId);
        setSelectedEmailId(null);
    };

    const handleSelectEmail = (emailId: string) => {
        setSelectedEmailId(emailId);
        setShowCompose(false);
    };

    const handleCompose = () => {
        setShowCompose(true);
        setSelectedEmailId(null);
        setCompose({ to: "", subject: "", body: "" });
    };

    const handleSendCompose = () => {
        // Placeholder — will be replaced with API call
        alert("Email sent (placeholder)");
        setShowCompose(false);
    };

    const handleToggleCollapse = (folderId: string) => {
        setCollapsedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const handleAddFolder = async () => {
        try {
            const email = settings.user.email;
            const password = settings.user.password;
            
            const res = await getFolders({ email, password });
            console.log("Get folders response:", res);
            if ((res as any).folders) {
                setAvailableFolders((res as any).folders);
                console.log("Available folders set:", (res as any).folders);
            } else {
                console.log("No folders found in response");
            }
            
            setShowAddFolderModal(true);
        } catch (error) {
            console.error("Error fetching folders:", error);
            alert("Failed to fetch folders. Please try again.");
        }
    };

    const handleAddFolderSubmit = async (folderName: string, parentFolder?: string) => {
        try {
            const email = settings.user.email;
            const password = settings.user.password;
            
            await addFolder({ email, password, folder_name: folderName, parent_folder: parentFolder });
            
            // Refresh emails to get the updated folder list
            await getEmails();
            
            alert("Folder added successfully!");
        } catch (error) {
            console.error("Error adding folder:", error);
            alert("Failed to add folder. Please try again.");
        }
    };

    return (
        <React.Fragment>
            <div className="flex overflow-hidden bg-[#1a1a1a]" style={{ height: "calc(100vh - 64px)" }}>

                {/* Left sidebar */}
                <aside
                    className="relative z-10 w-72 bg-[#1a1a1a] flex flex-col shrink-0 border-r border-[rgba(124,58,237,0)]"
                    style={{ boxShadow: "4px 0 24px rgba(124,58,237,0.10)" }}
                >
                    <nav className="flex-1 overflow-y-auto p-2">
                        {folders.map((folder) => {
                            const isActive = folder.id === selectedFolderId;
                            const isCollapsed = collapsedFolders.has(folder.id);
                            const showInlineEmails = !settings.showFolderPreview;

                            return (
                                <div key={folder.id} className="mb-1">
                                    <div className="flex items-center gap-1">

                                        {/* Collapse toggle */}
                                        {showInlineEmails && (
                                            <button
                                                type="button"
                                                onClick={() => handleToggleCollapse(folder.id)}
                                                className="text-[rgba(124,58,237,0.50)] hover:text-[#7c3aed] transition-colors w-5 h-5 flex items-center justify-center shrink-0"
                                                title={isCollapsed ? "Expand" : "Collapse"}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`w-3 h-3 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Folder label button */}
                                        <button
                                            type="button"
                                            onClick={() => handleSelectFolder(folder.id)}
                                            className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? "bg-[rgba(124,58,237,0.18)] text-[#a78bfa]"
                                                : "text-gray-400 hover:bg-[rgba(124,58,237,0.08)] hover:text-gray-200"
                                                }`}
                                        >
                                            <span>{folder.label}</span>
                                        </button>
                                    </div>

                                    {/* Inline email list — visible when folder preview panel is hidden */}
                                    {showInlineEmails && !isCollapsed && (
                                        <div className="ml-6 mt-0.5 space-y-0.5">
                                            {folder.emails.length === 0 ? (
                                                <p className="text-xs text-gray-600 px-2 py-1">No emails</p>
                                            ) : (
                                                folder.emails.map((email) => (
                                                    <button
                                                        key={email.id}
                                                        type="button"
                                                        onClick={() => handleSelectEmail(email.id)}
                                                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${selectedEmailId === email.id
                                                            ? "bg-[rgba(124,58,237,0.18)] text-[#a78bfa]"
                                                            : "text-gray-500 hover:bg-[rgba(124,58,237,0.08)] hover:text-gray-300"
                                                            }`}
                                                    >
                                                        <div className="truncate">{email.subject}</div>
                                                        <div className="text-gray-600 truncate text-xs">{email.from}</div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Bottom bar — toggle preview mode and action buttons */}
                    <div className="p-3 border-t border-[rgba(124,58,237,0)] flex justify-between items-center gap-2">
                        <UIButton
                            type="button"
                            onClick={() => setShowFolderPreview(!showFolderPreview)}
                            className={`text-xs px-3 py-1 rounded-md ${darkMode ? "bg-[#3b3b3b] text-white" : "bg-white text-gray-700"}`}
                        >
                            {showFolderPreview ? "Hide preview" : "Show preview"}
                        </UIButton>
                        <div className="flex gap-2">
                            <UIIconButton
                                onClick={handleCompose}
                                title="New Email"
                                variant="dark"
                                className="w-10 h-10 text-[#a78bfa]"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                }
                            />
                            <UIIconButton
                                onClick={handleAddFolder}
                                title="Add folder"
                                variant="dark"
                                className="w-10 h-10 text-[#a78bfa]"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </aside>

                {/* Main content area */}
                <main className="flex-1 flex overflow-hidden bg-[#1a1a1a]">

                    {/* Show loading or empty state when no folders */}
                    {!selectedFolder && (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-sm text-gray-600">
                                {folders.length === 0 ? "Loading emails..." : "Select a folder to view emails"}
                            </p>
                        </div>
                    )}

                    {/* Email list panel — only shown when settings.showFolderPreview is true */}
                    {settings.showFolderPreview && selectedFolder && (
                        <div className="w-80 border-r border-[rgba(124,58,237,0.25)] bg-[#1a1a1a] flex flex-col shrink-0">
                            <div className="px-4 py-3 border-b border-[rgba(124,58,237,0.25)]">
                                <h2 className="text-sm font-semibold text-gray-200">{selectedFolder.label}</h2>
                                <p className="text-xs text-gray-500">{selectedFolder.emails.length} messages</p>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-[rgba(124,58,237,0.12)]">
                                {selectedFolder.emails.length === 0 ? (
                                    <p className="text-sm text-gray-500 p-4">No emails in this folder.</p>
                                ) : (
                                    selectedFolder.emails.map((email) => (
                                        <button
                                            key={email.id}
                                            type="button"
                                            onClick={() => handleSelectEmail(email.id)}
                                            className={`w-full text-left px-4 py-3 transition-colors ${selectedEmailId === email.id
                                                ? "bg-[rgba(124,58,237,0.18)] border-l-2 border-[#7c3aed]"
                                                : "hover:bg-[rgba(124,58,237,0.08)]"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className={`text-sm truncate font-medium text-gray-300`}>
                                                    {email.from}
                                                </span>
                                                <span className="text-xs text-gray-600 shrink-0 ml-2">{email.date}</span>
                                            </div>
                                            <div className={`text-sm truncate text-gray-400`}>
                                                {email.subject}
                                            </div>
                                            <div className="text-xs text-gray-600 truncate mt-0.5">{email.date}</div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Email viewer / compose panel */}
                    <div className={`flex-1 overflow-hidden flex flex-col ${showCompose || !selectedEmail ? "bg-[#1a1a1a] p-6" : "bg-[#1a1a1a]"}`}>

                        {/* Compose view */}
                        {showCompose && (
                            <div className="rounded-2xl p-6 max-w-2xl mx-auto w-full border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_48px_rgba(124,58,237,0.15)] backdrop-blur-sm">
                                <h2 className="text-lg font-bold mb-4 text-gray-100">New Email</h2>

                                <div className="space-y-4">
                                    <UITextInput
                                        type="email"
                                        label="To"
                                        placeholder="recipient@example.com"
                                        value={compose.to}
                                        onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                                        darkMode={darkMode}
                                    />
                                    <UITextInput
                                        type="text"
                                        label="Subject"
                                        placeholder="Subject"
                                        value={compose.subject}
                                        onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                                        darkMode={darkMode}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                                        <textarea
                                            rows={10}
                                            placeholder="Write your message here..."
                                            value={compose.body}
                                            onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] resize-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <UIButton onClick={handleSendCompose} darkMode={darkMode}>
                                            Send
                                        </UIButton>
                                        <UIButton onClick={() => setShowCompose(false)} variant="secondary" darkMode={darkMode}>
                                            Discard
                                        </UIButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email detail view */}
                        {!showCompose && selectedEmail && (
                            <div className="flex-1 overflow-hidden">
                                <UIEmailDetail
                                    id={parseInt(selectedEmail.id)}
                                    from={selectedEmail.from}
                                    subject={selectedEmail.subject}
                                    preview=""
                                    body={selectedEmail.body}
                                    date={selectedEmail.date}
                                    read={true}
                                    onReply={handleCompose}
                                    darkMode={darkMode}
                                />
                            </div>
                        )}

                        {/* Empty state */}
                        {!showCompose && !selectedEmail && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-gray-600">Select an email to read it</p>
                            </div>
                        )}

                    </div>
                </main>
            </div>
            
            {/* Add Folder Modal */}
            <AddFolderModal
                isOpen={showAddFolderModal}
                onClose={() => setShowAddFolderModal(false)}
                onAddFolder={handleAddFolderSubmit}
                darkMode={darkMode}
                availableFolders={availableFolders}
            />
        </React.Fragment>
    );
}

export default EmailPage;