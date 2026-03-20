import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AUTH_SHELL_CLASSNAME } from "@/features/auth/constants";
import { AuthAlert, AuthField, AuthInputShell } from "@/features/auth/components/AuthForm";
import {
  EyeIcon,
  FacebookMark,
  GoogleMark,
  IdentityIcon,
  LockIcon,
  LoginBrandMark,
} from "@/features/auth/components/AuthIcons";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";

type LoginFormValues = {
  identity: string;
  password: string;
  rememberMe: boolean;
};

const INITIAL_FORM_VALUES: LoginFormValues = {
  identity: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: INITIAL_FORM_VALUES,
  });

  const onSubmit = async () => {
    setSubmitMessage("Login API will be connected when backend is ready.");
    await Promise.resolve();
  };

  return (
    <>
      <Head>
        <title>Login | EventHub</title>
      </Head>

      <AuthPageLayout logo={<LoginBrandMark />} logoText="EventHub">
        <div className={AUTH_SHELL_CLASSNAME}>
          <div className="text-left">
            <h1 className="text-[2rem] font-bold tracking-tight text-slate-900 sm:text-[2.2rem]">
              Welcome Back
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Please enter your details to access your events.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {submitMessage ? <AuthAlert message={submitMessage} /> : null}

            <AuthField label="Email Or Username" error={errors.identity?.message}>
              <AuthInputShell hasError={Boolean(errors.identity)} borderClassName="border-slate-300 focus-within:border-blue-400">
                <IdentityIcon />
                <input
                  type="text"
                  placeholder="name@company.com"
                  className="ml-3 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  {...register("identity", {
                    required: "Please enter your email or username",
                  })}
                />
              </AuthInputShell>
            </AuthField>

            <AuthField
              label="Password"
              error={errors.password?.message}
              trailing={
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-blue-700 transition hover:text-violet-600"
                >
                  Forgot password?
                </Link>
              }
            >
              <AuthInputShell hasError={Boolean(errors.password)} borderClassName="border-slate-300 focus-within:border-blue-400">
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

            <label className="flex items-center gap-3 text-sm leading-6 text-slate-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                {...register("rememberMe")}
              />
              <span>Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-violet-600 text-base font-semibold text-white shadow-[0_12px_30px_rgba(76,92,193,0.32)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(76,92,193,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Or continue with
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
                <FacebookMark />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-blue-700 transition hover:text-violet-600">
              Sign Up
            </Link>
          </p>
        </div>
      </AuthPageLayout>
    </>
  );
}
