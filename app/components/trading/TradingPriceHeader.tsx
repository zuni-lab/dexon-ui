export default function TradingPriceHeader() {
  return (
    <div className='flex justify-between mb-4'>
      <div>
        <div className='text-2xl font-bold'>$170.07</div>
        <div className='text-red-500 text-sm'>-0.93%</div>
      </div>
      <div className='text-right'>
        <div className='text-gray-400 text-xs'>Borrow Rate</div>
        <div className='text-sm'>0.0034% /hr</div>
        <div className='text-gray-400 text-xs mt-1'>Available Liq</div>
        <div className='text-sm'>$2.50M</div>
      </div>
    </div>
  );
}
