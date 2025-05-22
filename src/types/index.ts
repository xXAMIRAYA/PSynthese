
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
  createdAt: string;
  donationsCount?: number;
  totalDonated?: number;
  badges?: Badge[];
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: 'emergency' | 'research' | 'equipment' | 'care' | 'awareness';
  location: string;
  organizer: string;
  target: number;
  raised: number;
  donorsCount: number;
  imageUrl: string;
  endDate: string;
  createdAt: string;
  status: 'active' | 'completed' | 'urgent';
  updates?: CampaignUpdate[];
  image_url?: string;
  end_date?: string;
  donors_count?: number;
  created_at?: string;
  organizer_id?: string;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Donation {
  type: string;
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
}

export interface DashboardStats {
  totalDonations: number;
  activeCampaigns: number;
  totalRaised: number;
  donorsCount: number;
  completedCampaigns: number;
  recentDonations: Donation[];
}
