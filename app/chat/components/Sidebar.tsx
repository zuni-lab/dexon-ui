import { Button } from '@/components/shadcn/Button';
import {
  AlertOctagon,
  ArrowRightLeft,
  FileQuestion,
  LineChart,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  Sun,
  User,
  Wallet
} from 'lucide-react';

const CHAT_HISTORY_ITEMS = [
  { title: 'Market Orders', icon: <LineChart className='mr-2 h-4 w-4' /> },
  { title: 'Limit Orders', icon: <ArrowRightLeft className='mr-2 h-4 w-4' /> },
  { title: 'Stop Orders', icon: <AlertOctagon className='mr-2 h-4 w-4' /> }
];

const FOOTER_ITEMS = [
  {
    icon: <Wallet className='mr-2 h-4 w-4 group-hover:text-purple4' />,
    label: 'Connect Wallet'
  },
  {
    icon: <Settings className='mr-2 h-4 w-4 group-hover:text-purple4' />,
    label: 'Trading Settings'
  },
  {
    icon: <FileQuestion className='mr-2 h-4 w-4 group-hover:text-purple4' />,
    label: 'Trading Guide'
  }
];

const NewChatButton = () => (
  <div className='p-4'>
    <Button className='w-full bg-indigo-500 text-white hover:bg-indigo-600 font-medium transition-colors'>
      <MessageSquarePlus className='mr-2 h-4 w-4' />
      New chat
    </Button>
  </div>
);

const ChatHistory = () => (
  <div className='flex-1 overflow-auto'>
    <div className='px-3 py-2'>
      <div className='space-y-1.5'>
        {CHAT_HISTORY_ITEMS.map((item, index) => (
          <Button
            key={index}
            variant='ghost'
            className='w-full justify-start text-sm hover:bg-indigo-800/50 transition-colors'
          >
            <MessageSquare className='mr-2 h-4 w-4' />
            {item.title}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

const SidebarFooter = () => (
  <div className='border-t border-indigo-800/40 p-3 space-y-1.5'>
    {FOOTER_ITEMS.map((item, index) => (
      <Button
        key={index}
        variant='ghost'
        className='w-full justify-start text-sm hover:bg-indigo-800/50 group'
      >
        {item.icon}
        {item.label}
      </Button>
    ))}
  </div>
);

export const Sidebar = () => (
  <div className='w-[280px] border-r border-indigo-800/40 flex flex-col bg-indigo-900/50'>
    <NewChatButton />
    <ChatHistory />
    <SidebarFooter />
  </div>
);
