export const USER_ROLE = {
  MASTER_ADMIN: "MASTER_ADMIN",
  ADMIN: "ADMIN",
  PARTNER: "PARTNER",
} as const;

export type UserRole =
  (typeof USER_ROLE)[keyof typeof USER_ROLE];