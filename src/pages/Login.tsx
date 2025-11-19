import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Login = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { login, isLoading, loginResponse, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const errorMessage =
    loginResponse && !loginResponse.success
      ? loginResponse.message || t("auth.errorLogin")
      : null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-gray-600">{t("auth.signInToContinue")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder={t("auth.enterEmail")}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder={t("auth.enterPassword")}
              disabled={isLoading}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <Button size="full" type="submit" disabled={isLoading}>
            {isLoading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {t("auth.useEmailToLogin", {
              email: "leopoldo.henchoz@tenpo.cl",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
