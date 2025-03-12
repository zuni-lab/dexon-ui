interface Example {
  key: string;
  content: string;
}

const TRADING_EXAMPLES: Example[] = [
  {
    key: "buy-eth-market",
    content: "Buy 1 ETH at market price",
  },
  {
    key: "buy-eth-limit",
    content: "Buy 1 ETH when price is below $2000",
  },
  {
    key: "sell-eth-stop",
    content: "Sell 1 ETH when price drops below $2200",
  },
  {
    key: "buy-eth-twap",
    content: "Buy 10 ETH using TWAP by 10 orders every half a day",
  },
];

interface ExampleCardsProps {
  onExampleClick: (example: string) => void;
}

export const ExampleCards: IComponent<ExampleCardsProps> = ({
  onExampleClick,
}) => (
  <div className="grid grid-cols-2 gap-3">
    {TRADING_EXAMPLES.map((example) => (
      <button
        type="button"
        key={example.key}
        onClick={() => onExampleClick(example.content)}
        tabIndex={0}
        className="cursor-pointer rounded-lg bg-purple3 p-3 transition-colors hover:bg-purple4/30 focus:outline-none focus:ring-2 focus:ring-purple4"
      >
        <p className="font-medium text-gray-100">{example.content}</p>
      </button>
    ))}
  </div>
);
