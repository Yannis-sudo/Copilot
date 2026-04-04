import UIButton from "./UIButton";
import Modal from "./Modal";

interface AddListModalProps {
    show: boolean;
    onClose: () => void;
    newListName: string;
    newListDescription: string;
    onListNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onSave: () => void;
}

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

function AddListModal({ 
    show, 
    onClose, 
    newListName, 
    newListDescription, 
    onListNameChange, 
    onDescriptionChange, 
    onSave 
}: AddListModalProps) {
    if (!show) return null;

    const isNameValid = newListName.trim().length > 0 && newListName.trim().length <= MAX_NAME_LENGTH;
    const isDescriptionValid = newListDescription.trim().length <= MAX_DESCRIPTION_LENGTH;
    const isFormValid = isNameValid && isDescriptionValid;

    return (
        <Modal onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-100">
                    Create New List
                </h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            List Name
                            <span className="text-gray-500 ml-1">
                                ({newListName.length}/{MAX_NAME_LENGTH})
                            </span>
                        </label>
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => onListNameChange(e.target.value.slice(0, MAX_NAME_LENGTH))}
                            placeholder="Enter list name..."
                            className={`w-full px-4 py-2 rounded-lg border bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 text-sm transition-all ${
                                newListName.trim().length > MAX_NAME_LENGTH
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-[#7c3aed] focus:ring-[#7c3aed]"
                            }`}
                            maxLength={MAX_NAME_LENGTH}
                        />
                        {newListName.trim().length > MAX_NAME_LENGTH && (
                            <p className="text-xs text-red-400 mt-1">
                                List name must be {MAX_NAME_LENGTH} characters or less
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                            <span className="text-gray-500 ml-1">
                                ({newListDescription.length}/{MAX_DESCRIPTION_LENGTH})
                            </span>
                        </label>
                        <textarea
                            rows={3}
                            value={newListDescription}
                            onChange={(e) => onDescriptionChange(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
                            placeholder="Optional description..."
                            className={`w-full px-4 py-2 rounded-lg border bg-transparent text-gray-100 placeholder:text-[rgba(124,58,237,0.45)] focus:outline-none focus:ring-2 resize-none text-sm transition-all ${
                                newListDescription.trim().length > MAX_DESCRIPTION_LENGTH
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-[#7c3aed] focus:ring-[#7c3aed]"
                            }`}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                        />
                        {newListDescription.trim().length > MAX_DESCRIPTION_LENGTH && (
                            <p className="text-xs text-red-400 mt-1">
                                Description must be {MAX_DESCRIPTION_LENGTH} characters or less
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-1">
                    <UIButton 
                        onClick={onSave}
                        disabled={!isFormValid}
                        className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Create List
                    </UIButton>
                    <UIButton variant="secondary" onClick={onClose}>
                        Cancel
                    </UIButton>
                </div>
            </div>
        </Modal>
    );
}

export default AddListModal;
