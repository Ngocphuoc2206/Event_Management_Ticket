import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  APP_NAME,
  AUTH_PRIMARY_BUTTON_CLASSNAME,
  AUTH_SHELL_CLASSNAME,
  AUTH_TEXT_INPUT_CLASSNAME,
  DEFAULT_API_BASE_URL,
} from "@/features/auth/constants";
import {
  AuthAlert,
  AuthDivider,
  AuthField,
  AuthInputShell,
  AuthSocialButton,
} from "@/features/auth/components/AuthForm";
import {
  EyeIcon,
  FacebookMark,
  GoogleMark,
  IdentityIcon,
  LockIcon,
  LoginBrandMark,
} from "@/features/auth/components/AuthIcons";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { loginUser } from "@/features/auth/services/login.service";
import type { LoginResponse } from "@/features/auth/types";
import {
  getApiErrorMessage,
  getApiResultData,
  getApiResultMessage,
  getPostAuthRoute,
  persistAuthTokens,
} from "@/features/auth/utils";
import { checkBackendHealth } from "@/features/httpClient/health.service";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM_VALUES: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: INITIAL_FORM_VALUES,
  });

  useEffect(() => {
    let isMounted = true;

    const verifyBackend = async () => {
      try {
        await checkBackendHealth();
        if (isMounted) {
          setIsBackendAvailable(true);
        }
      } catch {
        if (isMounted) {
          setIsBackendAvailable(false);
        }
      }
    };

    void verifyBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await loginUser({
        email: data.email.trim(),
        password: data.password,
      });

      const session = getApiResultData<LoginResponse>(response);
      const responseMessage = getApiResultMessage(response);
      const shouldRedirect = Boolean(session?.accessToken);

      persistAuthTokens(session);
      setSubmitSuccess(
        responseMessage ||
          (shouldRedirect ? "Login successful. Redirecting..." : "Login successful.")
      );

      if (shouldRedirect) {
        const destination = getPostAuthRoute(session?.role);
        window.setTimeout(() => {
          void router.push(destination);
        }, 800);
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Login failed. Please check your credentials."));
    }
  };

  return (
    <>
      <Head>
        <title>Login | {APP_NAME}</title>
      </Head>

      <AuthPageLayout logo={<LoginBrandMark />} logoText="EventHub">
        <div className={AUTH_SHELL_CLASSNAME}>
          <div className="text-left">
            <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 sm:text-[2.2rem]">Welcome Back</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Please enter your details to access your events.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {isBackendAvailable === false ? (
              <AuthAlert message={`Frontend cannot reach backend at ${DEFAULT_API_BASE_URL}.`} tone="warning" />
            ) : null}
            {submitError ? <AuthAlert message={submitError} tone="error" /> : null}
            {submitSuccess ? <AuthAlert message={submitSuccess} tone="success" /> : null}

            <AuthField label="Email Address" error={errors.email?.message}>
              <AuthInputShell hasError={Boolean(errors.email)} borderClassName="border-slate-300 focus-within:border-blue-400">
                <IdentityIcon />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={AUTH_TEXT_INPUT_CLASSNAME}
                  {...register("email", {
                    required: "Please enter your email address",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
              </AuthInputShell>
            </AuthField>

            <AuthField
              label="Password"
              error={errors.password?.message}
              trailing={
                <Link href="/auth/forgot-password" className="text-xs font-semibold text-blue-700 transition hover:text-violet-600">
                  Forgot password?
                </Link>
              }
            >
              <AuthInputShell hasError={Boolean(errors.password)} borderClassName="border-slate-300 focus-within:border-blue-400">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="........"
                  className={AUTH_TEXT_INPUT_CLASSNAME}
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className={AUTH_PASSWORD_TOGGLE_CLASSNAME}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </AuthInputShell>
            </AuthField>

            <label className="flex items-center gap-3 text-sm leading-6 text-slate-500">
              <input
                type="checkbox"
                className={AUTH_CHECKBOX_CLASSNAME}
                {...register("rememberMe")}
              />
              <span>Remember me for 30 days</span>
            </label>

            <button type="submit" disabled={isSubmitting} className={AUTH_PRIMARY_BUTTON_CLASSNAME}>
              {isSubmitting ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="mt-8">
            <AuthDivider label="Or continue with" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AuthSocialButton icon={<GoogleMark />} label="Google" />
              <AuthSocialButton icon={<FacebookMark />} label="Facebook" />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className={AUTH_TEXT_LINK_CLASSNAME}>
              Sign Up
            </Link>
          </p>
        </div>
      </AuthPageLayout>
    </>
  );
}
