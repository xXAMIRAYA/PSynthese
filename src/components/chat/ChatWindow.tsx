import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EnhancedMessage } from './types';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import MessagesList from './MessagesList'; // Corrigez l'import (pas MessageInput)
import { useAuth } from '@/contexts/AuthContext'; // Import correct

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Array<{id: string, name: string}>>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const { user } = useAuth(); // Utilisation correcte du hook
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;

// Dans la fonction fetchContacts du ChatWindow.tsx
const fetchContacts = async () => {
  try {
    if (!user?.id) return;

    let contactsToLoad = [];
    
    if (user.role === 'user') { // Donateur
      // Récupérer les organisateurs des campagnes auxquelles l'utilisateur a donné
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('campaign_id')
        .eq('user_id', user.id);

      if (donationsError) throw donationsError;

      if (donations && donations.length > 0) {
        const campaignIds = donations.map(d => d.campaign_id);
        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('organizer_id')
          .in('id', campaignIds);

        if (campaignsError) throw campaignsError;

        const organizerIds = [...new Set(campaigns.map(c => c.organizer_id))];
        const { data: organizers, error: organizersError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', organizerIds)
          .eq('role', 'campaign_manager'); // Seulement les organisateurs

        if (organizersError) throw organizersError;

        contactsToLoad = organizers?.map(org => ({
          id: org.id,
          name: org.name || 'Organisateur'
        })) || [];
      }
    } else if (user.role === 'campaign_manager') { // Organisateur
      // Récupérer les donateurs de ses campagnes
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id')
        .eq('organizer_id', user.id);

      if (campaignsError) throw campaignsError;

      if (campaigns && campaigns.length > 0) {
        const campaignIds = campaigns.map(c => c.id);
        const { data: donations, error: donationsError } = await supabase
          .from('donations')
          .select('user_id')
          .in('campaign_id', campaignIds);

        if (donationsError) throw donationsError;

        const donorIds = [...new Set(donations.map(d => d.user_id))];
        const { data: donors, error: donorsError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', donorIds)
          .eq('role', 'donator'); // Seulement les donateurs

        if (donorsError) throw donorsError;

        contactsToLoad = donors?.map(donor => ({
          id: donor.id,
          name: donor.name || 'Donateur'
        })) || [];
      }
    }

    setContacts(contactsToLoad);
    
    if (contactsToLoad.length > 0 && !selectedContact) {
      setSelectedContact(contactsToLoad[0].id);
    }

  } catch (error) {
    console.error("Erreur contacts:", error);
    toast.error("Erreur chargement contacts");
  }
};

    fetchContacts();
  }, [user?.id, selectedContact]);

  // Fetch messages when contact is selected
  useEffect(() => {
    if (!user || !selectedContact) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact}),and(sender_id.eq.${selectedContact},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        setMessages(data || []);
        
        // Mark received messages as read
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', selectedContact)
          .eq('read', false);
          
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        toast.error("Impossible de charger les messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${selectedContact}),and(sender_id=eq.${selectedContact},receiver_id=eq.${user.id}))`,
        },
        async (payload) => {
          const { data: message, error } = await supabase
            .from('messages')
            .select('*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)')
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error("Erreur lors de la récupération du nouveau message:", error);
            return;
          }

          setMessages((prev) => [...prev, message as EnhancedMessage]);

          // Mark received messages as read
          if (message.receiver_id === user.id) {
            await supabase
              .from('messages')
              .update({ read: true })
              .eq('id', message.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, selectedContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedContact) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user.id,
          receiver_id: selectedContact,
        });

      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold">Messagerie</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Fermer le chat"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Contact selector
      {contacts.length > 0 && (
        <div className="p-2 border-b">
          <select
            value={selectedContact || ''}
            onChange={(e) => setSelectedContact(e.target.value)}
            className="w-full p-2 text-sm border rounded"
          >
            <option value="" disabled>Sélectionner un contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </div>
      )} */}
{contacts.length > 0 ? (
  <select
    value={selectedContact || ''}
    onChange={(e) => setSelectedContact(e.target.value)}
    className="w-full p-2 text-sm border rounded"
  >
    <option value="" disabled>
      {user?.role === 'donator' ? 'Sélectionner un organisateur' : 'Sélectionner un donateur'}
    </option>
    {contacts.map((contact) => (
      <option key={contact.id} value={contact.id}>
        {contact.name}
      </option>
    ))}
  </select>
) : (
  <div className="p-4 text-center text-sm text-gray-500">
    {user?.role === 'donator' 
      ? "Vous n'avez pas encore contribué à des campagnes"
      : "Aucun donateur disponible"}
  </div>
)}
      {/* Messages */}
      {selectedContact ? (
        <>
          <MessagesList 
            messages={messages} 
            isLoading={loading} 
            messagesEndRef={messagesEndRef} 
          />
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-2 border-t flex">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 mr-2"
            />
            <Button type="submit" size="sm">
              Envoyer
            </Button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          {contacts.length === 0 ? "Aucun contact" : "Sélectionnez un contact"}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;