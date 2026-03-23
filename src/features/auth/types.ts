export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type ApiResponse<T> = {
  code?: number;
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
  results?: T;
};

export type ApiResult<T> = T | ApiResponse<T>;

export type UserRole = "CUSTOMER" | "ORGANIZER" | "ADMIN";

export type AuthPayload = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  accessToken?: string;
  refreshToken?: string;
};

export type AuthSession = {
  id: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export type RegisterResponse = AuthPayload;

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = AuthPayload;

export type LogoutPayload = Partial<LoginPayload>;

export type LogoutResponse = {
  message?: string;
};
