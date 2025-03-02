import { Sidebar } from './components/Sidebar';
import { MainContent } from './content';
import { Health } from './content';
export default function ChatInterface() {
  return (
    <div className='flex h-screen bg-indigo-950 text-white'>
      <Sidebar />
      <Health />
      <MainContent />
    </div>
  );
}
