import { Button } from '@/components/shadcn/Button';
import { TradeableTokens } from '@/constants/tokens';
import { useSelectedToken } from '@/state/token';
import { cn } from '@/utils/shadcn';

const TokenButton: IComponent<{
  icon: React.ReactNode;
  token: TradeableToken;
  onClick: () => void;
  selected: boolean;
}> = ({ icon, token, onClick, selected }) => {
  return (
    <Button
      className={cn(
        'rounded-full hover:bg-[#3a2b6a] flex items-center justify-center gap-2 px-4 py-2 border-2 border-transparent transition-all duration-150 cursor-pointer',
        {
          'border-purple4 bg-purple3 backdrop-blur-lg': selected
        }
      )}
      onClick={onClick}
    >
      {icon}
      <span>{token}</span>
    </Button>
  );
};

export const TokenSelector: IComponent = () => {
  const { token: selectedToken, setToken } = useSelectedToken();
  return (
    <div className='flex gap-2'>
      {Object.entries(TradeableTokens).map(([token, { icon }]) => (
        <TokenButton
          key={token}
          icon={icon}
          token={token as TradeableToken}
          onClick={() => setToken(token as TradeableToken)}
          selected={selectedToken === token}
        />
      ))}
    </div>
  );
};
