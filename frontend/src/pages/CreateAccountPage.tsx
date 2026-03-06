import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAccount } from "../api";
import { AUTH_MESSAGES } from "../constants";
import type { CreateAccountPayload } from "../types";

interface CreateAccountFormState extends CreateAccountPayload {
  passwordConfirm: string;
}

function CreateAccountPage(): React.ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAccountFormState>({
    email: "",
    password: "",
    username: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAccount = async (): Promise<void> => {
    setError(null);

    if (formData.password !== formData.passwordConfirm) {
      setError(AUTH_MESSAGES.PASSWORDS_MISMATCH);
      return;
    }

    try {
      const payload: CreateAccountPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await createAccount(payload);

      if (response.message.includes(AUTH_MESSAGES.ACCOUNT_EXISTS)) {
        setError(AUTH_MESSAGES.ACCOUNT_EXISTS);
      } else {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Account creation failed");
    }
  };

  return (
    <React.Fragment>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md outline outline-2 outline-blue-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          <form className="space-y-5">
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
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
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                placeholder="••••••••"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
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

export default CreateAccountPage;