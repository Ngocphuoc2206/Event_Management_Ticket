import { useRouter } from "next/router";

import { loginUser } from "@/features/auth/services/login.service";
import { logoutUser } from "@/features/auth/services/logout.service";
import { registerUser } from "@/features/auth/services/register.service";
import type {
  AuthSession,
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  RegisterPayload,
  RegisterResponse,
} from "@/features/auth/types";
import {
  clearAuthSession,
  createAuthSession,
  getApiResultData,
  getApiResultMessage,
  getPostAuthRoute,
  persistResolvedAuthSession,
} from "@/features/auth/utils";

type AuthActionResult = {
  message: string;
  session: AuthSession | null;
  shouldRedirect: boolean;
  redirectTo: string | null;
};

type LogoutActionResult = {
  message: string;
  redirectTo: string;
};

type RedirectOptions = {
  redirect?: boolean;
  redirectDelayMs?: number;
};

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function useAuth() {
  const router = useRouter();

  const login = async (
    payload: LoginPayload,
    options?: RedirectOptions,
  ): Promise<AuthActionResult> => {
    const response = await loginUser(payload);
    const authPayload = getApiResultData<LoginResponse>(response);
    const session = createAuthSession(authPayload);
    const shouldRedirect = Boolean(session?.accessToken);
    const redirectTo = shouldRedirect ? getPostAuthRoute(session?.role ?? undefined) : null;
    const message =
      getApiResultMessage(response) ||
      (shouldRedirect ? "Login successful. Redirecting..." : "Login successful.");

    persistResolvedAuthSession(session);

    if (shouldRedirect && options?.redirect !== false && redirectTo) {
      await wait(options?.redirectDelayMs ?? 800);
      await router.push(redirectTo);
    }

    return {
      message,
      session,
      shouldRedirect,
      redirectTo,
    };
  };

  const register = async (
    payload: RegisterPayload,
    options?: RedirectOptions,
  ): Promise<AuthActionResult> => {
    const response = await registerUser(payload);
    const authPayload = getApiResultData<RegisterResponse>(response);
    const session = createAuthSession(authPayload, { fallbackRole: "CUSTOMER" });
    const shouldRedirect = Boolean(session?.accessToken);
    const redirectTo = shouldRedirect ? getPostAuthRoute(session?.role ?? undefined) : null;
    const message =
      getApiResultMessage(response) ||
      (shouldRedirect
        ? "Account created successfully. Redirecting..."
        : "Account created successfully.");

    persistResolvedAuthSession(session);

    if (shouldRedirect && options?.redirect !== false && redirectTo) {
      await wait(options?.redirectDelayMs ?? 1200);
      await router.push(redirectTo);
    }

    return {
      message,
      session,
      shouldRedirect,
      redirectTo,
    };
  };

  const logout = async (
    payload?: LogoutPayload,
    options?: { redirectTo?: string; redirect?: boolean },
  ): Promise<LogoutActionResult> => {
    try {
      const response = await logoutUser(payload);
      const message = getApiResultMessage(response) || "Log out successfully.";

      return {
        message,
        redirectTo: options?.redirectTo ?? "/auth/login",
      };
    } finally {
      clearAuthSession();

      if (options?.redirect !== false) {
        await router.push(options?.redirectTo ?? "/auth/login");
      }
    }
  };

  return {
    login,
    register,
    logout,
  };
}
