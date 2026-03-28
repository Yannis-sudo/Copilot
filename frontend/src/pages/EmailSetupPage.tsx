import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { addEmailServer } from "../api";
import UITextInput from "../components/UITextInput";
import UIButton from "../components/UIButton";
import UIErrorMessage from "../components/UIErrorMessage";

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
    const { darkMode } = settings;

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

        if (!form.email || !form.emailPassword || !form.imapServer || !form.smtpServer) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            console.log("Sending email server config:", {
                email: form.email,
                password: form.emailPassword,
                server_incoming: form.imapServer,
                server_outgoing: form.smtpServer,
                server_incoming_port: parseInt(form.imapPort),
                server_outgoing_port: parseInt(form.smtpPort),
            });
            
            await addEmailServer({
                email: form.email,
                password: form.emailPassword,
                server_incoming: form.imapServer,
                server_outgoing: form.smtpServer,
                server_incoming_port: parseInt(form.imapPort),
                server_outgoing_port: parseInt(form.smtpPort),
            });
            
            console.log("API call successful, navigating to /email");
            navigate("/email");
        } catch (err) {
            console.error("API call failed:", err);
            setError(err instanceof Error ? err.message : "Failed to save email account.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            <div className={`min-h-screen flex items-center justify-center overflow-hidden ${darkMode ? "bg-dark" : "bg-gray-100"}`}>

                {/* Card matches LoginPage purple glassmorphism style */}
                <div className="w-full max-w-lg p-6 rounded-2xl border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] backdrop-blur-sm">

                    <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Connect Your Email
                    </h2>

                    <div className="space-y-3">
                        <UIErrorMessage message={error || ""} darkMode={darkMode} />

                        {/* Email address — pre-filled from the logged-in user but editable */}
                        <UITextInput
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            darkMode={darkMode}
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
                                darkMode={darkMode}
                            />
                            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-600" : "text-gray-500"}`}>
                                This is your email provider password, not your app login password.
                            </p>
                        </div>

                        {/* Incoming mail (IMAP) */}
                        <div className="border-t border-[rgba(124,58,237,0.15)] pt-3">
                            <p className="text-xs font-semibold text-[#a78bfa] uppercase tracking-widest mb-3">
                                Incoming Mail (IMAP)
                            </p>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <UITextInput
                                        type="text"
                                        name="imapServer"
                                        label="IMAP Server"
                                        placeholder="imap.example.com"
                                        value={form.imapServer}
                                        onChange={handleChange}
                                        darkMode={darkMode}
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
                                        darkMode={darkMode}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Outgoing mail (SMTP) */}
                        <div>
                            <p className="text-xs font-semibold text-[#a78bfa] uppercase tracking-widest mb-3">
                                Outgoing Mail (SMTP)
                            </p>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <UITextInput
                                        type="text"
                                        name="smtpServer"
                                        label="SMTP Server"
                                        placeholder="smtp.example.com"
                                        value={form.smtpServer}
                                        onChange={handleChange}
                                        darkMode={darkMode}
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
                                        darkMode={darkMode}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <UIButton
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1"
                                darkMode={darkMode}
                            >
                                {isLoading ? "Saving..." : "Save & Connect"}
                            </UIButton>
                            <UIButton
                                type="button"
                                onClick={() => navigate("/email")}
                                variant="secondary"
                                darkMode={darkMode}
                            >
                                Cancel
                            </UIButton>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default EmailSetupPage;