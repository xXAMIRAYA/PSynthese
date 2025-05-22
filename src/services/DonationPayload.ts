export interface DonationArgent {
  type: 'argent';
  campaignId: string;
  userId: string;
  amount: number;
  message?: string;
  anonymous: boolean;
}

export interface DonationMateriel {
  type: 'materiel';
  campaignId: string;
  userId: string;
  materialName: string;
  quantity: number;
  condition?: string;
  description?: string;
  message?: string;
  anonymous: boolean;
}

export interface DonationBenevolat {
  type: 'benevolat';
  campaignId: string;
  userId: string;
  availability: string;
  skills?: string;
  message?: string;
}

export type DonationPayload = DonationArgent | DonationMateriel | DonationBenevolat;
