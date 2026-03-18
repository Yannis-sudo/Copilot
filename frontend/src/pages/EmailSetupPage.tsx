import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import UITextInput from "../components/UITextInput";
import UIButton from "../components/UIButton";
import UIErrorMessage from "../components/UIErrorMessage";

// Shape of the form data
interface EmailSetupForm {
    email: string;
    emailPassword: string;
    imapServer: string;
    imapPort: string;
    smtpServer: string;
    smtpPort: string;
}

function EmailSetupPage() {
    const navigate = useNavigate();
    const { settings } = useSettings();

    // Pre-fill the email address from the logged-in user — still editable
    const [form, setForm] = useState<EmailSetupForm>({
        email: settings.user.email || "",
        emailPassword: "",
        imapServer: "",
        imapPort: "993",
        smtpServer: "",
        smtpPort: "587",
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);

        // Basic validation before sending to the backend
        if (!form.email || !form.emailPassword || !form.imapServer || !form.smtpServer) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            // TODO: replace with a real API call that saves the mail account in the database
            // Example: await saveEmailAccount({ ...form });
            console.log("Saving email account config:", form);

            // On success, return to the email page which will re-fetch
            navigate("/email");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save email account.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            {/* Full-page centered layout matching the dark theme */}
            <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
                <div className="w-full max-w-lg px-4">

                    {/* Card with the purple-glow style used throughout the email pages */}
                    <div className="rounded-2xl p-8 border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_64px_rgba(124,58,237,0.15)] backdrop-blur-sm">

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-100">Connect Your Email</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Enter your mail server details. These are saved securely and used to fetch your emails.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <UIErrorMessage message={error || ""} />

                            {/* Email address — pre-filled from the logged-in user but editable */}
                            <UITextInput
                                type="email"
                                name="email"
                                label="Email Address"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                            />

                            {/* This is the mail account password, not the app login password */}
                            <div>
                                <UITextInput
                                    type="password"
                                    name="emailPassword"
                                    label="Email Account Password"
                                    placeholder="••••••••"
                                    value={form.emailPassword}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    This is your email provider password, not your app login password.
                                </p>
                            </div>

                            {/* Incoming mail section */}
                            <div className="border-t border-[rgba(124,58,237,0.15)] pt-5">
                                <p className="text-xs font-semibold text-[#a78bfa] uppercase tracking-widest mb-4">
                                    Incoming Mail (IMAP)
                                </p>

                                {/* IMAP server and port side by side */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <UITextInput
                                            type="text"
                                            name="imapServer"
                                            label="IMAP Server"
                                            placeholder="imap.example.com"
                                            value={form.imapServer}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-28">
                                        <UITextInput
                                            type="text"
                                            name="imapPort"
                                            label="Port"
                                            placeholder="993"
                                            value={form.imapPort}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Outgoing mail section */}
                            <div>
                                <p className="text-xs font-semibold text-[#a78bfa] uppercase tracking-widest mb-4">
                                    Outgoing Mail (SMTP)
                                </p>

                                {/* SMTP server and port side by side */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <UITextInput
                                            type="text"
                                            name="smtpServer"
                                            label="SMTP Server"
                                            placeholder="smtp.example.com"
                                            value={form.smtpServer}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-28">
                                        <UITextInput
                                            type="text"
                                            name="smtpPort"
                                            label="Port"
                                            placeholder="587"
                                            value={form.smtpPort}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <UIButton
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? "Saving..." : "Save & Connect"}
                                </UIButton>
                                <UIButton
                                    type="button"
                                    onClick={() => navigate("/email")}
                                    variant="secondary"
                                >
                                    Cancel
                                </UIButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default EmailSetupPage;