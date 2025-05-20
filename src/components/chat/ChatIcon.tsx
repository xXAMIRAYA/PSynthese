import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

const ChatIcon = ({ onOpenChat, unreadCount }) => {
  return (
    <div className="fixed bottom-4 right-4">
      <Button
        onClick={onOpenChat}
        variant="default"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle size={24} />
        {unreadCount !== undefined && unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </Button>
    </div>
  );
};

export default ChatIcon;