'use client';

import { Button } from '@/components/shadcn/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/DropdownMenu';
import { Input } from '@/components/shadcn/Input';
import { cn } from '@/utils/shadcn';
import { ChevronLeft, Edit2, MessageSquare, MoreVertical, Plus, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface Chat {
  id: string;
  title: string;
  messages: Array<{ text: string; isUser: boolean }>;
}

interface ChatSidebarProps {
  onClose: () => void;
  className?: string;
}

export const ChatSidebar: IComponent<ChatSidebarProps> = ({ onClose, className }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showChatList, setShowChatList] = useState(true);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      messages: []
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    setShowChatList(false);
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
      setShowChatList(true);
    }
  };

  const startRenaming = (chat: Chat) => {
    setIsRenaming(chat.id);
    setNewTitle(chat.title);
  };

  const handleRename = (chatId: string) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat)));
    setIsRenaming(null);
  };

  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-screen w-80 bg-purple2 border-l border-purple3 z-50 animate-in slide-in-from-right duration-300',
        className
      )}
    >
      <div className='flex flex-col h-full'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-purple3'>
          {!showChatList && currentChat && (
            <Button variant='ghost' size='icon' onClick={() => setShowChatList(true)} className='mr-2'>
              <ChevronLeft className='w-5 h-5' />
            </Button>
          )}
          <div className='flex items-center gap-2 text-purple4'>
            <MessageSquare className='w-5 h-5' />
            <span className='font-semibold'>{showChatList ? 'Chats' : currentChat?.title || 'New Chat'}</span>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={createNewChat}
              className='text-purple4 hover:text-white hover:bg-purple4/20'
            >
              <Plus className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='text-purple4 hover:text-white hover:bg-purple4/20'
            >
              <X className='w-5 h-5' />
            </Button>
          </div>
        </div>

        {/* Chat List or Current Chat */}
        {showChatList ? (
          <div className='flex-1 overflow-y-auto p-2'>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className='flex items-center justify-between p-3 hover:bg-purple3/30 rounded-lg cursor-pointer group'
                onClick={() => {
                  setCurrentChat(chat);
                  setShowChatList(false);
                }}
              >
                <div className='flex items-center gap-2'>
                  <MessageSquare className='w-4 h-4 text-purple4' />
                  {isRenaming === chat.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRename(chat.id);
                      }}
                    >
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className='h-6 py-1 px-2 text-sm'
                        autoFocus
                      />
                    </form>
                  ) : (
                    <span>{chat.title}</span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='opacity-0 group-hover:opacity-100 h-8 w-8'>
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => startRenaming(chat)}>
                      <Edit2 className='w-4 h-4 mr-2' />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteChat(chat.id)} className='text-red-500'>
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            {chats.length === 0 && (
              <div className='text-center text-purple4/60 mt-8'>
                <p>No chats yet</p>
                <Button
                  variant='ghost'
                  onClick={createNewChat}
                  className='mt-2 text-purple4 hover:text-white'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Create new chat
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ChatMessages chat={currentChat} />
        )}
      </div>
    </div>
  );
};

// Separate component for chat messages
const ChatMessages: IComponent<{ chat: Chat | null }> = ({ chat }) => {
  const [input, setInput] = useState('');

  if (!chat) return null;

  return (
    <>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.isUser ? 'ml-auto bg-purple4' : 'mr-auto bg-purple3'
            } max-w-[80%] rounded-lg p-3 text-white`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className='p-4 border-t border-purple3'>
        <form className='relative'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your trading command...'
            className='pr-10 bg-purple3/50 border-purple4/50 text-white placeholder-purple4/50'
          />
          <Button
            type='submit'
            variant='ghost'
            size='icon'
            className='absolute right-2 top-1/2 -translate-y-1/2 text-purple4 hover:text-white hover:bg-purple4/20'
          >
            <Send className='w-4 h-4' />
          </Button>
        </form>
      </div>
    </>
  );
};
