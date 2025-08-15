"use client";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../app/component/store/index";
import { AuthProvider } from "../app/component/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}
