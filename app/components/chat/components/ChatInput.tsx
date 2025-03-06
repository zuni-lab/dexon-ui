import { Button } from '@/components/shadcn/Button';
import { Input } from '@/components/shadcn/Input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const ChatInput: IComponent<ChatInputProps> = ({ input, isLoading, onChange, onSubmit }) => (
  <div className='p-4 border-t border-purple3 bg-purple1'>
    <form onSubmit={onSubmit} className='relative'>
      <Input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLoading ? 'Processing...' : 'Type your trading command...'}
        disabled={isLoading}
        className='pr-12 py-6 bg-purple2 border-purple3 text-white placeholder-white/50 rounded-xl text-[17px]'
      />
      <Button
        type='submit'
        disabled={isLoading}
        className='absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple4/20 hover:bg-purple4/30 text-white'
      >
        <Send className='w-5 h-5' />
      </Button>
    </form>
  </div>
);
