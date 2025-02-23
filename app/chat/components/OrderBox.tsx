import { determineOrderType } from '@/utils/order';

const orderTypeColors = {
  market: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  limit: 'bg-green-500/20 border-green-500/50 text-green-300',
  stop: 'bg-red-500/20 border-red-500/50 text-red-300'
};

const orderTypeBadgeColors = {
  market: 'bg-blue-500/30 text-blue-200',
  limit: 'bg-green-500/30 text-green-200',
  stop: 'bg-red-500/30 text-red-200'
};

export function OrderBox({ order }: { order: OrderDetails }) {
  const orderType = determineOrderType(order);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number.parseFloat(order.trigger_price));

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  }).format(Number.parseFloat(order.amount));

  return (
    <div className={`rounded-lg border p-4 ${orderTypeColors[orderType]}`}>
      <div className='flex justify-between items-start mb-3'>
        <div className='flex items-center gap-2'>
          <span className={`px-2 py-1 rounded text-xs font-medium ${orderTypeBadgeColors[orderType]}`}>
            {orderType.toUpperCase()}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              order.order_side === 'buy' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
            }`}
          >
            {order.order_side.toUpperCase()}
          </span>
        </div>
        <div className='text-sm opacity-80'>{order.token_name}</div>
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between'>
          <span className='text-sm opacity-70'>Price</span>
          <span className='font-medium'>${formattedPrice}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-sm opacity-70'>Amount</span>
          <span className='font-medium'>
            {formattedAmount} {order.token_name}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-sm opacity-70'>Trigger</span>
          <span className='font-medium'>
            Price {order.trigger_condition} ${formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
