interface Example {
  title: string;
  description: string;
}

const TRADING_EXAMPLES: Example[] = [
  {
    title: 'Market Order',
    description: 'Buy 1 ETH at market price'
  },
  {
    title: 'Limit Order',
    description: 'Buy ETH when price is below $2000'
  },
  {
    title: 'Stop Order',
    description: 'Sell ETH when price drops below $2200'
  },
  {
    title: 'TWAP Order',
    description: 'Buy 10 ETH using TWAP in 1 hour'
  }
];

interface ExampleCardsProps {
  onExampleClick: (example: string) => void;
}

export const ExampleCards: IComponent<ExampleCardsProps> = ({ onExampleClick }) => (
  <div className='grid grid-cols-1 gap-3'>
    {TRADING_EXAMPLES.map((example) => (
      <div
        key={example.title}
        onClick={() => onExampleClick(example.description)}
        className='bg-purple4/20 p-3 rounded-lg cursor-pointer hover:bg-purple4/30 transition-colors'
      >
        <h2 className='font-medium mb-1 text-gray-200'>{example.title}</h2>
        <p className='text-sm text-gray-400'>{example.description}</p>
      </div>
    ))}
  </div>
);
