import { isAxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "@/features/auth/services/register.service";
import type { ApiResponse, ApiResult, RegisterResponse } from "@/features/auth/types";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

type FieldProps = {
  children: ReactNode;
  error?: string;
  label: string;
};

type AlertProps = {
  message: string;
  tone: "error" | "success";
};

type FooterLink = {
  href: string;
  label: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM_VALUES: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const FOOTER_LINKS: FooterLink[] = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/help-center", label: "Help Center" },
];

function getApiResultData(response: ApiResult<RegisterResponse>) {
  return "data" in response ? response.data : response;
}

function getApiResultMessage(response: ApiResult<RegisterResponse>) {
  return "message" in response ? response.message : undefined;
}

function getRegistrationErrorMessage(error: unknown) {
  if (!isAxiosError<ApiResponse<RegisterResponse>>(error)) {
    return "Registration failed. Please try again.";
  }

  const apiMessage =
    error.response?.data?.message ||
    (typeof error.response?.data === "string" ? error.response.data : null);

  return apiMessage || "Registration failed. Please try again.";
}

function persistAuthTokens(response?: RegisterResponse) {
  if (typeof window === "undefined") {
    return;
  }

  if (response?.accessToken) {
    localStorage.setItem("accessToken", response.accessToken);
  }

  if (response?.refreshToken) {
    localStorage.setItem("refreshToken", response.refreshToken);
  }
}

function Field({ children, error, label }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-sm text-rose-500">{error}</span> : null}
    </label>
  );
}

function Alert({ message, tone }: AlertProps) {
  const toneClasses =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-600"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses}`}>{message}</div>;
}

function InputShell({
  children,
  hasError = false,
}: {
  children: ReactNode;
  hasError?: boolean;
}) {
  return (
    <div
      className={[
        "flex h-12 items-center rounded-2xl border bg-slate-100/90 px-4 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition",
        hasError
          ? "border-rose-300 focus-within:border-rose-400"
          : "border-slate-200 focus-within:border-blue-400",
        "focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function MailIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M4 7.5 10.94 12a2 2 0 0 0 2.12 0L20 7.5M5.2 19h13.6A1.2 1.2 0 0 0 20 17.8V6.2A1.2 1.2 0 0 0 18.8 5H5.2A1.2 1.2 0 0 0 4 6.2v11.6A1.2 1.2 0 0 0 5.2 19Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 0 1 12 0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M8 10V8a4 4 0 1 1 8 0v2m-9 9h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeIcon({ off = false }: { off?: boolean }) {
  if (off) {
    return (
      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="m3 3 18 18M10.58 10.58a2 2 0 0 0 2.84 2.84M9.88 5.09A9.8 9.8 0 0 1 12 4.86c4.44 0 8.19 2.9 9.46 6.9a9.93 9.93 0 0 1-3.06 4.64M6.1 6.11A9.96 9.96 0 0 0 2.54 11.76c1.27 4 5.02 6.9 9.46 6.9 1.55 0 3.02-.35 4.34-.97"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M2.54 12.24c1.27-4 5.02-6.9 9.46-6.9s8.19 2.9 9.46 6.9c-1.27 4-5.02 6.9-9.46 6.9s-8.19-2.9-9.46-6.9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-lg shadow-blue-500/20">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="M8 3v2m8-2v2M5 9h14M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

function GoogleMark() {
  return <span className="text-lg font-semibold tracking-tight text-slate-700">G</span>;
}

function AppleMark() {
  return (
    <svg className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.2 3.3c0 1-.4 2-1.1 2.7-.7.8-1.8 1.3-2.8 1.2-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.9-1.2ZM18.4 17.5c-.5 1.1-.8 1.6-1.5 2.6-.9 1.2-2.1 2.8-3.6 2.8-1.3 0-1.7-.8-3.3-.8-1.6 0-2 .8-3.3.8-1.4 0-2.5-1.4-3.4-2.6-2.6-3.5-2.9-7.7-1.3-10.1 1.1-1.7 2.9-2.8 4.6-2.8 1.4 0 2.4.8 3.4.8.9 0 2.3-.9 3.9-.9 1.2 0 2.8.3 4.1 1.7-3.6 2-3 7.1.4 8.5Z" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: INITIAL_FORM_VALUES,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      const registeredUser = getApiResultData(response);
      const responseMessage = getApiResultMessage(response);
      const shouldRedirectHome = Boolean(registeredUser?.accessToken);

      persistAuthTokens(registeredUser);
      setSubmitSuccess(
        responseMessage ||
          (shouldRedirectHome
            ? "Account created successfully. Redirecting..."
            : "Account created successfully.")
      );
      reset(INITIAL_FORM_VALUES);

      if (shouldRedirectHome) {
        window.setTimeout(() => {
          void router.push("/");
        }, 1200);
      }
    } catch (error) {
      setSubmitError(getRegistrationErrorMessage(error));
    }
  };

  return (
    <>
      <Head>
        <title>Register | EventHub</title>
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-[#f8f9ff] text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(105,126,255,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.12),_transparent_26%)]" />
        <div className="absolute inset-x-0 top-0 h-24 border-b border-white/60 bg-white/70 backdrop-blur-xl" />

        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col">
          <header className="flex items-center justify-between px-6 py-5 sm:px-8">
            <Link href="/" className="flex items-center gap-3">
              <BrandMark />
              <span className="text-xl font-bold tracking-tight text-slate-900">EventHub</span>
            </Link>

            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-700 transition hover:text-violet-600">
                Log In
              </Link>
            </p>
          </header>

          <section className="flex flex-1 items-center justify-center px-4 pb-12 pt-8 sm:px-6 md:pb-16">
            <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/88 p-6 shadow-[0_30px_80px_rgba(76,93,156,0.18)] backdrop-blur-xl sm:p-8">
              <div className="text-center">
                <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 sm:text-[2.2rem]">
                  Create an account
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Join thousands of event organizers and attendees worldwide.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                {submitError ? <Alert message={submitError} tone="error" /> : null}
                {submitSuccess ? <Alert message={submitSuccess} tone="success" /> : null}

                <Field label="Full Name" error={errors.fullName?.message}>
                  <InputShell hasError={Boolean(errors.fullName)}>
                    <UserIcon />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      {...register("fullName", {
                        required: "Please enter your full name",
                        minLength: {
                          value: 2,
                          message: "Full name must be at least 2 characters",
                        },
                      })}
                    />
                  </InputShell>
                </Field>

                <Field label="Email Address" error={errors.email?.message}>
                  <InputShell hasError={Boolean(errors.email)}>
                    <MailIcon />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      {...register("email", {
                        required: "Please enter your email address",
                        pattern: {
                          value: EMAIL_PATTERN,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </InputShell>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Password" error={errors.password?.message}>
                    <InputShell hasError={Boolean(errors.password)}>
                      <LockIcon />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="........"
                        className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
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
                        className="ml-3 transition hover:text-slate-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <EyeIcon off={showPassword} />
                      </button>
                    </InputShell>
                  </Field>

                  <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                    <InputShell hasError={Boolean(errors.confirmPassword)}>
                      <LockIcon />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="........"
                        className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === getValues("password") || "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="ml-3 transition hover:text-slate-700"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        <EyeIcon off={showConfirmPassword} />
                      </button>
                    </InputShell>
                  </Field>
                </div>

                <label className="flex items-start gap-3 text-sm leading-6 text-slate-500">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    {...register("acceptTerms", {
                      required: "You must agree to the terms before continuing",
                    })}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-blue-700 hover:text-violet-600">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-blue-700 hover:text-violet-600">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.acceptTerms ? (
                  <p className="-mt-3 text-sm text-rose-500">{errors.acceptTerms.message}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 text-base font-semibold text-white shadow-[0_12px_30px_rgba(76,92,193,0.32)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(76,92,193,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Or register with
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                  >
                    <GoogleMark />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                  >
                    <AppleMark />
                    <span>Apple</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className="flex flex-col gap-3 border-t border-slate-200/80 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>@ 2024 EventHub. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-slate-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
