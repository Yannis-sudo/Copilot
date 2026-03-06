import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { AUTH_MESSAGES } from "../constants";
import type { LoginPayload } from "../types";

interface LoginPageProps {
  setUser: (user: { email: string }) => void;
}

function LoginPage({ setUser }: LoginPageProps): React.ReactElement {
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
        setUser({ email: credentials.email });
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md outline outline-2 outline-blue-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleInputChange}
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

export default LoginPage;