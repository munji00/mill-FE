export interface Tenant {
  id: string;
  name: string;
  code: string;
  email?: string;
  contactNumber?: string;
  registerNumber?: string;
  ownerName?: string;
  ownerMobile?: string;
  state?: string;
  city?: string;
  townOrVillage?: string;
  subscription?: {
    id: string;
    type: string;
    isActive: boolean;
    lastSubscription: string;
    nextSubscription: string;
  } | null;
}