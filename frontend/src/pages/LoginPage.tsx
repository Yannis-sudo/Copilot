import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { AUTH_MESSAGES } from "../constants";
import type { LoginPayload } from "../types";
import UICard from "../components/UICard";
import UITextInput from "../components/UITextInput";
import UICheckbox from "../components/UICheckbox";
import UIButton from "../components/UIButton";
import UIErrorMessage from "../components/UIErrorMessage";
import UILink from "../components/UILink";

interface LoginPageProps {
  setUser: (user: { email: string, password: string }) => void;
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
        setUser({ email: credentials.email, password: credentials.password });
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
        <UICard className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          <form className="space-y-5" onSubmit={handleLogin}>
            <UIErrorMessage message={error || ""} />
            <UITextInput
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              value={credentials.email}
              onChange={handleInputChange}
              required
            />

            <UITextInput
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <UICheckbox label="Remember me" />

              <UILink
                href="#"
                external
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </UILink>
            </div>

            <UIButton type="submit" className="w-full">
              Sign In
            </UIButton>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <UILink href="/create-account">Sign Up</UILink>
            </p>
          </form>
        </UICard>
      </div>
    </React.Fragment>
  );
}

export default LoginPage;