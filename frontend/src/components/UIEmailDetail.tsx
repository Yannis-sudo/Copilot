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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white shrink-0 flex justify-end">
                <button
                    type="button"
                    onClick={props.onReply}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                    Reply
                </button>
            </div>

        </div>
    );
}