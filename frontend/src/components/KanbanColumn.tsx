import UIIconButton from "./UIIconButton";
import NoteCard from "./NoteCard";

type Priority = "low" | "medium" | "high";
type ColumnId = "backlog" | "todo" | "in-progress" | "done";

interface Note {
    id: string;
    title: string;
    body: string;
    author: string;
    priority: Priority;
    column: ColumnId;
    listId: string;
    createdAt: string;
}

interface KanbanColumnProps {
    column: { id: ColumnId; label: string };
    columnNotes: Note[];
    isOver: boolean;
    draggingId: string | null;
    onDragOver: (e: React.DragEvent, columnId: ColumnId) => void;
    onDrop: (columnId: ColumnId) => void;
    onOpenAddNote: (columnId: ColumnId) => void;
    onNoteDragStart: (noteId: string) => void;
    onNoteDragEnd: () => void;
    onNoteDetail: (note: Note) => void;
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
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-[rgba(124,58,237,0.20)] text-[#c4b5fd]">
                        {columnNotes.length}
                    </span>
                </div>
                <UIIconButton
                    onClick={() => onOpenAddNote(column.id)}
                    title="Add note"
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
                className={`flex-1 overflow-y-auto rounded-xl p-2 space-y-3 transition-colors ${
                    isOver
                        ? "bg-[rgba(124,58,237,0.12)] border border-dashed border-[#7c3aed]"
                        : "bg-[rgba(255,255,255,0.03)] border border-[rgba(124,58,237,0.10)]"
                }`}
            >
                {columnNotes.length === 0 && (
                    <p className="text-xs text-gray-600 text-center pt-6">
                        Drop notes here
                    </p>
                )}

                {columnNotes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        isDragging={draggingId === note.id}
                        onDragStart={() => onNoteDragStart(note.id)}
                        onDragEnd={onNoteDragEnd}
                        onDetail={() => onNoteDetail(note)}
                        onDelete={() => onNoteDelete(note.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default KanbanColumn;
