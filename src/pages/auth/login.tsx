import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  AUTH_CHECKBOX_CLASSNAME,
  AUTH_PASSWORD_TOGGLE_CLASSNAME,
  AUTH_PRIMARY_BUTTON_CLASSNAME,
  AUTH_SHELL_CLASSNAME,
  AUTH_TEXT_INPUT_CLASSNAME,
  AUTH_TEXT_LINK_CLASSNAME,
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
                  className={AUTH_TEXT_INPUT_CLASSNAME}
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
