
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChatContact } from './types';

interface ContactsListProps {
  contacts: ChatContact[];
  isLoading: boolean;
  onSelectContact: (contact: ChatContact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  isLoading,
  onSelectContact
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h4 className="font-medium mb-2 text-sm text-gray-700">Vos contacts</h4>
      {contacts.length > 0 ? (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="p-2 rounded-md hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-2">
                  {contact.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.role === 'organizer' ? 'Organisateur' : 'Donateur'}</p>
                </div>
              </div>
              {(contact.unread && contact.unread > 0) && (
                <Badge variant="destructive" className="ml-2">{contact.unread}</Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Chargement des contacts...' : 'Aucun contact disponible'}
        </div>
      )}
    </div>
  );
};

export default ContactsList;
