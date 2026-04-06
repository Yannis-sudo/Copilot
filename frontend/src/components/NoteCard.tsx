import UIIconButton from "./UIIconButton";
import type { NoteInfo } from "../types/api";
import useTheme from "../hooks/useTheme";

type Priority = "low" | "medium" | "high";

const PRIORITY_STYLES: Record<Priority, string> = {
    low: "text-green-400 bg-[rgba(74,222,128,0.10)] border-[rgba(74,222,128,0.25)]",
    medium: "text-yellow-400 bg-[rgba(250,204,21,0.10)] border-[rgba(250,204,21,0.25)]",
    high: "text-red-400 bg-[rgba(248,113,113,0.10)] border-[rgba(248,113,113,0.25)]",
};

interface NoteCardProps {
    note: NoteInfo;
    isDragging: boolean;
    onNoteDragStart: (noteId: string) => void;
    onNoteDragEnd: () => void;
    onNoteDetail: (note: NoteInfo) => void;
    onNoteDelete: (noteId: string) => void;
}

// Individual draggable note card
function NoteCard({ note, isDragging, onNoteDragStart, onNoteDragEnd, onNoteDetail, onNoteDelete }: NoteCardProps) {
    const theme = useTheme();
    return (
        <div
            draggable
            onDragStart={() => onNoteDragStart(note.note_id)}
            onDragEnd={onNoteDragEnd}
            className="group rounded-xl border p-4 cursor-grab active:cursor-grabbing transition-all select-none"
            style={{
                backgroundColor: theme.colors.alpha08,
                borderColor: theme.colors.border,
                opacity: isDragging ? 0.4 : 1,
                transform: isDragging ? "scale(0.95)" : "scale(1)"
            }}
            onMouseEnter={(e) => {
                if (!isDragging) {
                    (e.target as HTMLElement).style.borderColor = theme.colors.alpha25;
                    (e.target as HTMLElement).style.backgroundColor = theme.colors.alpha12;
                }
            }}
            onMouseLeave={(e) => {
                if (!isDragging) {
                    (e.target as HTMLElement).style.borderColor = theme.colors.border;
                    (e.target as HTMLElement).style.backgroundColor = theme.colors.alpha08;
                }
            }}
            onClick={() => onNoteDetail(note)}
        >
            {/* Title row with priority badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-gray-100 leading-snug">{note.title}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border shrink-0 capitalize ${PRIORITY_STYLES[note.priority as Priority]}`}>
                    {note.priority}
                </span>
            </div>

            {/* Author and date meta */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{note.author_name}</span>
                <span className="text-gray-700">·</span>
                <span>{note.created_at}</span>
            </div>

            {/* Action row — fades in on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    onClick={() => onNoteDetail(note)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
                    style={{
                        color: theme.colors.primaryLight
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.color = "white";
                        (e.target as HTMLButtonElement).style.backgroundColor = theme.colors.alpha18;
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.color = theme.colors.primaryLight;
                        (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                </button>
                <UIIconButton
                    onClick={() => onNoteDelete(note.note_id)}
                    variant="danger"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}

export default NoteCard;
