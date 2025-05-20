import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedMessage } from './types';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import MessagesList from './MessagesList';
import { useAuth } from '@/contexts/AuthContext';

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, profile } = useAuth();

  // Charger les contacts
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.id || !profile?.role) {
        setContacts([]);
        setSelectedContact(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let contactsToLoad: Array<{ id: string; name: string; role: string }> = [];

        if (profile.role === 'donator') {
          const { data: donations, error: donationsError } = await supabase
            .from('donations')
            .select('campaign_id')
            .eq('user_id', user.id);
          if (donationsError) throw donationsError;

          const campaignIds = donations?.map((d) => d.campaign_id) || [];
          if (campaignIds.length === 0) {
            setContacts([]);
            setSelectedContact(null);
            setLoading(false);
            return;
          }

          const { data: campaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select('organizer_id')
            .in('id', campaignIds);
          if (campaignsError) throw campaignsError;

          const organizerIds = [...new Set(campaigns.map((c) => c.organizer_id))];
          if (organizerIds.length === 0) {
            setContacts([]);
            setSelectedContact(null);
            setLoading(false);
            return;
          }

          const { data: organizers, error: organizersError } = await supabase
            .from('profiles')
            .select('id, name, role')
            .in('id', organizerIds)
            .eq('role', 'campaign_manager');
          if (organizersError) throw organizersError;

          contactsToLoad = organizers.map((org) => ({
            id: org.id,
            name: org.name || 'Responsable',
            role: org.role,
          }));
        } else if (profile.role === 'campaign_manager') {
          const { data: campaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select('id')
            .eq('organizer_id', user.id);
          if (campaignsError) throw campaignsError;

          const campaignIds = campaigns?.map((c) => c.id) || [];
          if (campaignIds.length === 0) {
            setContacts([]);
            setSelectedContact(null);
            setLoading(false);
            return;
          }

          const { data: donations, error: donationsError } = await supabase
            .from('donations')
            .select('user_id')
            .in('campaign_id', campaignIds);
          if (donationsError) throw donationsError;

          const donorIds = [...new Set(donations?.map((d) => d.user_id))];
          if (donorIds.length === 0) {
            setContacts([]);
            setSelectedContact(null);
            setLoading(false);
            return;
          }

          const { data: donors, error: donorsError } = await supabase
            .from('profiles')
            .select('id, name, role')
            .in('id', donorIds)
            .eq('role', 'donator');
          if (donorsError) throw donorsError;

          contactsToLoad = donors.map((donor) => ({
            id: donor.id,
            name: donor.name || 'Donateur',
            role: donor.role,
          }));
        } else if (profile.role === 'admin') {
          const { data: allProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, role')
            .in('role', ['donator', 'campaign_manager'])
            .neq('id', user.id);
          if (profilesError) throw profilesError;

          contactsToLoad = allProfiles.map((p) => ({
            id: p.id,
            name: p.name || 'Utilisateur',
            role: p.role,
          }));
        }

        setContacts(contactsToLoad);
        setSelectedContact(contactsToLoad.length > 0 ? contactsToLoad[0].id : null);
      } catch (error) {
        console.error('Erreur chargement contacts:', error);
        toast.error('Erreur lors du chargement des contacts.');
        setContacts([]);
        setSelectedContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user?.id, profile?.role]);

  // Charger et écouter les messages
  useEffect(() => {
    if (!user || !selectedContact) {
      setMessages([]);
      return;
    }

    setLoading(true);
    let channel: any;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(
            '*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)'
          )
          .or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact}),and(sender_id.eq.${selectedContact},receiver_id.eq.${user.id})`
          )
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data || []);

        // Marquer les messages reçus comme lus
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', selectedContact)
          .eq('read', false);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
        toast.error('Erreur lors du chargement des messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Écouter les nouveaux messages
    channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMsg = payload.new;
          const participants = [user.id, selectedContact];

          if (
            participants.includes(newMsg.sender_id) &&
            participants.includes(newMsg.receiver_id)
          ) {
            try {
              const { data: message, error } = await supabase
                .from('messages')
                .select(
                  '*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)'
                )
                .eq('id', newMsg.id)
                .single();

              if (!error && message) {
                setMessages((prev) => [...prev, message]);

                // Notification avec le nom de l'expéditeur
                if (message.receiver_id === user.id && !message.read) {
                  toast(`${message.sender?.name || 'Nouvel utilisateur'}: ${message.content}`);
                  // Marquer le message comme lu
                  await supabase.from('messages').update({ read: true }).eq('id', message.id);
                }
              }
            } catch (error) {
              console.error('Erreur lors de la réception du nouveau message:', error);
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, selectedContact]);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedContact) return;

    try {
      const { error } = await supabase.from('messages').insert({
        content: newMessage.trim(),
        sender_id: user.id,
        receiver_id: selectedContact,
        read: false,
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error("Impossible d'envoyer le message.");
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

      {contacts.length > 0 ? (
        <div className="p-2 border-b">
          <select
            value={selectedContact || ''}
            onChange={(e) => setSelectedContact(e.target.value)}
            className="w-full p-2 text-sm border rounded"
          >
            <option value="" disabled>
              Sélectionnez un contact
            </option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} (
                {contact.role === 'donator'
                  ? 'Donateur'
                  : contact.role === 'campaign_manager'
                  ? 'Responsable'
                  : 'Utilisateur'}
                )
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          {profile?.role === 'donator'
            ? "Vous n'avez pas encore contribué à des campagnes"
            : profile?.role === 'campaign_manager'
            ? 'Aucun donateur trouvé'
            : 'Aucun contact disponible'}
        </div>
      )}

      {selectedContact && (
        <>
          <MessagesList
            messages={messages}
            isLoading={loading}
            messagesEndRef={messagesEndRef}
          />
          <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
            <Input
              type="text"
              placeholder="Écrire un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"/>
    <Button type="submit" disabled={!newMessage.trim()}>
Envoyer
</Button>
</form>
</>
)}
</div>
);
};

export default ChatWindow;