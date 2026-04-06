import React, { useState, useRef } from "react";
import UIButton from "../UIButton";
import useTheme from "../../hooks/useTheme";
import UIIconButton from "../UIIconButton";
import UITextInput from "../UITextInput";

interface UIEmailComposeProps {
    to: string;
    subject: string;
    body: string;
    onToChange: (value: string) => void;
    onSubjectChange: (value: string) => void;
    onBodyChange: (value: string) => void;
    onSend: (files?: File[]) => void;
    onDiscard: () => void;
    darkMode?: boolean;
}

export default function UIEmailCompose(props: UIEmailComposeProps) {
    const theme = useTheme();
    const borderColor = `border-[${theme.colors.border}]`;
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setAttachedFiles(prev => [...prev, ...newFiles]);
        }
        // Reset input value to allow selecting the same file again
        event.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveDraft = () => {};

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a]">

            {/* Header — compose metadata */}
            <div className={`px-6 py-5 border-b ${borderColor} shrink-0`}>

                <h2 className="text-lg font-semibold text-gray-100 mb-3 leading-snug">
                    New Email
                </h2>

                {/* Recipients row */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar placeholder */}
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                            <UITextInput
                                type="email"
                                label="To"
                                placeholder="recipient@example.com"
                                value={props.to}
                                onChange={(e) => props.onToChange(e.target.value)}
                                darkMode={props.darkMode}
                                className="text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                            <UITextInput
                                type="text"
                                label="Subject"
                                placeholder="Subject"
                                value={props.subject}
                                onChange={(e) => props.onSubjectChange(e.target.value)}
                                darkMode={props.darkMode}
                                className="text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Body — scrollable compose content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="text-gray-300">
                    <textarea
                        rows={12}
                        placeholder="Write your message here..."
                        value={props.body}
                        onChange={(e) => props.onBodyChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border bg-[rgba(255,255,255,0.02)] text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all text-sm leading-relaxed"
                        style={{
                            borderColor: "rgba(255,255,255,0.1)",
                            outlineColor: theme.colors.primary
                        }}
                    />
                </div>
                
                {/* Attached files display */}
                {attachedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-400">Attached Files:</h4>
                        {attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-[rgba(255,255,255,0.05)] rounded-lg px-3 py-2">
                                <span className="text-sm text-gray-300 truncate flex-1">
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                                    title="Remove file"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer — primary actions on the left, icon actions on the right */}
            <div className={`px-6 py-4 border-t ${borderColor} shrink-0 flex items-center justify-between`}>

                {/* Primary actions */}
                <div className="flex items-center gap-2">
                    <UIButton onClick={() => props.onSend(attachedFiles)} darkMode={props.darkMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send
                    </UIButton>
                    <UIButton onClick={props.onDiscard} variant="secondary" darkMode={props.darkMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Discard
                    </UIButton>
                </div>

                {/* Secondary actions — icon-only */}
                <div className="flex items-center gap-1">
                    <UIIconButton
                        onClick={handleAttachFile}
                        darkMode={props.darkMode}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        }
                    />
                    <UIIconButton
                        onClick={handleSaveDraft}
                        darkMode={props.darkMode}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
                            </svg>
                        }
                    />
                </div>

            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
            />

        </div>
    );
}
