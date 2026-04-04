import UIButton from "./UIButton";
import Modal from "./Modal";

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

interface AddNoteModalProps {
    show: boolean;
    onClose: () => void;
    addNoteColumn: ColumnId;
    newNote: { title: string; body: string; author: string; authorEmail: string; priority: Priority };
    onNoteChange: (note: { title: string; body: string; author: string; authorEmail: string; priority: Priority }) => void;
    onSave: () => void;
}

function AddNoteModal({ show, onClose, addNoteColumn, newNote, onNoteChange, onSave }: AddNoteModalProps) {
    if (!show) return null;

    return (
        <Modal onClose={onClose}>
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
                            onChange={(e) => onNoteChange({ ...newNote, title: e.target.value })}
                            placeholder="Note title"
                            className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={newNote.body}
                            onChange={(e) => onNoteChange({ ...newNote, body: e.target.value })}
                            placeholder="Optional description..."
                            className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] resize-none text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                        <input
                            type="text"
                            value={newNote.author}
                            onChange={(e) => onNoteChange({ ...newNote, author: e.target.value })}
                            placeholder="Your name"
                            className="w-full px-4 py-2 rounded-lg border border-[#7c3aed] bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Author Email</label>
                        <input
                            type="email"
                            value={newNote.authorEmail}
                            onChange={(e) => onNoteChange({ ...newNote, authorEmail: e.target.value })}
                            placeholder="your.email@example.com"
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
                                    onClick={() => onNoteChange({ ...newNote, priority: p })}
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
                    <UIButton onClick={onSave}>Add Note</UIButton>
                    <UIButton variant="secondary" onClick={onClose}>
                        Cancel
                    </UIButton>
                </div>
            </div>
        </Modal>
    );
}

export default AddNoteModal;
