import React, { useState, useEffect } from "react";
import UIButton from "../components/UIButton";
import Modal from "../components/Modal";
import NoteCard from "../components/NoteCard";
import NotesSidebar from "../components/NotesSidebar";
import KanbanColumn from "../components/KanbanColumn";
import AddNoteModal from "../components/AddNoteModal";
import AddListModal from "../components/AddListModal";
import ListDetailModal from "../components/ListDetailModal";
import { useSettings } from "../context/SettingsContext";
import { addNote, addList } from "../api";
import type { ListInfo } from "../types/api";

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

function NotesPage() {
    const { settings, loadLists, refreshLists } = useSettings();

    const [notes, setNotes] = useState<Note[]>([]);
    const [activeListId, setActiveListId] = useState<string>("");

    // Drag state — tracks which note is being dragged and which column is hovered
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

    // Detail modal state
    const [detailNote, setDetailNote] = useState<Note | null>(null);

    // Add note modal state
    const [showAddNote, setShowAddNote] = useState(false);
    const [addNoteColumn, setAddNoteColumn] = useState<ColumnId>("todo");
    const [newNote, setNewNote] = useState({ title: "", body: "", author: "", authorEmail: "", priority: "medium" as Priority });

    // Add list modal state
    const [showAddList, setShowAddList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newListDescription, setNewListDescription] = useState("");

    // List detail modal state
    const [detailList, setDetailList] = useState<ListInfo | null>(null);

    // Load lists on component mount
    useEffect(() => {
        if (settings.user.email && settings.user.password) {
            loadLists();
        }
    }, [settings.user.email, settings.user.password, loadLists]);

    // Set active list when lists are loaded
    useEffect(() => {
        if (settings.lists.length > 0 && !activeListId) {
            setActiveListId(settings.lists[0].list_id);
        }
    }, [settings.lists, activeListId]);

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
        setNewListName("");
        setNewListDescription("");
        setShowAddList(true);
    };

    const handleSaveList = async () => {
        if (!newListName.trim()) return;
        
        try {
            // Get user credentials from settings context
            const email = settings.user.email;
            const password = settings.user.password;
            
            const payload = {
                email,
                password,
                list_name: newListName.trim(),
                creator_email: email,
                description: newListDescription.trim()
            };
            
            const response = await addList(payload);
            
            // Refresh lists after successful creation
            await refreshLists();
            setShowAddList(false);
        } catch (error) {
            console.error('Failed to add list:', error);
            // You could show an error message to user here
        }
    };

    const handleOpenListDetail = (list: ListInfo) => {
        setDetailList(list);
    };

    const handleCloseListModal = () => {
        setShowAddList(false);
        setNewListName("");
        setNewListDescription("");
    };

    const handleOpenAddNote = (columnId: ColumnId) => {
        setAddNoteColumn(columnId);
        setNewNote({ title: "", body: "", author: "", authorEmail: "", priority: "medium" });
        setShowAddNote(true);
    };

    const handleSaveNote = async () => {
        if (!newNote.title.trim()) return;
        
        try {
            // Get user credentials from settings context
            const email = settings.user.email;
            const password = settings.user.password;
            
            const payload = {
                email,
                password,
                title: newNote.title.trim(),
                description: newNote.body.trim(),
                priority: newNote.priority,
                author_name: newNote.author.trim() || "You",
                author_email: newNote.authorEmail.trim() || "user@example.com",
                list_id: activeListId // Use list_id instead of list array
            };
            
            await addNote(payload);
            
            // Add note to local state for immediate UI update
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
        } catch (error) {
            console.error('Failed to add note:', error);
            // You could show an error message to user here
        }
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
                <NotesSidebar
                    lists={settings.lists}
                    notes={notes}
                    activeListId={activeListId}
                    visibleNotes={visibleNotes}
                    onAddList={handleAddList}
                    onSelectList={setActiveListId}
                    onListDetail={handleOpenListDetail}
                    listsLoading={settings.listsLoading}
                    listsError={settings.listsError}
                    onRefreshLists={refreshLists}
                />

                {/* Kanban columns */}
                <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-6">
                    <div className="flex gap-4 h-full" style={{ minWidth: `${COLUMNS.length * 280}px` }}>
                        {COLUMNS.map((col) => {
                            const columnNotes = visibleNotes.filter((n) => n.column === col.id);
                            const isOver = dragOverColumn === col.id;

                            return (
                                <KanbanColumn
                                    key={col.id}
                                    column={col}
                                    columnNotes={columnNotes}
                                    isOver={isOver}
                                    draggingId={draggingId}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onOpenAddNote={handleOpenAddNote}
                                    onNoteDragStart={handleDragStart}
                                    onNoteDragEnd={handleDragEnd}
                                    onNoteDetail={setDetailNote}
                                    onNoteDelete={handleDeleteNote}
                                />
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
            <AddNoteModal
                show={showAddNote}
                onClose={() => setShowAddNote(false)}
                addNoteColumn={addNoteColumn}
                newNote={newNote}
                onNoteChange={setNewNote}
                onSave={handleSaveNote}
            />

            {/* Add list modal */}
            <AddListModal
                show={showAddList}
                onClose={handleCloseListModal}
                newListName={newListName}
                newListDescription={newListDescription}
                onListNameChange={setNewListName}
                onDescriptionChange={setNewListDescription}
                onSave={handleSaveList}
            />

            {/* List detail modal */}
            {detailList && (
                <ListDetailModal
                    show={!!detailList}
                    onClose={() => setDetailList(null)}
                    list={detailList}
                />
            )}
        </React.Fragment>
    );
}


export default NotesPage;