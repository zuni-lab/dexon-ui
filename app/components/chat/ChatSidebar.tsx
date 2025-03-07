'use client';

import { chatService } from '@/api/chat';
import { Button } from '@/components/shadcn/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/Popover';
import { cn } from '@/utils/shadcn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Bot, ChevronLeft, History, MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ThreadDetails } from './ThreadDetails';

interface ChatSidebarProps {
  className?: string;
  onClose?: () => void;
}

export const ChatSidebar: IComponent<ChatSidebarProps> = ({ onClose, className }) => {
  const { address } = useAccount();
  const [showHistory, setShowHistory] = useState(false);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const queryClient = useQueryClient();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Query for threads list
  const { data: threadsResponse } = useQuery({
    queryKey: ['chat', 'threads', address],
    queryFn: async () => {
      return chatService.listThreads({
        user_address: address!,
        offset: 0,
        limit: 10
      });
    },
    enabled: !!address
  });

  // Query for current thread details
  const { data: threadDetails, isLoading } = useQuery({
    queryKey: ['chat', 'thread', currentThread?.thread_id, address],
    queryFn: async () => {
      if (!currentThread || !address) return null;
      return chatService.getThreadDetails({
        thread_id: currentThread.thread_id,
        user_address: address
      });
    },
    enabled: !!currentThread && !!address
  });

  const threads = threadsResponse?.data || [];
  const messages = threadDetails?.message || [];

  // Load latest thread on initial load
  useEffect(() => {
    if (threads.length > 0 && !currentThread) {
      setCurrentThread(threads[0]);
    }
  }, [threads]);

  const handleSelectThread = useCallback(async (thread: Thread) => {
    setCurrentThread(thread);
    setShowHistory(false);
    await queryClient.invalidateQueries({
      queryKey: ['chat', 'thread', thread.thread_id, address]
    });
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!address || !currentThread) return;

    try {
      await chatService.sendMessage({
        message,
        threadId: currentThread.thread_id,
        userAddress: address
      });

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ['chat', 'threads', address]
      });
      await queryClient.invalidateQueries({
        queryKey: ['chat', 'thread', currentThread.thread_id, address]
      });
    } catch (error) {}
  };

  const handleNewChat = useCallback(() => {
    setCurrentThread(null);
    setIsHistoryOpen(false);
    // Clear messages for new chat
    queryClient.setQueryData(['chat', 'thread', currentThread?.thread_id, address], null);
  }, [currentThread?.thread_id, address, queryClient]);

  return (
    <>
      <div
        className={cn(
          'w-96 bg-purple2 border-l border-purple3 z-50 flex flex-col rounded-l-xl overflow-hidden my-[2px]',
          className
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-purple3 bg-purple1'>
          <div className='flex items-center gap-2'>
            {showHistory && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowHistory(false)}
                className='text-gray-300 hover:bg-purple4/20'
              >
                <ChevronLeft className='w-5 h-5' />
              </Button>
            )}
            <h2 className='text-gray-200 font-semibold flex items-center gap-2 text-center'>
              Zuni Assistant
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleNewChat}
              className='text-gray-300 hover:bg-purple4/20'
            >
              <Plus className='w-5 h-5' />
            </Button>
            {!showHistory && threads.length > 0 && (
              <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <PopoverTrigger asChild>
                  <Button variant='ghost' size='icon' className='text-gray-300 hover:bg-purple4/20'>
                    <History className='w-5 h-5' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-80 p-0 bg-purple1 border-purple3 text-white'
                  align='end'
                  sideOffset={5}
                >
                  <div className='p-4 border-b border-purple3'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2 text-gray-300 hover:bg-purple3/30'
                      onClick={() => {
                        handleNewChat();
                        setIsHistoryOpen(false);
                      }}
                    >
                      <Plus className='w-4 h-4' />
                      New Chat
                    </Button>
                  </div>
                  <div className='flex flex-col gap-2 max-h-[600px] overflow-y-auto p-4'>
                    {threads.map((thread) => (
                      <div
                        key={thread.thread_id}
                        onClick={() => {
                          handleSelectThread(thread);
                          setIsHistoryOpen(false);
                        }}
                        className={cn(
                          'flex items-center gap-3 p-3 hover:bg-purple3/30 rounded-lg cursor-pointer group',
                          {
                            'border border-purple4': currentThread?.thread_id === thread.thread_id
                          }
                        )}
                      >
                        <MessageSquare className='w-4 h-4 text-gray-300 flex-shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-white text-sm font-medium truncate'>{thread.thread_name}</p>
                          <p className='text-xs text-gray-400'>
                            {format(thread.updated_at * 1000, 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400'
                          onClick={(e) => {
                            e.stopPropagation();
                            // handle delete
                          }}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant='ghost'
              size='icon'
              className='text-gray-300 hover:bg-purple4/20'
              onClick={onClose}
            >
              <X className='w-5 h-5' />
            </Button>
          </div>
        </div>

        <ThreadDetails
          thread={currentThread}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
};
