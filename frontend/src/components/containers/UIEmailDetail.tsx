import UIButton from "../UIButton";
import UIIconButton from "../UIIconButton";
import DOMPurify from "dompurify";
import { useState } from "react";

interface UIEmailDetailProps {
    id: number;
    from: string;
    subject: string;
    preview: string;
    body: string;
    date: string;
    read: boolean;
    onReply: () => void;
    darkMode?: boolean;
}

export default function UIEmailDetail(props: UIEmailDetailProps) {
    const [showPlainText, setShowPlainText] = useState(false);

    // Check if body contains HTML tags
    const isHTML = /<[^>]+>/.test(props.body);
    
    // Sanitize HTML to prevent XSS attacks
    const sanitizedHTML = isHTML ? DOMPurify.sanitize(props.body, {
        ALLOWED_TAGS: [
            'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'b', 'em', 'i', 'u', 's', 'strike',
            'ul', 'ol', 'li',
            'a', 'img',
            'table', 'tr', 'td', 'th', 'thead', 'tbody',
            'blockquote', 'pre', 'code',
            'hr'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'class'],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus']
    }) : null;

    // Placeholder handlers — wire up to API calls later
    const handleReplyAll = () => {};
    const handleForward = () => {};
    const handleDelete = () => {};
    const handleArchive = () => {};
    const handleMarkUnread = () => {};
    const handleStar = () => {};

    const borderColor = "border-[rgba(255,255,255,0.06)]";
    const metaText = "text-xs text-gray-500";

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a]">

            {/* Header — email metadata */}
            <div className={`px-6 py-5 border-b ${borderColor} shrink-0`}>

                <h2 className="text-lg font-semibold text-gray-100 mb-3 leading-snug">
                    {props.subject}
                </h2>

                {/* Sender row */}
                <div className="flex items-center gap-3 mb-2">
                    {/* Avatar placeholder using the first letter of the sender */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-gray-300 uppercase">
                            {props.from.charAt(0)}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-300 truncate">{props.from}</p>
                        <p className={metaText}>To: me</p>
                    </div>

                    {/* Date and unread badge */}
                    <div className="flex items-center gap-2 shrink-0">
                        {!props.read && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-600 text-gray-200">
                                Unread
                            </span>
                        )}
                        <p className={metaText}>{props.date}</p>
                    </div>
                </div>
            </div>

            {/* Body — scrollable email content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Toggle button for HTML/Plain Text view */}
                {isHTML && (
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setShowPlainText(!showPlainText)}
                            className="text-xs px-3 py-1 rounded-md border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors"
                        >
                            {showPlainText ? "Show HTML" : "Show as plain text"}
                        </button>
                    </div>
                )}
                
                {/* Email content */}
                <div className="text-gray-300">
                    {isHTML && !showPlainText && sanitizedHTML ? (
                        <div
                            className="prose prose-invert max-w-none prose-sm prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-gray-100 prose-code:text-gray-200"
                            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                        />
                    ) : (
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                            {props.body}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer — primary actions on the left, icon actions on the right */}
            <div className={`px-6 py-4 border-t ${borderColor} shrink-0 flex items-center justify-between`}>

                {/* Primary actions */}
                <div className="flex items-center gap-2">
                    <UIButton onClick={props.onReply} darkMode={props.darkMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                    </UIButton>
                    <UIButton onClick={handleReplyAll} darkMode={props.darkMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h10a8 8 0 018 8v2M7 10l6 6M7 10l6-6M3 10h2" />
                        </svg>
                        Reply All
                    </UIButton>
                    <UIButton onClick={handleForward} variant="secondary" darkMode={props.darkMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
                        </svg>
                        Forward
                    </UIButton>
                </div>

                {/* Secondary actions — icon-only */}
                <div className="flex items-center gap-1">
                    <UIIconButton
                        onClick={handleStar}
                        title="Star"
                        variant="success"
                        darkMode={props.darkMode}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={handleMarkUnread}
                        title="Mark as unread"
                        darkMode={props.darkMode}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={handleArchive}
                        title="Archive"
                        darkMode={props.darkMode}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={handleDelete}
                        title="Delete"
                        variant="danger"
                        darkMode={props.darkMode}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        }
                    />
                </div>

            </div>

        </div>
    );
}