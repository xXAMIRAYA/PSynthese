
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types";

export type CampaignFormData = {
  title: string;
  description: string;
  category: string;
  location: string;
  target: number;
  end_date: string;
  image?: File | null;
};

export const fetchCampaigns = async (filters?: {
  category?: string;
  status?: string;
  search?: string;
}) => {
  try {
    let query = supabase.from("campaigns").select(`
      *,
      organizer:profiles(name, avatar_url)
    `);

    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const fetchCampaignById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        organizer:profiles(name, avatar_url),
        updates:campaign_updates(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
};

export const createCampaign = async (campaignData: CampaignFormData, userId: string) => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (campaignData.image) {
      const file = campaignData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('campaign_images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Create campaign record
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        location: campaignData.location,
        organizer_id: userId,
        target: campaignData.target,
        end_date: new Date(campaignData.end_date).toISOString(),
        image_url: imageUrl,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const updateCampaignStatus = async (campaignId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ status })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating campaign status:', error);
    throw error;
  }
};

export const addCampaignUpdate = async (campaignId: string, content: string, image?: File) => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `update-${campaignId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign_images')
        .upload(filePath, image);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('campaign_images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from('campaign_updates')
      .insert({
        campaign_id: campaignId,
        content,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding campaign update:', error);
    throw error;
  }
};

export const deleteCampaign = async (campaignId: string) => {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};
