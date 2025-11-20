import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Response } from "../models/common";

export const Login = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { login, isLoading, loginResponse, isAuthenticated, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Handle both HTTP errors and response errors
  const errorMessage = error
    ? (error as AxiosError<Response<unknown>>).response?.data?.message ||
      t("auth.errorLogin")
    : loginResponse && !loginResponse.success
      ? loginResponse.message || t("auth.errorLogin")
      : null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/tenpo.png" alt="Logo" className="h-8" />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t("auth.welcomeBack")}
          </h1>
          <p className="text-gray-600">{t("auth.signInToContinue")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("auth.enterEmail")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("auth.enterPassword")}
              disabled={isLoading}
            />
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
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
