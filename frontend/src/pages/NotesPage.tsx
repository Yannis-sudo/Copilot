import React, { useState } from "react";
import UIButton from "../components/UIButton";
import UIIconButton from "../components/UIIconButton";
import { useSettings } from "../context/SettingsContext";

// Priority levels with matching colors
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

interface NoteList {
    id: string;
    label: string;
}

const PRIORITY_STYLES: Record<Priority, string> = {
    low: "text-green-400 bg-[rgba(74,222,128,0.10)] border-[rgba(74,222,128,0.25)]",
    medium: "text-yellow-400 bg-[rgba(250,204,21,0.10)] border-[rgba(250,204,21,0.25)]",
    high: "text-red-400 bg-[rgba(248,113,113,0.10)] border-[rgba(248,113,113,0.25)]",
};

const COLUMNS: { id: ColumnId; label: string }[] = [
    { id: "backlog", label: "Backlog" },
    { id: "todo", label: "To Do" },
    { id: "in-progress", label: "In Progress" },
    { id: "done", label: "Done" },
];

const INITIAL_LISTS: NoteList[] = [
    { id: "list-1", label: "Personal" },
    { id: "list-2", label: "Work" },
    { id: "list-3", label: "Ideas" },
];

const INITIAL_NOTES: Note[] = [
    {
        id: "note-1",
        title: "Set up project structure",
        body: "Initialize the repository and configure the build tooling.",
        author: "Alex",
        priority: "high",
        column: "done",
        listId: "list-2",
        createdAt: "2025-03-28",
    },
    {
        id: "note-2",
        title: "Design the kanban board",
        body: "Sketch the layout for the notes page.",
        author: "Jordan",
        priority: "medium",
        column: "in-progress",
        listId: "list-2",
        createdAt: "2025-03-29",
    },
    {
        id: "note-3",
        title: "Buy groceries",
        body: "Milk, bread, coffee beans.",
        author: "Alex",
        priority: "low",
        column: "todo",
        listId: "list-1",
        createdAt: "2025-03-30",
    },
    {
        id: "note-4",
        title: "Research competitors",
        body: "Look into similar products on the market.",
        author: "Sam",
        priority: "medium",
        column: "backlog",
        listId: "list-2",
        createdAt: "2025-03-27",
    },
    {
        id: "note-5",
        title: "Write blog post about drag and drop",
        body: "Explain the HTML5 drag API with examples.",
        author: "Jordan",
        priority: "low",
        column: "backlog",
        listId: "list-3",
        createdAt: "2025-03-26",
    },
];

function NotesPage() {
    const { settings } = useSettings();
    const { darkMode } = settings;

    const [lists, setLists] = useState<NoteList[]>(INITIAL_LISTS);
    const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
    const [activeListId, setActiveListId] = useState<string>("list-2");

    // Drag state — tracks which note is being dragged and which column is hovered
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

    // Detail modal state
    const [detailNote, setDetailNote] = useState<Note | null>(null);

    // Add note modal state
    const [showAddNote, setShowAddNote] = useState(false);
    const [addNoteColumn, setAddNoteColumn] = useState<ColumnId>("todo");
    const [newNote, setNewNote] = useState({ title: "", body: "", author: "", priority: "medium" as Priority });

    // Notes filtered to the currently active list
    const visibleNotes = notes.filter((n) => n.listId === activeListId);

    const handleDragStart = (id: string) => {
        setDraggingId(id);
    };

    const handleDragOver = (e: React.DragEvent, columnId: ColumnId) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDrop = (columnId: ColumnId) => {
        if (!draggingId) return;
        setNotes((prev) =>
            prev.map((n) => (n.id === draggingId ? { ...n, column: columnId } : n))
        );
        setDraggingId(null);
        setDragOverColumn(null);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDragOverColumn(null);
    };

    const handleAddList = () => {
        const label = prompt("List name:");
        if (!label?.trim()) return;
        const newList: NoteList = { id: `list-${Date.now()}`, label: label.trim() };
        setLists((prev) => [...prev, newList]);
        setActiveListId(newList.id);
    };

    const handleOpenAddNote = (columnId: ColumnId) => {
        setAddNoteColumn(columnId);
        setNewNote({ title: "", body: "", author: "", priority: "medium" });
        setShowAddNote(true);
    };

    const handleSaveNote = () => {
        if (!newNote.title.trim()) return;
        const note: Note = {
            id: `note-${Date.now()}`,
            title: newNote.title.trim(),
            body: newNote.body.trim(),
            author: newNote.author.trim() || "You",
            priority: newNote.priority,
            column: addNoteColumn,
            listId: activeListId,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setNotes((prev) => [...prev, note]);
        setShowAddNote(false);
    };

    const handleDeleteNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (detailNote?.id === id) setDetailNote(null);
    };

    return (
        <React.Fragment>
            <div
                className="flex overflow-hidden bg-[#1a1a1a]"
                style={{ height: "calc(100vh - 64px)" }}
            >
                {/* Left sidebar — list navigator */}
                <aside
                    className="relative z-10 w-60 bg-[#1a1a1a] flex flex-col shrink-0 border-r border-[rgba(124,58,237,0)]"
                    style={{ boxShadow: "4px 0 24px rgba(124,58,237,0.10)" }}
                >
                    <div className="px-4 pt-5 pb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#a78bfa] uppercase tracking-widest">
                            Lists
                        </span>
                        <UIIconButton
                            onClick={handleAddList}
                            title="Add list"
                            variant="default"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            }
                        />
                    </div>

                    <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
                        {lists.map((list) => {
                            const isActive = list.id === activeListId;
                            const count = notes.filter((n) => n.listId === list.id).length;
                            return (
                                <button
                                    key={list.id}
                                    type="button"
                                    onClick={() => setActiveListId(list.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-[rgba(124,58,237,0.18)] text-[#a78bfa]"
                                            : "text-gray-400 hover:bg-[rgba(124,58,237,0.08)] hover:text-gray-200"
                                    }`}
                                >
                                    <span>{list.label}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-[rgba(124,58,237,0.30)] text-[#c4b5fd]" : "bg-[rgba(255,255,255,0.06)] text-gray-500"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Priority summary for the active list */}
                    <div className="px-4 pb-5 pt-3 border-t border-[rgba(124,58,237,0.12)] space-y-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">
                            Priority
                        </p>
                        {(["high", "medium", "low"] as Priority[]).map((p) => {
                            const count = visibleNotes.filter((n) => n.priority === p).length;
                            return (
                                <div key={p} className="flex items-center justify-between">
                                    <span className={`text-xs capitalize px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[p]}`}>
                                        {p}
                                    </span>
                                    <span className="text-xs text-gray-500">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Kanban columns */}
                <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-6">
                    <div className="flex gap-4 h-full" style={{ minWidth: `${COLUMNS.length * 280}px` }}>
                        {COLUMNS.map((col) => {
                            const columnNotes = visibleNotes.filter((n) => n.column === col.id);
                            const isOver = dragOverColumn === col.id;

                            return (
                                <div
                                    key={col.id}
                                    className="flex flex-col"
                                    style={{ width: 270, minWidth: 270 }}
                                    onDragOver={(e) => handleDragOver(e, col.id)}
                                    onDrop={() => handleDrop(col.id)}
                                >
                                    {/* Column header */}
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-200">
                                                {col.label}
                                            </span>
                                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[rgba(124,58,237,0.20)] text-[#c4b5fd]">
                                                {columnNotes.length}
                                            </span>
                                        </div>
                                        <UIIconButton
                                            onClick={() => handleOpenAddNote(col.id)}
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
                                                onDragStart={() => handleDragStart(note.id)}
                                                onDragEnd={handleDragEnd}
                                                onDetail={() => setDetailNote(note)}
                                                onDelete={() => handleDeleteNote(note.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* Note detail modal */}
            {detailNote && (
                <Modal onClose={() => setDetailNote(null)}>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-xl font-bold text-gray-100 leading-snug">{detailNote.title}</h2>
                            <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 capitalize ${PRIORITY_STYLES[detailNote.priority]}`}>
                                {detailNote.priority}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed">
                            {detailNote.body || "No description provided."}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500 border-t border-[rgba(124,58,237,0.15)]">
                            <span>
                                Author: <span className="text-gray-300">{detailNote.author}</span>
                            </span>
                            <span>
                                Created: <span className="text-gray-300">{detailNote.createdAt}</span>
                            </span>
                            <span>
                                Column: <span className="text-[#a78bfa]">{COLUMNS.find((c) => c.id === detailNote.column)?.label}</span>
                            </span>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <UIButton onClick={() => setDetailNote(null)}>Close</UIButton>
                            <UIButton variant="danger" onClick={() => handleDeleteNote(detailNote.id)}>
                                Delete
                            </UIButton>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Add note modal */}
            {showAddNote && (
                <Modal onClose={() => setShowAddNote(false)}>
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-100">
                            New Note —{" "}
                            <span className="text-[#a78bfa]">
                                {COLUMNS.find((c) => c.id === addNoteColumn)?.label}
                            </span>
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote((p) => ({ ...p, title: e.target.value }))}
                                    placeholder="Note title"
                                    className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-sm transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={newNote.body}
                                    onChange={(e) => setNewNote((p) => ({ ...p, body: e.target.value }))}
                                    placeholder="Optional description..."
                                    className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] resize-none text-sm transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={newNote.author}
                                    onChange={(e) => setNewNote((p) => ({ ...p, author: e.target.value }))}
                                    placeholder="Your name"
                                    className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-sm transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                                <div className="flex gap-2">
                                    {(["low", "medium", "high"] as Priority[]).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setNewNote((prev) => ({ ...prev, priority: p }))}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                                                newNote.priority === p
                                                    ? PRIORITY_STYLES[p]
                                                    : "border-[rgba(124,58,237,0.20)] text-gray-500 hover:border-[rgba(124,58,237,0.40)]"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <UIButton onClick={handleSaveNote}>Add Note</UIButton>
                            <UIButton variant="secondary" onClick={() => setShowAddNote(false)} darkMode>
                                Cancel
                            </UIButton>
                        </div>
                    </div>
                </Modal>
            )}
        </React.Fragment>
    );
}

// Reusable modal overlay — clicking the backdrop closes the modal
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.60)] backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg mx-4 p-6 rounded-2xl border border-[rgba(124,58,237,0.25)] bg-[rgba(20,20,20,0.96)] shadow-[0_0_60px_rgba(124,58,237,0.20)]"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

// Individual draggable note card
interface NoteCardProps {
    note: Note;
    isDragging: boolean;
    onDragStart: () => void;
    onDragEnd: () => void;
    onDetail: () => void;
    onDelete: () => void;
}

function NoteCard({ note, isDragging, onDragStart, onDragEnd, onDetail, onDelete }: NoteCardProps) {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`group rounded-xl border bg-[rgba(124,58,237,0.06)] border-[rgba(124,58,237,0.18)] p-4 cursor-grab active:cursor-grabbing transition-all select-none ${
                isDragging
                    ? "opacity-40 scale-95"
                    : "hover:border-[rgba(124,58,237,0.40)] hover:bg-[rgba(124,58,237,0.10)]"
            }`}
        >
            {/* Title row with priority badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-gray-100 leading-snug">{note.title}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border shrink-0 capitalize ${PRIORITY_STYLES[note.priority]}`}>
                    {note.priority}
                </span>
            </div>

            {/* Author and date meta */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{note.author}</span>
                <span className="text-gray-700">·</span>
                <span>{note.createdAt}</span>
            </div>

            {/* Action row — fades in on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    onClick={onDetail}
                    className="flex items-center gap-1 text-xs text-[#a78bfa] hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-[rgba(124,58,237,0.20)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                </button>
                <UIIconButton
                    onClick={onDelete}
                    title="Delete note"
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

export default NotesPage;