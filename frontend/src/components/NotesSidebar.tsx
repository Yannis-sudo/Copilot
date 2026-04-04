import UIIconButton from "./UIIconButton";
import type { ListInfo } from "../types/api";

type Priority = "low" | "medium" | "high";

const PRIORITY_STYLES: Record<Priority, string> = {
    low: "text-green-400 bg-[rgba(74,222,128,0.10)] border-[rgba(74,222,128,0.25)]",
    medium: "text-yellow-400 bg-[rgba(250,204,21,0.10)] border-[rgba(250,204,21,0.25)]",
    high: "text-red-400 bg-[rgba(248,113,113,0.10)] border-[rgba(248,113,113,0.25)]",
};

interface Note {
    id: string;
    title: string;
    body: string;
    author: string;
    priority: Priority;
    column: string;
    listId: string;
    createdAt: string;
}

interface NoteList {
    id: string;
    label: string;
}

interface NotesSidebarProps {
    lists: ListInfo[];
    notes: Note[];
    activeListId: string;
    visibleNotes: Note[];
    onAddList: () => void;
    onSelectList: (listId: string) => void;
    onListDetail: (list: ListInfo) => void;
    listsLoading: boolean;
    listsError: string | null;
    onRefreshLists: () => void;
}

function NotesSidebar({ lists, notes, activeListId, visibleNotes, onAddList, onSelectList, onListDetail, listsLoading, listsError, onRefreshLists }: NotesSidebarProps) {
    return (
        <aside
            className="relative z-10 w-60 bg-[#1a1a1a] flex flex-col shrink-0 border-r border-[rgba(124,58,237,0)]"
            style={{ boxShadow: "4px 0 24px rgba(124,58,237,0.10)" }}
        >
            <div className="px-4 pt-5 pb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#a78bfa] uppercase tracking-widest">
                    Lists
                </span>
                <div className="flex items-center gap-2">
                    <UIIconButton
                        onClick={onRefreshLists}
                        title="Refresh lists"
                        variant="default"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={onAddList}
                        title="Add list"
                        variant="default"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
                {listsLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-xs text-gray-500">Loading lists...</p>
                    </div>
                ) : listsError ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-xs text-red-400 mb-2">{listsError}</p>
                        <button
                            onClick={onRefreshLists}
                            className="text-xs text-[#a78bfa] hover:text-white transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                ) : lists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-xs text-gray-500 mb-2">No lists found</p>
                        <button
                            onClick={onAddList}
                            className="text-xs text-[#a78bfa] hover:text-white transition-colors"
                        >
                            Create your first list
                        </button>
                    </div>
                ) : (
                    lists.map((list) => {
                        const isActive = list.list_id === activeListId;
                        const count = notes.filter((n) => n.listId === list.list_id).length;
                        return (
                            <div
                                key={list.list_id}
                                className={`group relative rounded-lg transition-all ${
                                    isActive
                                        ? "bg-[rgba(124,58,237,0.18)]"
                                        : "hover:bg-[rgba(124,58,237,0.12)]"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onSelectList(list.list_id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-[#a78bfa]"
                                            : "text-gray-400 group-hover:text-gray-200"
                                    }`}
                                >
                                    <span>{list.list_name}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full transition-colors ${
                                        isActive ? "bg-[rgba(124,58,237,0.30)] text-[#c4b5fd]" : "bg-[rgba(255,255,255,0.06)] text-gray-500 group-hover:bg-[rgba(255,255,255,0.10)] group-hover:text-gray-300"
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onListDetail(list)}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-1 top-1.5 text-xs text-[#a78bfa] hover:text-white transition-colors px-1.5 py-1 rounded-md hover:bg-[rgba(124,58,237,0.30)] shadow-sm"
                                    title="View details"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })
                )}
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
    );
}

export default NotesSidebar;
