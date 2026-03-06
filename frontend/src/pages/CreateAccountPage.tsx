import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createaccountrequest } from "../api";

export default function CreateAccountPage(props: any) {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState({
        email: "",
        password: "",
        username: "",
        passwordConfirm: "",
    });

    const handleCreateAccount = async () => {
        if (loginType.password !== loginType.passwordConfirm) {
            alert("Passwords do not match!");
            return;
        }
        let message = await createaccountrequest(loginType.username, loginType.email, loginType.password);
        if (message.message == "email already exists") {
            alert("Email already exists!");
        } else {
            alert("Account created successfully!");
            navigate("/login");
        }
    }

    return (
        <React.Fragment>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md outline outline-2 outline-blue-200">

                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Create Account
                    </h2>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={loginType.username}
                                onChange={(e: any) =>
                                    setLoginType({
                                        ...loginType,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={loginType.email}
                                onChange={(e: any) =>
                                    setLoginType({
                                        ...loginType,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={loginType.password}
                                onChange={(e: any) =>
                                    setLoginType({
                                        ...loginType,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={loginType.passwordConfirm}
                                onChange={(e: any) =>
                                    setLoginType({
                                        ...loginType,
                                        passwordConfirm: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-4 pt-2">
                            <button
                                type="button"
                                onClick={handleCreateAccount}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Create Account
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>

                </div>
            </div>
        </React.Fragment>
    );
}