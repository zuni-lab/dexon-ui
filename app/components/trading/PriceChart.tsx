export default function PriceChart() {
  return (
    <div className='h-[400px] relative'>
      {/* Y-axis labels */}
      <div className='absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400'>
        <div>6000</div>
        <div>4500</div>
        <div>3000</div>
        <div>1500</div>
        <div>0</div>
      </div>

      {/* X-axis labels */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400'>
        <div>Jan</div>
        <div>Feb</div>
        <div>Mar</div>
        <div>Apr</div>
        <div>May</div>
        <div>Jun</div>
        <div>Jul</div>
      </div>

      {/* Grid lines */}
      <div className='absolute inset-0 grid grid-cols-6 grid-rows-4'>
        {Array(24)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='border-gray-700 border-dashed border-r border-b' />
          ))}
      </div>

      {/* Stars */}
      <div className='absolute inset-0 pointer-events-none'>
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-white rounded-full animate-pulse'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
      </div>
    </div>
  );
}
