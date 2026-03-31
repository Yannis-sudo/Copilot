import React, { useState, useEffect } from "react";
import UIButton from "../components/UIButton";
import UIIconButton from "../components/UIIconButton";
import UIEmailDetail from "../components/containers/UIEmailDetail";
import UIEmailCompose from "../components/containers/UIEmailCompose";
import AddFolderModal from "../components/AddFolderModal";
import { useSettings } from "../context/SettingsContext";
import { fetchEmails, addFolder, getFolders, sendEmail } from "../api";
import { AUTH_MESSAGES } from "../constants";
import { useNavigate } from "react-router-dom";
import type { Folder } from "../types/api";

// Helper function to build hierarchical folder structure
const buildFolderTree = (folders: Folder[]): Folder[] => {
    const folderMap = new Map<string, Folder>();
    const rootFolders: Folder[] = [];
    
    // Create a map of all folders
    folders.forEach(folder => {
        folderMap.set(folder.id, { ...folder, children: [] });
    });
    
    // Build the tree structure
    folders.forEach(folder => {
        const folderNode = folderMap.get(folder.id)!;
        // Handle different IMAP delimiter patterns: /, ., or no delimiter
        let pathParts: string[];
        
        // Try different delimiters
        if (folder.id.includes('/')) {
            pathParts = folder.id.split('/');
        } else if (folder.id.includes('.')) {
            pathParts = folder.id.split('.');
        } else {
            // No clear delimiter, treat as single path part
            pathParts = [folder.id];
        }
        
        if (pathParts.length === 1) {
            // This is a root folder
            rootFolders.push(folderNode);
        } else {
            // This is a subfolder - try to find parent using the same delimiter
            let parentPath: string;
            if (folder.id.includes('/')) {
                parentPath = pathParts.slice(0, -1).join('/');
            } else {
                parentPath = pathParts.slice(0, -1).join('.');
            }
            
            const parentFolder = folderMap.get(parentPath);
            
            if (parentFolder) {
                parentFolder.children!.push(folderNode);
            } else {
                // If parent doesn't exist, treat as root folder
                rootFolders.push(folderNode);
            }
        }
    });
    
    return rootFolders;
};

// Test function for folder hierarchy (can be called from browser console)
export const testFolderHierarchy = () => {
    const mockFolders: Folder[] = [
        { id: 'INBOX', label: 'INBOX', emails: [] },
        { id: 'Sent', label: 'Sent', emails: [] },
        { id: 'Drafts', label: 'Drafts', emails: [] },
        { id: 'INBOX/Work', label: 'Work', emails: [] },
        { id: 'INBOX/Personal', label: 'Personal', emails: [] },
        { id: 'INBOX/Work/Project1', label: 'Project1', emails: [] },
        { id: 'INBOX/Work/Project2', label: 'Project2', emails: [] },
        { id: 'Archive', label: 'Archive', emails: [] },
        { id: 'Archive/2023', label: '2023', emails: [] },
        { id: 'Archive/2024', label: '2024', emails: [] },
    ];
    
    console.log("Testing folder hierarchy with mock data...");
    const result = buildFolderTree(mockFolders);
    console.log("Test result:", result);
    return result;
};

// Recursive component to render folder tree
const FolderTreeItem: React.FC<{
    folder: Folder;
    level: number;
    selectedFolderId: string;
    collapsedFolders: Set<string>;
    onSelectFolder: (id: string) => void;
    onToggleCollapse: (id: string) => void;
    showInlineEmails: boolean;
    selectedEmailId: string | null;
    onSelectEmail: (id: string) => void;
}> = ({ 
    folder, 
    level, 
    selectedFolderId, 
    collapsedFolders, 
    onSelectFolder, 
    onToggleCollapse,
    showInlineEmails,
    selectedEmailId,
    onSelectEmail
}) => {
    const isActive = folder.id === selectedFolderId;
    const isCollapsed = collapsedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSubfolder = level > 0;
    const indent = level * 20;
    
    return (
        <div className="mb-1">
            <div className="flex items-center gap-1" style={{ marginLeft: `${indent}px` }}>
                {/* Subfolder indicator line */}
                {isSubfolder && (
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[rgba(124,58,237,0.2)]" style={{ marginLeft: `${-10}px` }} />
                )}
                
                {/* Collapse toggle for folders with children */}
                {showInlineEmails && hasChildren && (
                    <button
                        type="button"
                        onClick={() => onToggleCollapse(folder.id)}
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
                    onClick={() => onSelectFolder(folder.id)}
                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${isActive
                        ? isSubfolder 
                            ? "bg-[rgba(124,58,237,0.12)] text-[#c4b5fd] border-l-2 border-[#7c3aed]"
                            : "bg-[rgba(124,58,237,0.18)] text-[#a78bfa]"
                        : isSubfolder
                            ? "text-gray-500 hover:bg-[rgba(124,58,237,0.06)] hover:text-gray-300 border-l-2 border-transparent"
                            : "text-gray-400 hover:bg-[rgba(124,58,237,0.08)] hover:text-gray-200"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {/* Folder icon with different styles for subfolders */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`w-4 h-4 ${isSubfolder ? "text-[rgba(124,58,237,0.6)]" : "text-[rgba(124,58,237,0.8)]"}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {folder.label}
                        {folder.emails && folder.emails.length > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                isSubfolder 
                                    ? "text-gray-600 bg-[rgba(124,58,237,0.08)]" 
                                    : "text-gray-500 bg-[rgba(124,58,237,0.1)]"
                            }`}>
                                {folder.emails.length}
                            </span>
                        )}
                    </span>
                </button>
            </div>
            
            {/* Inline email list */}
            {showInlineEmails && !isCollapsed && folder.emails && folder.emails.length > 0 && (
                <div className="ml-6 mt-0.5 space-y-0.5" style={{ marginLeft: `${indent + 32}px` }}>
                    {folder.emails.map((email) => (
                        <button
                            key={email.id}
                            type="button"
                            onClick={() => onSelectEmail(email.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${selectedEmailId === email.id
                                ? "bg-[rgba(124,58,237,0.18)] text-[#a78bfa]"
                                : "text-gray-500 hover:bg-[rgba(124,58,237,0.08)] hover:text-gray-300"
                                }`}
                        >
                            <div className="truncate">{email.subject}</div>
                            <div className="text-gray-600 truncate text-xs">{email.from}</div>
                        </button>
                    ))}
                </div>
            )}
            
            {/* Always render children (subfolders) */}
            {folder.children && folder.children.map((child) => (
                <FolderTreeItem
                    key={child.id}
                    folder={child}
                    level={level + 1}
                    selectedFolderId={selectedFolderId}
                    collapsedFolders={collapsedFolders}
                    onSelectFolder={onSelectFolder}
                    onToggleCollapse={onToggleCollapse}
                    showInlineEmails={showInlineEmails}
                    selectedEmailId={selectedEmailId}
                    onSelectEmail={onSelectEmail}
                />
            ))}
        </div>
    );
};

function EmailPage() {
    const navigate = useNavigate();

    const { settings, setShowFolderPreview, setEmails, loadEmails } = useSettings();
    const { darkMode } = settings;
    const [selectedFolderId, setSelectedFolderId] = useState<string>("inbox");
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [availableFolders, setAvailableFolders] = useState<string[]>([]);

    // Track which folders are collapsed in the sidebar
    const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

    const folders = buildFolderTree(settings.emails);
    
    // Helper function to find folder in hierarchical tree
    const findFolderInTree = (folders: Folder[], folderId: string): Folder | null => {
        for (const folder of folders) {
            if (folder.id === folderId) {
                return folder;
            }
            if (folder.children) {
                const found = findFolderInTree(folder.children, folderId);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };
    
    const selectedFolder = findFolderInTree(folders, selectedFolderId) || (folders.length > 0 ? folders[0] : null);
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
            console.log("API Data received:", apiData);
            console.log("Folders from API:", apiData.folders);
            
    // Transform folders and emails from API to frontend format
            const transformedFolders: Folder[] = apiData.folders.map((folderName: string) => ({
                id: folderName,
                label: folderName.split('/').pop() || folderName, // Show only the last part of the path
                emails: apiData.emails
                    .filter((email: any) => email.folder === folderName)
                    .map((email: any) => ({
                        id: email.message_id,
                        from: email.from,
                        subject: email.subject,
                        date: email.date,
                        folder: email.folder,
                        message_id: email.message_id,
                        body: email.body,
                        attachments: email.attachments || [],
                        has_attachments: email.has_attachments || false
                    }))
            }));
            
            console.log("Transformed folders:", transformedFolders);
            setEmails(transformedFolders);
        }
    };

    // Run getEmails once when the component mounts if no emails loaded
    useEffect(() => {
        if (settings.emails.length === 0) {
            getEmails();
        }
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

    const handleSendCompose = async (files?: File[]) => {
        try {
            const email = settings.user.email;
            const password = settings.user.password;
            
            await sendEmail({
                to: compose.to,
                subject: compose.subject,
                body: compose.body,
                email,
                password,
                files
            });
            
            alert("Email sent successfully!");
            setShowCompose(false);
            setCompose({ to: "", subject: "", body: "" });
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        }
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
                        {folders.map((folder) => (
                            <FolderTreeItem
                                key={folder.id}
                                folder={folder}
                                level={0}
                                selectedFolderId={selectedFolderId}
                                collapsedFolders={collapsedFolders}
                                onSelectFolder={handleSelectFolder}
                                onToggleCollapse={handleToggleCollapse}
                                showInlineEmails={!settings.showFolderPreview}
                                selectedEmailId={selectedEmailId}
                                onSelectEmail={handleSelectEmail}
                            />
                        ))}
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
                                onClick={loadEmails}
                                title="Reload emails"
                                variant="dark"
                                className="w-10 h-10 text-[#a78bfa]"
                                icon={
                                    settings.emailsLoading ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    )
                                }
                            />
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
                    <div className={`flex-1 overflow-hidden flex flex-col`}>

                        {/* Compose view */}
                        {showCompose && (
                            <UIEmailCompose
                                to={compose.to}
                                subject={compose.subject}
                                body={compose.body}
                                onToChange={(value) => setCompose({ ...compose, to: value })}
                                onSubjectChange={(value) => setCompose({ ...compose, subject: value })}
                                onBodyChange={(value) => setCompose({ ...compose, body: value })}
                                onSend={handleSendCompose}
                                onDiscard={() => setShowCompose(false)}
                                darkMode={darkMode}
                            />
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
                                    attachments={selectedEmail.attachments}
                                    has_attachments={selectedEmail.has_attachments}
                                    onReply={handleCompose}
                                    darkMode={darkMode}
                                />
                            </div>
                        )}

                        {/* Empty state */}
                        {!showCompose && !selectedEmail && (
                            <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
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