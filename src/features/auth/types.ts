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

export type UserResponse = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  password?: string;
  role?: UserRole;
};

export type AuthPayload = UserResponse & {
  role?: UserRole;
  accessToken?: string;
  refreshToken?: string;
};

export type AuthSession = {
  id: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
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

export type RefreshPayload = {
  refreshToken: string;
};

export type RefreshResponse = AuthPayload;

export type LogoutPayload = Partial<LoginPayload>;

export type LogoutResponse = {
  message?: string;
};

export type UserProfileResponse = UserResponse;

export type UpdateProfilePayload = {
  fullName: string;
  phone: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
