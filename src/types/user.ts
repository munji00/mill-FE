import type { Tenant } from "./tenant";
import type { UserRole } from "./role";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  tenant: Tenant | null;
  mobileNumber?: string;
}