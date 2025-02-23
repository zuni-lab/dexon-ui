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
  <div className='p-6 bg-indigo-900/30 border-t border-indigo-800/40'>
    <div className='max-w-4xl mx-auto'>
      <form onSubmit={onSubmit} className='relative'>
        <Input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? 'AI is thinking...' : 'Type your message...'}
          disabled={isLoading}
          className='w-full bg-indigo-900/50 border border-indigo-700/50 rounded-xl py-4 pl-4 pr-20 text-white placeholder-indigo-300/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50'
        />
        <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2'>
          <Button
            type='submit'
            variant='ghost'
            size='icon'
            disabled={isLoading}
            className='h-9 w-9 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-800/50 rounded-lg transition-colors disabled:opacity-50'
          >
            <Send className='h-5 w-5' />
          </Button>
        </div>
      </form>
    </div>
  </div>
);
