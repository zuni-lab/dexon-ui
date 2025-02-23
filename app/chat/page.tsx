import ConnectWallet from '../ConnectWallet';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './content';

export default function ChatInterface() {
  return (
    <div className='flex h-screen bg-indigo-950 text-white'>
      <ConnectWallet />

      <Sidebar />
      <MainContent />
    </div>
  );
}
