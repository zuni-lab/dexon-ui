interface Example {
  content: string;
}

const TRADING_EXAMPLES: Example[] = [
  {
    content: "Buy 1 ETH at market price",
  },
  {
    content: "Buy ETH when price is below $2000",
  },
  {
    content: "Sell ETH when price drops below $2200",
  },
  // {
  //   description: "Buy 10 ETH using TWAP in 1 hour",
  // },
];

interface ExampleCardsProps {
  onExampleClick: (example: string) => void;
}

export const ExampleCards: IComponent<ExampleCardsProps> = ({
  onExampleClick,
}) => (
  <div className="grid grid-cols-3 gap-3">
    {TRADING_EXAMPLES.map((example, index) => (
      <button
        type="button"
        key={index}
        onClick={() => onExampleClick(example.content)}
        tabIndex={0}
        className="cursor-pointer rounded-lg bg-purple3 p-3 transition-colors hover:bg-purple4/30 focus:outline-none focus:ring-2 focus:ring-purple4"
      >
        <p className="font-medium text-gray-100">{example.content}</p>
      </button>
    ))}
  </div>
);
