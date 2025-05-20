import React from 'react';
import { EnhancedMessage } from './types';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  if (!user) {
    return <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isMine = msg.sender_id === user.id;
            return (
              <div 
                key={msg.id} 
                className={`flex items-end ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar (seulement côté messages reçus) */}
                {!isMine && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold uppercase">
                      {msg.sender_name ? msg.sender_name.charAt(0) : '?'}
                    </div>
                  </div>
                )}

                <div className="max-w-[70%]">
                  {/* Nom expéditeur (si message reçu) */}
                  {!isMine && (
                    <div className="text-xs font-semibold text-indigo-600 mb-0.5">
                      {msg.sender_name || 'Utilisateur'}
                    </div>
                  )}

                  {/* Bulle message */}
                  <div className={`
                    px-4 py-2 rounded-xl shadow
                    ${isMine ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}
                    relative
                  `}>
                    {msg.content}

                    {/* Heure */}
                    <div className={`text-[10px] mt-1 ${isMine ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Coche "vu" si message envoyé et lu */}
                    {isMine && msg.read && (
                      <div className="absolute bottom-1 right-1 text-indigo-300 text-xs select-none" title="Lu">
                        ✓✓
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Chargement des messages...' : 'Aucun message échangé'}
        </div>
      )}
    </div>
  );
};

export default MessagesList;
