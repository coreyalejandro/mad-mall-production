"use client";

import type { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
  helpUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
};

export const AuthProvider = ({ children }: AuthProviderProps) => (
  <>{children}</>
);
