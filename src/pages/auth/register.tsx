import { isAxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AUTH_SHELL_CLASSNAME } from "@/features/auth/constants";
import { AuthAlert, AuthField, AuthInputShell } from "@/features/auth/components/AuthForm";
import {
  AppleMark,
  BrandMark,
  EyeIcon,
  GoogleMark,
  LockIcon,
  MailIcon,
  UserIcon,
} from "@/features/auth/components/AuthIcons";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { registerUser } from "@/features/auth/services/register.service";
import type { ApiResponse, ApiResult, RegisterResponse } from "@/features/auth/types";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM_VALUES: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

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

      <AuthPageLayout
        logo={<BrandMark />}
        logoText="EventHub"
        topSpacingClassName="pb-12 pt-8 md:pb-16"
        headerAction={
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-blue-700 transition hover:text-violet-600">
              Log In
            </Link>
          </p>
        }
      >
        <div className={AUTH_SHELL_CLASSNAME}>
          <div className="text-center">
            <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 sm:text-[2.2rem]">
              Create an account
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Join thousands of event organizers and attendees worldwide.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {submitError ? <AuthAlert message={submitError} tone="error" /> : null}
            {submitSuccess ? <AuthAlert message={submitSuccess} tone="success" /> : null}

            <AuthField label="Full Name" error={errors.fullName?.message}>
              <AuthInputShell hasError={Boolean(errors.fullName)}>
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
              </AuthInputShell>
            </AuthField>

            <AuthField label="Email Address" error={errors.email?.message}>
              <AuthInputShell hasError={Boolean(errors.email)}>
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
              </AuthInputShell>
            </AuthField>

            <div className="grid gap-5 sm:grid-cols-2">
              <AuthField label="Password" error={errors.password?.message}>
                <AuthInputShell hasError={Boolean(errors.password)}>
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
                </AuthInputShell>
              </AuthField>

              <AuthField label="Confirm Password" error={errors.confirmPassword?.message}>
                <AuthInputShell hasError={Boolean(errors.confirmPassword)}>
                  <LockIcon />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="........"
                    className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === getValues("password") || "Passwords do not match",
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
                </AuthInputShell>
              </AuthField>
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
      </AuthPageLayout>
    </>
  );
}
