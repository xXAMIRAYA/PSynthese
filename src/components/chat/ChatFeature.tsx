// import React, { useState, useEffect } from 'react';
// import { supabase } from "@/integrations/supabase/client";
// import ChatIcon from './ChatIcon';
// import ChatWindow from './ChatWindow';
// import { toast } from '@/components/ui/sonner';
// import { useAuth } from '@/contexts/AuthContext'; // Importez votre contexte d'authentification

// const ChatFeature: React.FC = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { user } = useAuth(); // Utilisez le contexte d'authentification

//   useEffect(() => {
//     if (!user?.id) return;

//     // Récupérer le nombre de messages non lus
//     const fetchUnreadCount = async () => {
//       try {
//         const { count, error } = await supabase
//           .from('messages')
//           .select('id', { count: 'exact' })
//           .eq('receiver_id', user.id)
//           .eq('read', false);

//         if (error) throw error;
//         if (count !== null) setUnreadCount(count);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des messages non lus:", error);
//       }
//     };

//     fetchUnreadCount();

//     // Écouter les nouveaux messages
//     const subscription = supabase
//       .channel('messages')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//           filter: `receiver_id=eq.${user.id}`,
//         },
//         (payload) => {
//           const newMessage = payload.new as any;

//           if (!newMessage.read) {
//             setUnreadCount((prev) => prev + 1);
            
//             if (!isChatOpen) {
//               toast.info("Nouveau message reçu", {
//                 description: "Cliquez sur l'icône de chat pour voir vos messages"
//               });
//             }
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [user?.id, isChatOpen]);

//   const handleOpenChat = () => {
//     if (!user) {
//       toast.error("Veuillez vous connecter pour utiliser le chat");
//       return;
//     }
//     setIsChatOpen(true);
//   };

//   const handleCloseChat = async () => {
//     setIsChatOpen(false);

//     if (user?.id) {
//       try {
//         await supabase
//           .from('messages')
//           .update({ read: true })
//           .eq('receiver_id', user.id)
//           .eq('read', false);

//         setUnreadCount(0);
//       } catch (error) {
//         console.error("Erreur lors de la mise à jour des messages:", error);
//       }
//     }
//   };

//   return (
//     <>
//       <ChatIcon onOpenChat={handleOpenChat} unreadCount={user ? unreadCount : undefined} />
//       {isChatOpen && user && <ChatWindow onClose={handleCloseChat} />}
//     </>
//   );
// };

// export default ChatFeature;
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const ChatFeature: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [users, setUsers] = useState([]); // utilisateurs disponibles pour discuter

  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (error) throw error;
        if (count !== null) setUnreadCount(count);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages non lus:", error);
      }
    };

    fetchUnreadCount();

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (!newMessage.is_read) {
            setUnreadCount((prev) => prev + 1);
            if (!isChatOpen) {
              toast.info("Nouveau message reçu", {
                description: "Cliquez sur l'icône de chat pour voir vos messages"
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id, isChatOpen]);

  // 🔄 Charger les utilisateurs opposés au rôle connecté
  useEffect(() => {
    const fetchUsersToChatWith = async () => {
      if (!profile?.role) return;

      const oppositeRole = profile.role === 'responsable' ? 'donator' : 'responsable';

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .eq('role', oppositeRole);

      if (error) {
        console.error("Erreur de chargement des utilisateurs :", error);
      } else {
        setUsers(data);
      }
    };

    if (isChatOpen) {
      fetchUsersToChatWith();
    }
  }, [isChatOpen, profile?.role]);

  const handleOpenChat = () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour utiliser le chat");
      return;
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = async () => {
    setIsChatOpen(false);
    if (user?.id) {
      try {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', user.id)
          .eq('read', false);
        setUnreadCount(0);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des messages:", error);
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[1000]">
        <ChatIcon onOpenChat={handleOpenChat} unreadCount={user ? unreadCount : undefined} />
      </div>
      {isChatOpen && user && <ChatWindow onClose={handleCloseChat} />}
    </>
  );
};

export default ChatFeature;
