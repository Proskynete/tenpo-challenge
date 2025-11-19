import { Redirect } from "wouter";
import type { PropsWithChildren } from "react";
import { getToken } from "../utils/cookies";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const isAuthenticated = !!getToken();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <>{children}</>;
};
