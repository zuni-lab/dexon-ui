import { Button } from '@/components/shadcn/Button';
import { Input } from '@/components/shadcn/Input';
import { Send } from 'lucide-react';
import type { FormEvent } from 'react';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export const InputArea = ({ input, setInput, onSubmit, isLoading }: InputAreaProps) => (
  <div className='p-6 bg-purple2 border-t border-purple3'>
    <div className='max-w-4xl mx-auto'>
      <form onSubmit={onSubmit} className='relative'>
        <Input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? 'AI is thinking...' : 'Type your trading command (e.g., "Buy 1 ETH")'}
          disabled={isLoading}
          className='w-full bg-purple3/50 border border-purple4/50 rounded-xl py-4 pl-4 pr-20 text-white placeholder-purple4/50 focus:border-purple4 focus:ring-2 focus:ring-purple4/20 transition-all disabled:opacity-50'
        />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2'>
          <Button
            type='submit'
            variant='ghost'
            size='icon'
            disabled={isLoading}
            className='h-9 w-9 text-purple4 hover:text-white hover:bg-purple4/20 rounded-lg transition-colors disabled:opacity-50'
          >
            <Send className='h-5 w-5' />
          </Button>
        </div>
      </form>
    </div>
  </div>
);
