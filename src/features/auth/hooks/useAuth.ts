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
  redirectTo?: string;
  redirect?: boolean;
};

export function useAuth() {
  const login = async (
    payload: LoginPayload,
    options?: Pick<RedirectOptions, "redirectTo">,
  ): Promise<AuthActionResult> => {
    const response = await loginUser(payload);
    const authPayload = getApiResultData<LoginResponse>(response);
    const session = createAuthSession(authPayload);
    const shouldRedirect = Boolean(session?.accessToken);
    const redirectTo =
      shouldRedirect
        ? options?.redirectTo ?? getPostAuthRoute(session?.role ?? undefined)
        : null;
    const message =
      getApiResultMessage(response) ||
      (shouldRedirect ? "Login successful. Redirecting..." : "Login successful.");

    persistResolvedAuthSession(session);

    return {
      message,
      session,
      shouldRedirect,
      redirectTo,
    };
  };

  const register = async (
    payload: RegisterPayload,
    options?: Pick<RedirectOptions, "redirectTo">,
  ): Promise<AuthActionResult> => {
    const response = await registerUser(payload);
    const authPayload = getApiResultData<RegisterResponse>(response);
    const session = createAuthSession(authPayload, { fallbackRole: "CUSTOMER" });
    const shouldRedirect = Boolean(session?.accessToken);
    const redirectTo =
      shouldRedirect
        ? options?.redirectTo ?? getPostAuthRoute(session?.role ?? undefined)
        : null;
    const message =
      getApiResultMessage(response) ||
      (shouldRedirect
        ? "Account created successfully. Redirecting..."
        : "Account created successfully.");

    persistResolvedAuthSession(session);

    return {
      message,
      session,
      shouldRedirect,
      redirectTo,
    };
  };

  const logout = async (
    payload?: LogoutPayload,
    options?: { redirectTo?: string },
  ): Promise<LogoutActionResult> => {
    const redirectTo = options?.redirectTo ?? "/auth/login";

    clearAuthSession();

    void logoutUser(payload)
      .then((response) => getApiResultMessage(response))
      .catch(() => null);

    return {
      message: "Log out successfully.",
      redirectTo,
    };
  };

  return {
    login,
    register,
    logout,
  };
}
