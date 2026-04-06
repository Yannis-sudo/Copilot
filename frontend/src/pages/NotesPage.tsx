import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import UIButton from "../components/UIButton";
import KanbanColumn from "../components/KanbanColumn";
import AddNoteModal from "../components/AddNoteModal";
import AddListModal from "../components/AddListModal";
import NotesSidebar from "../components/NotesSidebar";
import ConfirmDialog from "../components/ConfirmDialog";
import ListDetailModal from "../components/ListDetailModal";
import { useSettings } from "../context/SettingsContext";
import { addNote, addList, deleteList, updateNoteColumn } from "../api";
import type { NoteInfo, ListInfo } from "../types/api";

// Priority levels with matching colors
type Priority = "low" | "medium" | "high";
type ColumnId = "backlog" | "todo" | "in-progress" | "done";

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
    const { settings, loadLists, refreshLists, refreshNotes, addNoteToState } = useSettings();

    const [activeListId, setActiveListId] = useState<string>("");

    // Drag state — tracks which note is being dragged and which column is hovered
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

    // Detail modal state
    const [detailNote, setDetailNote] = useState<NoteInfo | null>(null);

    // Add note modal state
    const [showAddNote, setShowAddNote] = useState(false);
    const [addNoteColumn, setAddNoteColumn] = useState<ColumnId>("todo");
    const [newNote, setNewNote] = useState({ title: "", body: "", priority: "medium" as Priority });

    // Add list modal state
    const [showAddList, setShowAddList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newListDescription, setNewListDescription] = useState("");

    // Delete confirmation dialog state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [listToDelete, setListToDelete] = useState<{ id: string; name: string } | null>(null);

    // List detail modal state
    const [showListDetail, setShowListDetail] = useState(false);
    const [listDetail, setListDetail] = useState<ListInfo | null>(null);

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
    const visibleNotes = settings.notes.filter((n) => n.list_id === activeListId);

    const handleDragStart = (id: string) => {
        setDraggingId(id);
    };

    const handleDragOver = (e: React.DragEvent, columnId: ColumnId) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDrop = async (columnId: ColumnId) => {
        if (!draggingId) return;
        
        try {
            // Get user credentials from settings context
            const email = settings.user.email;
            const password = settings.user.password;
            
            const payload = {
                email,
                password,
                note_id: draggingId,
                new_column: columnId
            };
            
            await updateNoteColumn(payload);
            
            // Refresh notes after successful column update
            await refreshNotes();
            
        } catch (error) {
            console.error('Failed to update note column:', error);
            // You could show an error message to user here
        } finally {
            setDraggingId(null);
            setDragOverColumn(null);
        }
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
            
            await addList(payload);
            
            // Refresh lists after successful creation
            await refreshLists();
            setShowAddList(false);
        } catch (error) {
            console.error('Failed to add list:', error);
            // You could show an error message to user here
        }
    };

    const handleCloseListModal = () => {
        setShowAddList(false);
        setNewListName("");
        setNewListDescription("");
    };

    const handleDeleteList = (listId: string, listName: string) => {
        setListToDelete({ id: listId, name: listName });
        setShowDeleteConfirm(true);
    };

    const confirmDeleteList = async () => {
        if (!listToDelete) return;

        try {
            // Get user credentials from settings context
            const email = settings.user.email;
            const password = settings.user.password;
            
            const payload = {
                email,
                password,
                list_id: listToDelete.id
            };
            
            await deleteList(payload);
            
            // Refresh lists after successful deletion
            await refreshLists();
            
            // Clear active list if it was the deleted one
            if (activeListId === listToDelete.id) {
                setActiveListId("");
            }
            
            setShowDeleteConfirm(false);
            setListToDelete(null);
        } catch (error) {
            console.error('Failed to delete list:', error);
            // You could show an error message to user here
        }
    };

    const cancelDeleteList = () => {
        setShowDeleteConfirm(false);
        setListToDelete(null);
    };

    const handleListDetail = (list: ListInfo) => {
        setListDetail(list);
        setShowListDetail(true);
    };

    const handleOpenAddNote = (columnId: ColumnId) => {
        setAddNoteColumn(columnId);
        setNewNote({ title: "", body: "", priority: "medium" as Priority });
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
                author_name: settings.user.username,
                author_email: settings.user.email,
                list_id: activeListId,
                column: addNoteColumn // Add column field
            };
            
            await addNote(payload);
            
            // Add note to global state for immediate UI update
            const note: NoteInfo = {
                note_id: `note-${Date.now()}`,
                title: newNote.title.trim(),
                description: newNote.body.trim(),
                priority: newNote.priority,
                author_name: settings.user.username,
                author_email: settings.user.email,
                list_id: activeListId,
                column: addNoteColumn,
                created_at: new Date().toISOString().split("T")[0],
            };
            addNoteToState(note);
            setShowAddNote(false);
        } catch (error) {
            console.error('Failed to add note:', error);
            // You could show an error message to user here
        }
    };

    const handleDeleteNote = (id: string) => {
        // This would require a backend API call to delete the note
        // For now, just filter it out from the display
        if (detailNote?.note_id === id) setDetailNote(null);
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
                    notes={settings.notes}
                    activeListId={activeListId}
                    visibleNotes={visibleNotes}
                    onAddList={handleAddList}
                    onSelectList={setActiveListId}
                    onListDetail={handleListDetail}
                    onDeleteList={handleDeleteList}
                    listsLoading={settings.listsLoading}
                    listsError={settings.listsError}
                    onRefreshLists={() => {
                        refreshLists();
                        refreshNotes();
                    }}
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
                            <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 capitalize ${PRIORITY_STYLES[detailNote.priority as Priority]}`}>
                                {detailNote.priority}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed">
                            {detailNote.description || "No description provided."}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500 border-t border-[rgba(124,58,237,0.15)]">
                            <span>
                                Author: <span className="text-gray-300">{detailNote.author_name}</span>
                            </span>
                            <span>
                                Created: <span className="text-gray-300">{detailNote.created_at}</span>
                            </span>
                            <span>
                                Column: <span className="text-[#a78bfa]">{COLUMNS.find((c) => c.id === detailNote.column)?.label}</span>
                            </span>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <UIButton onClick={() => setDetailNote(null)}>Close</UIButton>
                            <UIButton variant="danger" onClick={() => handleDeleteNote(detailNote.note_id)}>
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
                onColumnChange={setAddNoteColumn}
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

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete List"
                message={`Are you sure you want to delete "${listToDelete?.name}"? This action cannot be undone and will remove all notes in this list.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteList}
                onCancel={cancelDeleteList}
                isDangerous={true}
            />

            {/* List detail modal */}
            <ListDetailModal
                show={showListDetail}
                onClose={() => setShowListDetail(false)}
                list={listDetail}
            />

            </React.Fragment>
    );
}


export default NotesPage;