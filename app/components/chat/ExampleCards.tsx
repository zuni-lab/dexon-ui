interface Example {
  title: string;
  description: string;
}

const TRADING_EXAMPLES: Example[] = [
  {
    title: "Market Order",
    description: "Buy 1 ETH at market price",
  },
  {
    title: "Limit Order",
    description: "Buy ETH when price is below $2000",
  },
  {
    title: "Stop Order",
    description: "Sell ETH when price drops below $2200",
  },
  // {
  //   title: "TWAP Order",
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
    {TRADING_EXAMPLES.map((example) => (
      <button
        type="button"
        key={example.title}
        onClick={() => onExampleClick(example.description)}
        tabIndex={0}
        className="cursor-pointer rounded-lg bg-purple4/20 p-3 transition-colors hover:bg-purple4/30 focus:outline-none focus:ring-2 focus:ring-purple4"
      >
        <h2 className="mb-1 font-medium text-gray-200">{example.title}</h2>
        <p className="text-gray-400 text-sm">{example.description}</p>
      </button>
    ))}
  </div>
);
