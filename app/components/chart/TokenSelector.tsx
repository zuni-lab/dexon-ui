import { Button } from "@/components/shadcn/Button";
import { TradeableTokensUI } from "@/constants/tokens";
import { useSelectedToken } from "@/state/token";
import { cn } from "@/utils/shadcn";

const TokenButton: IComponent<{
  icon: React.ReactNode;
  token: TokenKey;
  onClick?: () => void;
  selected: boolean;
}> = ({ icon, token, onClick, selected }) => {
  return (
    <Button
      className={cn(
        "flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-transparent px-4 py-2 transition-all duration-150 hover:bg-[#3a2b6a]",
        {
          "border-purple4 bg-purple3 backdrop-blur-lg": selected,
        },
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
    <div className="flex gap-2">
      {Object.entries(TradeableTokensUI).map(([token, { icon }]) => (
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
