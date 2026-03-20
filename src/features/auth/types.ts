export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type ApiResult<T> = T | ApiResponse<T>;

export type RegisterResponse = {
  id?: string;
  fullName?: string;
  email?: string;
  role?: "CUSTOMER" | "ORGANIZER" | "ADMIN";
  accessToken?: string;
  refreshToken?: string;
};
