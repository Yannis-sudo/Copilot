import UIIconButton from "./UIIconButton";
import NoteCard from "./NoteCard";
import type { NoteInfo } from "../types/api";
import useTheme from "../hooks/useTheme";

type ColumnId = "backlog" | "todo" | "in-progress" | "done";

interface KanbanColumnProps {
    column: { id: ColumnId; label: string };
    columnNotes: NoteInfo[];
    isOver: boolean;
    draggingId: string | null;
    onDragOver: (e: React.DragEvent, columnId: ColumnId) => void;
    onDrop: (columnId: ColumnId) => void;
    onOpenAddNote: (columnId: ColumnId) => void;
    onNoteDragStart: (noteId: string) => void;
    onNoteDragEnd: () => void;
    onNoteDetail: (note: NoteInfo) => void;
    onNoteDelete: (noteId: string) => void;
}

function KanbanColumn({ 
    column, 
    columnNotes, 
    isOver, 
    draggingId, 
    onDragOver, 
    onDrop, 
    onOpenAddNote, 
    onNoteDragStart, 
    onNoteDragEnd, 
    onNoteDetail, 
    onNoteDelete 
}: KanbanColumnProps) {
    const theme = useTheme();
    return (
        <div
            key={column.id}
            className="flex flex-col"
            style={{ width: 270, minWidth: 270 }}
            onDragOver={(e) => onDragOver(e, column.id)}
            onDrop={() => onDrop(column.id)}
        >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-200">
                        {column.label}
                    </span>
                    <span 
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                            backgroundColor: theme.colors.alpha18,
                            color: theme.colors.primaryLight
                        }}
                    >
                        {columnNotes.length}
                    </span>
                </div>
                <UIIconButton
                    onClick={() => onOpenAddNote(column.id)}
                    variant="default"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    }
                />
            </div>

            {/* Drop zone */}
            <div
                className="flex-1 overflow-y-auto rounded-xl p-2 space-y-3 transition-colors border"
                style={{
                    backgroundColor: isOver ? theme.colors.alpha12 : "rgba(255,255,255,0.03)",
                    borderColor: isOver ? theme.colors.primary : theme.colors.border,
                    borderStyle: isOver ? "dashed" : "solid"
                }}
            >
                {columnNotes.length === 0 && (
                    <p className="text-xs text-gray-600 text-center pt-6">
                        Drop notes here
                    </p>
                )}

                {columnNotes.map((note) => (
                    <NoteCard
                        key={note.note_id}
                        note={note}
                        isDragging={draggingId === note.note_id}
                        onNoteDragStart={() => onNoteDragStart(note.note_id)}
                        onNoteDragEnd={onNoteDragEnd}
                        onNoteDetail={() => onNoteDetail(note)}
                        onNoteDelete={() => onNoteDelete(note.note_id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default KanbanColumn;
