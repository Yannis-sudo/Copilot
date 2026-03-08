import React, { useState } from "react";
import UIEmailDetail from "../components/containers/UIEmailDetail";
import UIButton from "../components/UIButton";
import UITextInput from "../components/UITextInput";
import UIIconButton from "../components/UIIconButton";

// Types for emails and folders
interface Email {
    id: number;
    from: string;
    subject: string;
    preview: string;
    body: string;
    date: string;
    read: boolean;
}

interface Folder {
    id: string;
    label: string;
    emails: Email[];
}

// Hardcoded email data — replace with API calls later
const initialFolders: Folder[] = [
    {
        id: "inbox",
        label: "Inbox",
        emails: [
            {
                id: 1,
                from: "alice@example.com",
                subject: "Project Update",
                preview: "Hey, just wanted to give you a quick update on the project...",
                body: "Hey,\n\nJust wanted to give you a quick update on the project. We finished the initial design phase and are now moving into development. Let me know if you have any questions or concerns.\n\nBest,\nAlice",
                date: "2026-03-06",
                read: false,
            },
            {
                id: 2,
                from: "bob@company.com",
                subject: "Meeting Tomorrow",
                preview: "Don't forget we have a standup at 10am tomorrow morning...",
                body: "Hi,\n\nDon't forget we have a standup at 10am tomorrow morning. The agenda includes sprint review and upcoming milestones. Please come prepared.\n\nThanks,\nBob",
                date: "2026-03-05",
                read: true,
            },
            {
                id: 3,
                from: "newsletter@techdigest.io",
                subject: "Your Weekly Tech Digest",
                preview: "This week in tech: AI breakthroughs, new framework releases...",
                body: "Hello,\n\nThis week in tech: AI breakthroughs, new framework releases, and a deep dive into WebAssembly performance. Read on for the full summary.\n\n- The Tech Digest Team",
                date: "2026-03-04",
                read: true,
            },
        ],
    },
    {
        id: "sent",
        label: "Sent",
        emails: [
            {
                id: 4,
                from: "me@example.com",
                subject: "Re: Project Update",
                preview: "Thanks Alice! Great to hear, let me know if you need anything...",
                body: "Thanks Alice!\n\nGreat to hear, let me know if you need anything from my side. Happy to help with testing once the first build is ready.\n\nCheers",
                date: "2026-03-06",
                read: true,
            },
        ],
    },
    {
        id: "drafts",
        label: "Drafts",
        emails: [
            {
                id: 5,
                from: "me@example.com",
                subject: "Follow-up on proposal",
                preview: "I wanted to follow up regarding the proposal I sent last week...",
                body: "Hi,\n\nI wanted to follow up regarding the proposal I sent last week. Please let me know if you have had a chance to review it.\n\nBest",
                date: "2026-03-03",
                read: true,
            },
        ],
    },
    {
        id: "trash",
        label: "Trash",
        emails: [
            {
                id: 6,
                from: "spam@promo.net",
                subject: "You have won a prize!",
                preview: "Congratulations! Click here to claim your reward...",
                body: "Congratulations!\n\nClick here to claim your reward. This offer expires in 24 hours.",
                date: "2026-03-01",
                read: true,
            },
        ],
    },
];

function EmailPage({ darkMode = false }: { darkMode?: boolean }) {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [selectedFolderId, setSelectedFolderId] = useState<string>("inbox");
    const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

    // Track which folders are collapsed in the sidebar
    const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

    // Settings — showFolderPreview controls the middle email list panel
    const [settings] = useState({ showFolderPreview: false });

    const selectedFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];
    const selectedEmail = selectedFolder.emails.find((e) => e.id === selectedEmailId) || null;

    const handleSelectFolder = (folderId: string) => {
        setSelectedFolderId(folderId);
        setSelectedEmailId(null);
    };

    const handleSelectEmail = (emailId: number) => {
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

    const handleAddFolder = () => {
        const name = prompt("Folder name:");
        if (!name || !name.trim()) return;
        const newFolder: Folder = {
            id: `folder-${Date.now()}`,
            label: name.trim(),
            emails: [],
        };
        setFolders((prev) => [...prev, newFolder]);
    };

    return (
        <React.Fragment>
            <div className={`flex h-full overflow-hidden ${darkMode ? "bg-dark" : "bg-gray-100"}`}>

                {/* Left sidebar — z-10 + relative so the right-side shadow is visible over siblings */}
                <aside className={`relative z-10 w-72 ${darkMode ? "bg-gray-900" : "bg-white"} flex flex-col shrink-0`} style={{ boxShadow: darkMode ? "4px 0 12px rgba(0,0,0,0.30)" : "4px 0 12px rgba(0,0,0,0.10)" }}>


                    <nav className="flex-1 overflow-y-auto p-2">
                        {folders.map((folder) => {
                            const unread = folder.emails.filter((e) => !e.read).length;
                            const isActive = folder.id === selectedFolderId;
                            const isCollapsed = collapsedFolders.has(folder.id);

                            // When showFolderPreview is off, show emails inline under each folder
                            const showInlineEmails = !settings.showFolderPreview;

                            return (
                                <div key={folder.id} className="mb-1">
                                    <div className="flex items-center gap-1">
                                        {/* Collapse toggle — only shown when inline emails are visible */}
                                        {showInlineEmails && (
                                            <button
                                                type="button"
                                                onClick={() => handleToggleCollapse(folder.id)}
                                                className={`transition-colors w-5 h-5 flex items-center justify-center shrink-0 ${darkMode ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
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
                                            className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? darkMode ? "bg-primary-900 text-primary-400" : "bg-primary-50 text-primary-700"
                                                    : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <span>{folder.label}</span>
                                            {unread > 0 && (
                                                <span className={`text-xs rounded-full px-2 py-0.5 ${darkMode ? "bg-primary-600 text-white" : "bg-primary-600 text-white"}`}>
                                                    {unread}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Inline email list — shown when showFolderPreview is off and folder is not collapsed */}
                                    {showInlineEmails && !isCollapsed && (
                                        <div className="ml-6 mt-0.5 space-y-0.5">
                                            {folder.emails.length === 0 ? (
                                                <p className={`text-xs px-2 py-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>No emails</p>
                                            ) : (
                                                folder.emails.map((email) => (
                                                    <button
                                                        key={email.id}
                                                        type="button"
                                                        onClick={() => handleSelectEmail(email.id)}
                                                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                                                            selectedEmailId === email.id
                                                                ? darkMode ? "bg-primary-900 text-primary-400" : "bg-primary-100 text-primary-800"
                                                                : darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                                                        } ${!email.read ? "font-semibold" : ""}`}
                                                    >
                                                        <div className="truncate">{email.subject}</div>
                                                        <div className={`truncate text-xs ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{email.from}</div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Bottom bar — new email and add folder icon buttons */}
                    <div className={`p-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} flex justify-end gap-2`}>
                        <UIIconButton
                            onClick={handleCompose}
                            title="New Email"
                            variant="dark"
                            className="w-10 h-10"
                            darkMode={darkMode}
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
                            className="w-10 h-10"
                            darkMode={darkMode}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            }
                        />
                    </div>
                </aside>

                {/* Main content area */}
                <main className={`flex-1 flex overflow-hidden border-l ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>

                    {/* Email list panel — only shown when settings.showFolderPreview is true */}
                    {settings.showFolderPreview && (
                        <div className={`w-80 border-r ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} flex flex-col shrink-0`}>
                            <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                <h2 className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{selectedFolder.label}</h2>
                                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{selectedFolder.emails.length} messages</p>
                            </div>

                            <div className={`flex-1 overflow-y-auto ${darkMode ? "divide-gray-700" : "divide-gray-100"} divide-y`}>
                                {selectedFolder.emails.length === 0 ? (
                                    <p className={`text-sm p-4 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>No emails in this folder.</p>
                                ) : (
                                    selectedFolder.emails.map((email) => (
                                        <button
                                            key={email.id}
                                            type="button"
                                            onClick={() => handleSelectEmail(email.id)}
                                            className={`w-full text-left px-4 py-3 transition-colors ${
                                                selectedEmailId === email.id ? darkMode ? "bg-primary-900 border-l-2 border-primary-500" : "bg-primary-50 border-l-2 border-primary-500" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className={`text-sm truncate ${!email.read ? "font-bold" : "font-medium"} ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                                                    {email.from}
                                                </span>
                                                <span className={`text-xs shrink-0 ml-2 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{email.date}</span>
                                            </div>
                                            <div className={`text-sm truncate ${!email.read ? "font-semibold" : ""} ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                {email.subject}
                                            </div>
                                            <div className={`text-xs truncate mt-0.5 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{email.preview}</div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Email viewer / compose panel */}
                    <div className={`flex-1 overflow-hidden flex flex-col ${showCompose || !selectedEmail ? darkMode ? "bg-dark p-6" : "bg-gray-100 p-6" : darkMode ? "bg-gray-900" : "bg-white"}`}>

                        {/* Compose view */}
                        {showCompose && (
                            <div className={`rounded-2xl shadow-lg outline outline-2 p-6 max-w-2xl mx-auto ${darkMode ? "bg-gray-800 outline-primary-900" : "bg-white outline-primary-200"}`}>
                                <h2 className={`text-lg font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>New Email</h2>

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
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Message</label>
                                        <textarea
                                            rows={10}
                                            placeholder="Write your message here..."
                                            value={compose.body}
                                            onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${darkMode ? "border-gray-700 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <UIButton onClick={handleSendCompose} darkMode={darkMode}>
                                            Send
                                        </UIButton>
                                        <UIButton
                                            onClick={() => setShowCompose(false)}
                                            variant="secondary"
                                            darkMode={darkMode}
                                        >
                                            Discard
                                        </UIButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email detail view */}
                        {!showCompose && selectedEmail && (
                            <UIEmailDetail
                                id={selectedEmail.id}
                                from={selectedEmail.from}
                                subject={selectedEmail.subject}
                                preview={selectedEmail.preview}
                                body={selectedEmail.body}
                                date={selectedEmail.date}
                                read={selectedEmail.read}
                                onReply={handleCompose}
                                darkMode={darkMode}
                            />
                        )}

                        {/* Empty state */}
                        {!showCompose && !selectedEmail && (
                            <div className="flex items-center justify-center h-full">
                                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Select an email to read it</p>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </React.Fragment>
    );
}

export default EmailPage;