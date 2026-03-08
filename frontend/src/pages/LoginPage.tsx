import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { AUTH_MESSAGES } from "../constants";
import type { LoginPayload, User } from "../types";
import UITextInput from "../components/UITextInput";
import UICheckbox from "../components/UICheckbox";
import UIButton from "../components/UIButton";
import UIErrorMessage from "../components/UIErrorMessage";
import UILink from "../components/UILink";

interface LoginPageProps {
    setUser: (user: User) => void;
    darkMode?: boolean;
}

function LoginPage({ setUser, darkMode = false }: LoginPageProps): React.ReactElement {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<LoginPayload>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);

        try {
            const response = await login(credentials);

            if (response.message === AUTH_MESSAGES.SUCCESS) {
                setUser({ username: "", email: credentials.email, password: credentials.password });
                navigate("/");
            } else {
                setError(response.message || "Login was not successful");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Login was not successful"
            );
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.currentTarget;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <React.Fragment>
            <div className={`min-h-screen flex items-center justify-center overflow-hidden ${darkMode ? "bg-dark" : "bg-gray-100"}`}>

                {/* Card with semi-transparent purple background and purple glow shadow */}
                <div className="w-full max-w-md p-8 rounded-2xl border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] backdrop-blur-sm">

                    <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Login
                    </h2>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <UIErrorMessage message={error || ""} darkMode={darkMode} />

                        <UITextInput
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={credentials.email}
                            onChange={handleInputChange}
                            required
                            darkMode={darkMode}
                        />

                        <UITextInput
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            darkMode={darkMode}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <UICheckbox label="Remember me" darkMode={darkMode} />
                            <UILink href="#" external darkMode={darkMode}>
                                Forgot password?
                            </UILink>
                        </div>

                        <UIButton type="submit" className="w-full" darkMode={darkMode}>
                            Sign In
                        </UIButton>

                        <p className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Don't have an account?{" "}
                            <UILink href="/create-account" darkMode={darkMode}>Sign Up</UILink>
                        </p>
                    </form>

                </div>
            </div>
        </React.Fragment>
    );
}

export default LoginPage;