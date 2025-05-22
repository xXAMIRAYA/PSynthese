import { supabase } from "@/integrations/supabase/client";
import { DonationPayload,  DonationArgent,
  DonationMateriel,
  DonationBenevolat } from "./DonationPayload";

export type DonationFormData = {
  amount: number;
  message?: string;
  anonymous: boolean;
};
export async function makeDonation(data: DonationPayload) {
  try {
    const { type, ...donationData } = data;

    const { error } = await supabase
      .from('donations')
      .insert([
        {
          type,
          ...donationData
        }
      ]);

    if (error) throw error;
    console.log('Don ajouté avec succès');
  } catch (error: any) {
    console.error('Erreur lors de la soumission du don :', error);
    throw error;
  }
}

// export const makeDonation = async (
//   campaignId: string, 
//   userId: string, 
//   donationData: DonationFormData
// ) => {
//   try {
//     const { data, error } = await supabase
//       .from('donations')
//       .insert({
//         campaign_id: campaignId,
//         user_id: userId,
//         amount: donationData.amount,
//         message: donationData.message || null,
//         anonymous: donationData.anonymous
//       })
//       .select()
//       .single();

//     if (error) {
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     console.error('Error making donation:', error);
//     throw error;
//   }
// };

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