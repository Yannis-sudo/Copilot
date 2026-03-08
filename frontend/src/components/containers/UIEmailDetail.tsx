import UIButton from "../UIButton";
import UIIconButton from "../UIIconButton";

interface UIEmailDetailProps {
    id: number;
    from: string;
    subject: string;
    preview: string;
    body: string;
    date: string;
    read: boolean;
    onReply: () => void;
}

export default function UIEmailDetail(props: UIEmailDetailProps) {

    // Placeholder handlers — wire up to API calls later
    const handleReplyAll = () => {};
    const handleForward = () => {};
    const handleDelete = () => {};
    const handleArchive = () => {};
    const handleMarkUnread = () => {};
    const handleStar = () => {};

    return (
        <div className="flex flex-col h-full bg-white">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{props.subject}</h2>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        From: <span className="text-gray-700 font-medium">{props.from}</span>
                    </p>
                    <div className="flex items-center gap-3">
                        {!props.read && (
                            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                                Unread
                            </span>
                        )}
                        <p className="text-xs text-gray-400">{props.date}</p>
                    </div>
                </div>
            </div>

            {/* Body — scrollable email content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {props.body}
                </p>
            </div>

            {/* Footer — primary actions left, secondary actions right */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white shrink-0 flex items-center justify-between">

                {/* Primary actions */}
                <div className="flex items-center gap-2">
                    <UIButton onClick={props.onReply}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                    </UIButton>
                    <UIButton onClick={handleReplyAll}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h10a8 8 0 018 8v2M7 10l6 6M7 10l6-6M3 10h2" />
                        </svg>
                        Reply All
                    </UIButton>
                    <UIButton onClick={handleForward} variant="secondary">
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
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={handleMarkUnread}
                        title="Mark as unread"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={handleArchive}
                        title="Archive"
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