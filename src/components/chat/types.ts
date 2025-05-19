
import { Database } from "@/integrations/supabase/types";

export type Message = Database['public']['Tables']['messages']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  unread?: number;
}

export interface EnhancedMessage extends Message {
  sender_name?: string;
  receiver_name?: string;
}
