import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';
import { ChatContact, EnhancedMessage, Message } from './types';
import { Database } from "@/integrations/supabase/types";

export const useChatLogic = () => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupérer user au montage et écouter changement session
  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erreur récupération session utilisateur:", error);
        toast.error("Erreur lors de la récupération de votre session");
      } else if (session) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id ?? null);
      setUserEmail(session?.user.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Charger contacts quand userId change
  useEffect(() => {
    if (userId) {
      loadContacts();
    } else {
      setContacts([]);
      setSelectedContact(null);
    }
  }, [userId]);

  // Charger messages et marquer comme lus quand selectedContact change
  useEffect(() => {
    if (selectedContact && userId) {
      loadMessages();
      markMessagesAsRead();
    } else {
      setMessages([]);
    }
  }, [selectedContact, userId]);

  // Scroll vers le bas à chaque nouveau message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ecouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        }, 
        payload => {
          const newMsg = payload.new as Message;
          if (selectedContact && newMsg.sender_id === selectedContact.id) {
            handleNewMessage(newMsg);
            markMessagesAsRead();
          } else {
            updateUnreadCount(newMsg.sender_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, selectedContact]);

  // Fonctions

  const loadContacts = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const { data: userProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (errorProfile) throw errorProfile;

      let contactsToLoad: ChatContact[] = [];

      if (userProfile?.role === 'organizer') {
        const { data: donations, error: errorDonations } = await supabase
          .from('donations')
          .select('user_id, campaigns!inner(organizer_id)')
          .eq('campaigns.organizer_id', userId);

        if (errorDonations) throw errorDonations;

        if (donations && donations.length > 0) {
          const donorIds = [...new Set(donations.map(d => d.user_id))];
          const { data: donors, error: errorDonors } = await supabase
            .from('profiles')
            .select('id, name, role')
            .in('id', donorIds);

          if (errorDonors) throw errorDonors;

          contactsToLoad = donors?.map(donor => ({
            id: donor.id,
            name: donor.name || '',
            role: donor.role,
            unread: 0
          })) || [];
        }
      } else {
        const { data: donations, error: errorDonations } = await supabase
          .from('donations')
          .select('campaign_id')
          .eq('user_id', userId);

        if (errorDonations) throw errorDonations;

        if (donations && donations.length > 0) {
          const campaignIds = [...new Set(donations.map(d => d.campaign_id))];
          const { data: campaigns, error: errorCampaigns } = await supabase
            .from('campaigns')
            .select('organizer_id')
            .in('id', campaignIds);

          if (errorCampaigns) throw errorCampaigns;

          if (campaigns && campaigns.length > 0) {
            const organizerIds = [...new Set(campaigns.map(c => c.organizer_id))];
            const { data: organizers, error: errorOrganizers } = await supabase
              .from('profiles')
              .select('id, name, role')
              .in('id', organizerIds);

            if (errorOrganizers) throw errorOrganizers;

            contactsToLoad = organizers?.map(org => ({
              id: org.id,
              name: org.name || '',
              role: org.role,
              unread: 0
            })) || [];
          }
        }
      }

      // Charger compteurs non lus
      for (const contact of contactsToLoad) {
        const { count, error: errorCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', userId)
          .eq('sender_id', contact.id)
          .eq('read', false);

        if (errorCount) {
          console.error("Erreur compteur messages non lus", errorCount);
          continue;
        }

        contact.unread = count || 0;
      }

      setContacts(contactsToLoad);

    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      toast.error("Impossible de charger vos contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!userId || !selectedContact) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select()
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${selectedContact.id},receiver_id.eq.${selectedContact.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const filteredMessages = data?.filter(msg =>
        (msg.sender_id === userId && msg.receiver_id === selectedContact.id) ||
        (msg.sender_id === selectedContact.id && msg.receiver_id === userId)
      ) || [];

      const enhancedMessages = filteredMessages.map(msg => ({
        ...msg,
        sender_name: msg.sender_id === userId ? userEmail : selectedContact.name,
        receiver_name: msg.receiver_id === userId ? userEmail : selectedContact.name
      }));

      setMessages(enhancedMessages);

    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error("Impossible de charger vos messages");
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!userId || !selectedContact) return;

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', selectedContact.id)
        .eq('read', false);

      const updatedContacts = contacts.map(contact =>
        contact.id === selectedContact.id
          ? { ...contact, unread: 0 }
          : contact
      );

      setContacts(updatedContacts);

    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut des messages:', error);
    }
  };

  const updateUnreadCount = async (senderId: string) => {
    if (!userId) return;

    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('sender_id', senderId)
        .eq('read', false);

      if (error) throw error;

      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === senderId
            ? { ...contact, unread: count || 0 }
            : contact
        )
      );

    } catch (error) {
      console.error('Erreur lors de la mise à jour des compteurs:', error);
    }
  };

  const handleNewMessage = (newMsg: Message) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        ...newMsg,
        sender_name: newMsg.sender_id === userId ? userEmail : selectedContact?.name,
        receiver_name: newMsg.receiver_id === userId ? userEmail : selectedContact?.name
      }
    ]);
  };

  const sendMessage = async (content: string) => {
    if (!userId || !selectedContact) return;

    try {
      const message = {
        sender_id: userId,
        receiver_id: selectedContact.id,
        content,
      };

      const { data: newMsg, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;

      if (newMsg) {
        handleNewMessage(newMsg);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
  };

  return {
    messages,
    contacts,
    selectedContact,
    isLoading,
    messagesEndRef,
    handleSelectContact,
    setSelectedContact,
    sendMessage,
  };
};
