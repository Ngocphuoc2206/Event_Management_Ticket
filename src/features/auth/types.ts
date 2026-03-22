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
  password?: string;
};

export type AuthPayload = UserResponse & {
  role?: UserRole;
  accessToken?: string;
  refreshToken?: string;
};

export type RegisterResponse = AuthPayload;

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = AuthPayload;
