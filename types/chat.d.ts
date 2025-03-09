type ChatRole = "assistant" | "user";

interface ChatMessage {
  role: ChatRole;
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
  messages: ChatMessage[];
  thread_id: string;
  thread_name: string;
  updated_at: number;
}
