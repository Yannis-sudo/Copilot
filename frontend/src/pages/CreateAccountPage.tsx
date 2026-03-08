import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api";
import { AUTH_MESSAGES } from "../constants";
import type { CreateAccountPayload } from "../types";
import UICard from "../components/UICard";
import UITextInput from "../components/UITextInput";
import UIButton from "../components/UIButton";
import UIErrorMessage from "../components/UIErrorMessage";
import UILink from "../components/UILink";

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
        <UICard className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          <form className="space-y-5">
            <UIErrorMessage message={error || ""} />
            <UITextInput
              type="text"
              name="username"
              label="Username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />

            <UITextInput
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <UITextInput
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <UITextInput
              type="password"
              name="passwordConfirm"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
            />

            <div className="space-y-4 pt-2">
              <UIButton
                type="button"
                onClick={handleCreateAccount}
                className="w-full"
              >
                Create Account
              </UIButton>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <UILink href="/login">Login here</UILink>
              </p>
            </div>
          </form>
        </UICard>
      </div>
    </React.Fragment>
  );
}

export default CreateAccountPage;