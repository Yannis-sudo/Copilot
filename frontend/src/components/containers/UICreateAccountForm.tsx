import React from "react";
import { Link } from "react-router-dom";

function UICreateAccountForm(props: any) {
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
                                onChange={(e: any) =>
                                    props.setLoginType({
                                        ...props.loginType,
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
                                onChange={(e: any) =>
                                    props.setLoginType({
                                        ...props.loginType,
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
                                onChange={(e: any) =>
                                    props.setLoginType({
                                        ...props.loginType,
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
                                onChange={(e: any) =>
                                    props.setLoginType({
                                        ...props.loginType,
                                        passwordConfirm: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-4 pt-2">
                            <button
                                type="button"
                                onClick={props.handleLogin}
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

export default UICreateAccountForm;