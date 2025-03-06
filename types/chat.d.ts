interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
  created_at: number;
}

interface Thread {
  id: number;
  thread_id: string;
  user_address: string;
  thread_name: string;
  updated_at: number;
}

interface ThreadDetails {
  message: ChatMessage[];
  thread_id: string;
  thread_name: string;
  updated_at: number;
}
