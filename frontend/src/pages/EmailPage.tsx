import React, { useState, useEffect } from "react";
import UIEmailDetail from "../components/containers/UIEmailDetail";
import UIButton from "../components/UIButton";
import UITextInput from "../components/UITextInput";
import UIIconButton from "../components/UIIconButton";
import { useSettings } from "../context/SettingsContext";
import { fetchEmails } from "../api";
import { AUTH_MESSAGES } from "../constants";
import { useNavigate } from "react-router-dom";

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

function EmailPage() {
    const navigate = useNavigate();

    const { settings, setShowFolderPreview } = useSettings();
    const { darkMode } = settings;
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [selectedFolderId, setSelectedFolderId] = useState<string>("inbox");
    const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

    // Track which folders are collapsed in the sidebar
    const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

    const selectedFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];
    const selectedEmail = selectedFolder.emails.find((e) => e.id === selectedEmailId) || null;
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

        // On success, replace the placeholder folders with real data from the API
        if (res.message === AUTH_MESSAGES.EMAILS_FETCHED && res.data) {
            setFolders(res.data);
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
            <div className="flex overflow-hidden bg-[#1a1a1a]" style={{ height: "calc(100vh - 64px)" }}>

                {/* Left sidebar */}
                <aside
                    className="relative z-10 w-72 bg-[#1a1a1a] flex flex-col shrink-0 border-r border-[rgba(124,58,237,0)]"
                    style={{ boxShadow: "4px 0 24px rgba(124,58,237,0.10)" }}
                >
                    <nav className="flex-1 overflow-y-auto p-2">
                        {folders.map((folder) => {
                            const unread = folder.emails.filter((e) => !e.read).length;
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
                                            {unread > 0 && (
                                                <span className="bg-[#7c3aed] text-white text-xs rounded-full px-2 py-0.5">
                                                    {unread}
                                                </span>
                                            )}
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
                                                            } ${!email.read ? "font-semibold" : ""}`}
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

                    {/* Email list panel — only shown when settings.showFolderPreview is true */}
                    {settings.showFolderPreview && (
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
                                                <span className={`text-sm truncate ${!email.read ? "font-bold text-gray-100" : "font-medium text-gray-300"}`}>
                                                    {email.from}
                                                </span>
                                                <span className="text-xs text-gray-600 shrink-0 ml-2">{email.date}</span>
                                            </div>
                                            <div className={`text-sm truncate ${!email.read ? "font-semibold text-gray-200" : "text-gray-400"}`}>
                                                {email.subject}
                                            </div>
                                            <div className="text-xs text-gray-600 truncate mt-0.5">{email.preview}</div>
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
                                <p className="text-sm text-gray-600">Select an email to read it</p>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </React.Fragment>
    );
}

export default EmailPage;