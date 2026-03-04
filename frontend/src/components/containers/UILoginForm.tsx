import React from "react";
import { Link } from "react-router-dom";
function UILoginForm(props: any) {
    return (
        <React.Fragment>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md outline outline-2 outline-blue-200">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Login
                    </h2>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                                />
                                <span className="text-gray-600">Remember me</span>
                            </label>

                            <a href="#" className="text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/create-account"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
}

export default UILoginForm;