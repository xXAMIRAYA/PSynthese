import { supabase } from "@/integrations/supabase/client";

export type DonationFormData = {
  type: 'money' | 'material' | 'volunteering';
  amount?: number;
  message?: string;
  anonymous: boolean;

  // Pour don matériel
  description?: string;
  quantity?: number;

  // Pour bénévolat
  skills?: string;
  availability?: string;
};

export const makeDonation = async (
  campaignId: string, 
  userId: string, 
  donationData: DonationFormData
) => {
  try {
    const baseData: any = {
      campaign_id: campaignId,
      user_id: userId,
      type: donationData.type,
      message: donationData.message || null,
      anonymous: donationData.anonymous,
    };

    if (donationData.type === 'money') {
      baseData.amount = donationData.amount;
    }

    if (donationData.type === 'material') {
      baseData.description = donationData.description;
      baseData.quantity = donationData.quantity;
    }

    if (donationData.type === 'volunteering') {
      baseData.skills = donationData.skills;
      baseData.availability = donationData.availability;
    }

    const { data, error } = await supabase
      .from('donations')
      .insert(baseData)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error making donation:', error);
    throw error;
  }
};


export const fetchDonationsByCampaign = async (campaignId: string) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donor:profiles(name, avatar_url)
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const fetchUserDonations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        campaign:campaigns(id, title, image_url, status)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user donations:', error);
    throw error;
  }
};

export const getDonationStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const totalDonated = data.reduce((sum, donation) => sum + parseFloat(String(donation.amount)), 0);
    
    return {
      count: data.length,
      totalAmount: totalDonated
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }
};
