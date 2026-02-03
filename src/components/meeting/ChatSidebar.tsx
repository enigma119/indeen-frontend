'use client';

import { useState, useRef, useEffect } from 'react';
import { useDailyContext } from './DailyProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Send, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ChatSidebar({ isOpen, onClose, className }: ChatSidebarProps) {
  const { messages, sendMessage } = useDailyContext();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 w-full md:w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-50',
        'md:relative md:inset-y-auto',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white">Chat</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Aucun message</p>
            <p className="text-xs mt-1">Envoyez un message pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showSender =
                index === 0 ||
                messages[index - 1].sender_id !== message.sender_id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col',
                    message.is_local ? 'items-end' : 'items-start'
                  )}
                >
                  {showSender && (
                    <span className="text-xs text-gray-500 mb-1">
                      {message.is_local ? 'Vous' : message.sender_name}
                    </span>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                      message.is_local
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-800 text-white'
                    )}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs text-gray-600 mt-1">
                    {formatDistanceToNow(message.timestamp, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez un message..."
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            size="icon"
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
