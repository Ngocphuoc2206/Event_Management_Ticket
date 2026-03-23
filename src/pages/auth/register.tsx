import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import {
  APP_NAME,
  AUTH_CHECKBOX_CLASSNAME,
  AUTH_PASSWORD_TOGGLE_CLASSNAME,
  AUTH_PRIMARY_BUTTON_CLASSNAME,
  AUTH_SECONDARY_LINK_CLASSNAME,
  AUTH_SHELL_CLASSNAME,
  AUTH_TEXT_LINK_CLASSNAME,
  AUTH_TEXT_INPUT_CLASSNAME,
  AUTH_TEXT_LINK_CLASSNAME,
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
  AppleMark,
  BrandMark,
  EyeIcon,
  GoogleMark,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "@/features/auth/components/AuthIcons";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { registerUser } from "@/features/auth/services/register.service";
import type { RegisterResponse } from "@/features/auth/types";
import {
  getApiErrorMessage,
  getApiResultData,
  getApiResultMessage,
  getPostAuthRoute,
  persistAuthTokens,
} from "@/features/auth/utils";
import { checkBackendHealth } from "@/features/httpClient/health.service";
import { setUser } from "@/stores/slices/user/user.slice";

type RegisterFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{8,15}$/;

const INITIAL_FORM_VALUES: RegisterFormValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
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

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        password: data.password,
      });

      const registeredUser = getApiResultData<RegisterResponse>(response);
      const responseMessage = getApiResultMessage(response);
      const shouldRedirect = Boolean(registeredUser);

      persistAuthTokens(registeredUser);
      if (registeredUser) {
        dispatch(
          setUser({
            id: registeredUser.id ?? null,
            fullName: registeredUser.fullName ?? null,
            role: registeredUser.role ?? null,
            isLoggedIn: true,
          }),
        );
      }
      setSubmitSuccess(
        responseMessage ||
          (shouldRedirect
            ? "Account created successfully. Redirecting..."
            : "Account created successfully."),
      );
      reset(INITIAL_FORM_VALUES);

      if (shouldRedirect) {
        const destination = getPostAuthRoute(registeredUser?.role);
        window.setTimeout(() => {
          void router.push(destination);
        }, 1200);
      }
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "Registration failed. Please try again."),
      );
    }
  };

  return (
    <>
      <Head>
        <title>Register | {APP_NAME}</title>
      </Head>

      <AuthPageLayout
        logo={<BrandMark />}
        logoText="EventHub"
        topSpacingClassName="pb-12 pt-8 md:pb-16"
        headerAction={
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className={AUTH_TEXT_LINK_CLASSNAME}>
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
            {isBackendAvailable === false ? (
              <AuthAlert
                message={`Frontend cannot reach backend at ${DEFAULT_API_BASE_URL}.`}
                tone="warning"
              />
            ) : null}
            {submitError ? (
              <AuthAlert message={submitError} tone="error" />
            ) : null}
            {submitSuccess ? (
              <AuthAlert message={submitSuccess} tone="success" />
            ) : null}

            <AuthField label="Full Name" error={errors.fullName?.message}>
              <AuthInputShell hasError={Boolean(errors.fullName)}>
                <UserIcon />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={AUTH_TEXT_INPUT_CLASSNAME}
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

            <AuthField label="Phone Number" error={errors.phone?.message}>
              <AuthInputShell hasError={Boolean(errors.phone)}>
                <PhoneIcon />
                <input
                  type="tel"
                  placeholder="123456789"
                  className={AUTH_TEXT_INPUT_CLASSNAME}
                  {...register("phone", {
                    required: "Please enter your phone number",
                    pattern: {
                      value: PHONE_PATTERN,
                      message: "Phone number must contain 8 to 15 digits",
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </AuthInputShell>
              </AuthField>

              <AuthField
                label="Confirm Password"
                error={errors.confirmPassword?.message}
              >
                <AuthInputShell hasError={Boolean(errors.confirmPassword)}>
                  <LockIcon />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="........"
                    className={AUTH_TEXT_INPUT_CLASSNAME}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className={AUTH_PASSWORD_TOGGLE_CLASSNAME}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    <EyeIcon off={showConfirmPassword} />
                  </button>
                </AuthInputShell>
              </AuthField>
            </div>

            <label className="flex items-start gap-3 text-sm leading-6 text-slate-500">
              <input
                type="checkbox"
                className={`mt-1 ${AUTH_CHECKBOX_CLASSNAME}`}
                {...register("acceptTerms", {
                  required: "You must agree to the terms before continuing",
                })}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className={AUTH_SECONDARY_LINK_CLASSNAME}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className={AUTH_SECONDARY_LINK_CLASSNAME}>
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.acceptTerms ? (
              <p className="-mt-3 text-sm text-rose-500">
                {errors.acceptTerms.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={AUTH_PRIMARY_BUTTON_CLASSNAME}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8">
            <AuthDivider label="Or register with" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AuthSocialButton icon={<GoogleMark />} label="Google" />
              <AuthSocialButton icon={<AppleMark />} label="Apple" />
            </div>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-[0_16px_40px_rgba(76,93,156,0.12)] backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Join 12,000+ active organizers</span>
        </div>
      </AuthPageLayout>
    </>
  );
}
