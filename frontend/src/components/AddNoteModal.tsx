import UIButton from "./UIButton";
import UITextInput from "./UITextInput";
import Modal from "./Modal";
import useTheme from "../hooks/useTheme";

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
    newNote: { title: string; body: string; priority: Priority };
    onNoteChange: (note: { title: string; body: string; priority: Priority }) => void;
    onColumnChange: (column: ColumnId) => void;
    onSave: () => void;
}

function AddNoteModal({ show, onClose, addNoteColumn, newNote, onNoteChange, onColumnChange, onSave }: AddNoteModalProps) {
    const theme = useTheme();
    
    if (!show) return null;

    return (
        <Modal isOpen={show} onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: theme.colors.textPrimary }}>
                    New Note —{" "}
                    <span style={{ color: theme.colors.primaryLight }}>
                        {COLUMNS.find((c) => c.id === addNoteColumn)?.label}
                    </span>
                </h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Column</label>
                        <select
                            value={addNoteColumn}
                            onChange={(e) => onColumnChange(e.target.value as ColumnId)}
                            className="w-full px-4 py-2 rounded-lg border text-sm transition-all"
                            style={{
                                borderColor: theme.colors.primary,
                                backgroundColor: theme.colors.alpha08,
                                color: theme.colors.textPrimary
                            }}
                        >
                            {COLUMNS.map((col) => (
                                <option key={col.id} value={col.id}>
                                    {col.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <UITextInput
                        label="Title"
                        value={newNote.title}
                        onChange={(e) => onNoteChange({ ...newNote, title: e.target.value })}
                        placeholder="Note title"
                    />

                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Description</label>
                        <textarea
                            rows={3}
                            value={newNote.body}
                            onChange={(e) => onNoteChange({ ...newNote, body: e.target.value })}
                            placeholder="Optional description..."
                            className="w-full px-4 py-2 rounded-lg border text-sm transition-all resize-none"
                            style={{
                                borderColor: theme.colors.primary,
                                backgroundColor: theme.colors.alpha08,
                                color: theme.colors.textPrimary
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Priority</label>
                        <div className="flex gap-2">
                            {(["low", "medium", "high"] as Priority[]).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => onNoteChange({ ...newNote, priority: p })}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                                        newNote.priority === p
                                            ? PRIORITY_STYLES[p]
                                            : "text-gray-500 hover:border-opacity-40"
                                    }`}
                                    style={{
                                        borderColor: newNote.priority === p ? undefined : theme.colors.border,
                                        backgroundColor: newNote.priority === p ? undefined : theme.colors.alpha08
                                    }}
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
