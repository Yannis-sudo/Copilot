import UIButton from "./UIButton";
import Modal from "./Modal";
import type { ListInfo } from "../types/api";

interface ListDetailModalProps {
    show: boolean;
    onClose: () => void;
    list: ListInfo | null;
}

function ListDetailModal({ show, onClose, list }: ListDetailModalProps) {
    if (!show || !list) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <Modal onClose={onClose}>
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-100 leading-snug">{list.list_name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.20)] text-[#c4b5fd]">
                        List Details
                    </span>
                </div>

                <div className="space-y-3">
                    <div>
                        <h3 className="text-sm font-semibold text-[#a78bfa] mb-1">Description</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {list.description || "No description provided."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500 border-t border-[rgba(124,58,237,0.15)]">
                        <div>
                            <span className="text-gray-400">List ID: </span>
                            <span className="text-gray-300 font-mono text-xs">{list.list_id}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Created By: </span>
                            <span className="text-gray-300">{list.created_by}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500">
                        <div>
                            <span className="text-gray-400">Created: </span>
                            <span className="text-gray-300">{formatDate(list.created_at)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Updated: </span>
                            <span className="text-gray-300">{formatDate(list.updated_at)}</span>
                        </div>
                    </div>

                    {list.admins && list.admins.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-[#a78bfa] mb-2">Administrators</h3>
                            <div className="space-y-1">
                                {list.admins.map((admin, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{admin}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-1">
                    <UIButton onClick={onClose}>Close</UIButton>
                </div>
            </div>
        </Modal>
    );
}

export default ListDetailModal;
