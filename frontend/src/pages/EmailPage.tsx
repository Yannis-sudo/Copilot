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
import useTheme from "../hooks/useTheme";

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

    return buildFolderTree(mockFolders);
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
    const theme = useTheme();
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
                    <div className="absolute left-0 top-0 bottom-0 w-px" style={{ marginLeft: `${-10}px`, backgroundColor: theme.colors.alpha25 }} />
                )}
                
                {/* Collapse toggle for folders with children */}
                {showInlineEmails && hasChildren && (
                    <button
                        type="button"
                        onClick={() => onToggleCollapse(folder.id)}
                        className="transition-colors w-5 h-5 flex items-center justify-center shrink-0"
                        style={{ color: theme.colors.alpha25 }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = theme.colors.primary}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = theme.colors.alpha25}
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
                    className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors relative border-l-2"
                    style={{
                        backgroundColor: isActive 
                            ? (isSubfolder ? theme.colors.alpha12 : theme.colors.alpha18)
                            : "transparent",
                        color: isActive 
                            ? theme.colors.primaryLight 
                            : (isSubfolder ? "#6b7280" : "#9ca3af"),
                        borderColor: isActive 
                            ? theme.colors.primary 
                            : "transparent"
                    }}
                    onMouseEnter={(e) => {
                        if (!isActive) {
                            (e.target as HTMLButtonElement).style.backgroundColor = isSubfolder ? theme.colors.alpha08 : theme.colors.alpha12;
                            (e.target as HTMLButtonElement).style.color = "#d1d5db";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActive) {
                            (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                            (e.target as HTMLButtonElement).style.color = isSubfolder ? "#6b7280" : "#9ca3af";
                        }
                    }}
                >
                    <span className="flex items-center gap-2">
                        {/* Folder icon with different styles for subfolders */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-4 h-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={1.5}
                            style={{ color: isSubfolder ? theme.colors.alpha25 : theme.colors.alpha18 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {folder.label}
                        {folder.emails && folder.emails.length > 0 && (
                            <span 
                                className="text-xs px-1.5 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: isSubfolder ? theme.colors.alpha08 : theme.colors.alpha12,
                                    color: isSubfolder ? "#4b5563" : "#6b7280"
                                }}
                            >
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
                            className="w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors"
                            style={{
                                backgroundColor: selectedEmailId === email.id ? theme.colors.alpha18 : "transparent",
                                color: selectedEmailId === email.id ? theme.colors.primaryLight : "#6b7280"
                            }}
                            onMouseEnter={(e) => {
                                if (selectedEmailId !== email.id) {
                                    (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.alpha08;
                                    (e.target as HTMLButtonElement).style.color = "#d1d5db";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedEmailId !== email.id) {
                                    (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                                    (e.target as HTMLButtonElement).style.color = "#6b7280";
                                }
                            }}
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
    const theme = useTheme();

    const { settings, setShowFolderPreview, setEmails, loadEmails } = useSettings();
    const { darkMode } = settings;
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [availableFolders, setAvailableFolders] = useState<string[]>([]);

    // Track which folders are collapsed in the sidebar
    const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

    const folders = buildFolderTree(settings.emails);

    // Ensure the selected folder is valid when folders change
    useEffect(() => {
        if (folders.length > 0) {
            setSelectedFolderId((prev) => prev || folders[0].id);
        }
    }, [folders]);

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
    const fetchEmailsFromBackend = async () => {
        const userEmail = settings.user.email;
        const password = settings.user.password;

        if (!userEmail || !password) {
            navigate("/login");
            return;
        }

        return await fetchEmails({ email: userEmail, password });
    };

    const handleFetchResponse = (res: any) => {
        if (res.message === AUTH_MESSAGES.INVALID_CREDENTIALS) {
            alert("Invalid credentials. Please check your email and password.");
            navigate("/login");
            return;
        }

        if (res.message === AUTH_MESSAGES.EMAIL_NOT_FOUND) {
            navigate("/email-setup");
            return;
        }

        if (res.message === AUTH_MESSAGES.EMAILS_FETCHED && res.emails) {
            const transformedFolders = transformApiDataToFolders(res.emails);
            setEmails(transformedFolders);
        }
    };

    const transformApiDataToFolders = (apiData: any): Folder[] => {
        return apiData.folders.map((folderName: string) => ({
            id: folderName,
            label: folderName.split('/').pop() || folderName,
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
                    has_attachments: email.has_attachments || false,
                }))
        }));
    };

    const getEmails = async () => {
        try {
            const res = await fetchEmailsFromBackend();
            if (res) {
                handleFetchResponse(res);
            }
        } catch (error) {
            console.error("Error loading emails:", error);
        }
    };

    // Run getEmails when the component mounts or when the stored email data is emptied.
    useEffect(() => {
        if (settings.emails.length === 0) {
            void getEmails();
        }
    }, [settings.emails.length]);

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
            if ((res as any).folders) {
                setAvailableFolders((res as any).folders);
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
                    className="relative z-10 w-72 bg-[#1a1a1a] flex flex-col shrink-0 border-r"
                    style={{ 
                        boxShadow: `4px 0 24px ${theme.colors.shadow}`,
                        borderColor: theme.colors.border
                    }}
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
                    <div className="p-3 border-t flex justify-between items-center gap-2" style={{ borderColor: theme.colors.border }}>
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
                                variant="dark"
                                className="w-10 h-10"
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
                                variant="dark"
                                className="w-10 h-10"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                }
                            />
                            <UIIconButton
                                onClick={handleAddFolder}
                                variant="dark"
                                className="w-10 h-10"
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
                        <div className="w-80 border-r bg-[#1a1a1a] flex flex-col shrink-0" style={{ borderColor: theme.colors.border }}>
                            <div className="px-4 py-3 border-b" style={{ borderColor: theme.colors.border }}>
                                <h2 className="text-sm font-semibold text-gray-200">{selectedFolder.label}</h2>
                                <p className="text-xs text-gray-500">{selectedFolder.emails.length} messages</p>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: theme.colors.alpha12 }}>
                                {selectedFolder.emails.length === 0 ? (
                                    <p className="text-sm text-gray-500 p-4">No emails in this folder.</p>
                                ) : (
                                    selectedFolder.emails.map((email) => (
                                        <button
                                            key={email.id}
                                            type="button"
                                            onClick={() => handleSelectEmail(email.id)}
                                            className="w-full text-left px-4 py-3 transition-colors border-l-2"
                                            style={{
                                                backgroundColor: selectedEmailId === email.id ? theme.colors.alpha18 : "transparent",
                                                borderColor: selectedEmailId === email.id ? theme.colors.primary : "transparent"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedEmailId !== email.id) {
                                                    (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.alpha08;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedEmailId !== email.id) {
                                                    (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                                                }
                                            }}
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