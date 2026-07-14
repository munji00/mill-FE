import type { UserRole } from "@/types";
// import type { User } from "@/types";

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

export interface LoginData {
  accessToken: string;
  user: User;
}

export interface RefreshTokenData {
  accessToken: string;
}

// export enum UserRole {
//   MASTER_ADMIN = "MASTER_ADMIN",
//   ADMIN = "ADMIN",
//   PARTNER = "PARTNER",
// }

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  tenant: any | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}