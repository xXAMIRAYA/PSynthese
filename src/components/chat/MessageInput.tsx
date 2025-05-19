import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EnhancedMessage } from './types';

interface MessagesListProps {
  messages: EnhancedMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isLoading,
  messagesEndRef
}) => {
  const [currentUser, setCurrentUser] = React.useState<{ id: string } | null>(null);
  
  React.useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUser({ id: data.session.user.id });
      }
    };
    
    getUser();
  }, []);
  
  if (!currentUser) {
    return <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
      Chargement...
    </div>;
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length > 0 ? (
        <div className="space-y-2">
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUser.id;
            
            return (
              <div 
                key={msg.id} 
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    isMine 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                  <div className={`text-xs mt-1 ${isMine ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Chargement des messages...' : 'Aucun message'}
        </div>
      )}
    </div>
  );
};

export default MessagesList;