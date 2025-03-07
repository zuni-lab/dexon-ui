import { format } from 'date-fns';

import { determineOrderType } from '@/utils/order';
import { cn } from '@/utils/shadcn';

const orderTypeColors: Record<OrderType, string> = {
  market: 'bg-blue-500/90',
  limit: 'bg-green-500/90',
  stop: 'bg-red-500/90',
  twap: 'bg-purple-500/90'
};

export const OrderPreview: IComponent<{ order: OrderDetails; timestamp: number }> = ({
  order,
  timestamp
}) => {
  const orderType = determineOrderType(order);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number.parseFloat(order.trigger_price));

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  }).format(Number.parseFloat(order.amount));

  return (
    <div className='space-y-4'>
      <div className='bg-purple4/40 rounded-2xl px-4 py-2 font-medium'>
        This is a preview of your order. Please review before confirming.
      </div>
      <div className='border rounded-2xl p-4 font-medium space-y-2'>
        <div className='flex items-center gap-2'>
          <span
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-semibold text-white',
              orderTypeColors[orderType]
            )}
          >
            {orderType.toUpperCase()}
          </span>
          <span
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-semibold',
              order.order_side === 'buy' ? 'bg-green-600' : 'bg-red-600'
            )}
          >
            {order.order_side.toUpperCase()}
          </span>
          <span className='ml-auto text-lg font-medium'>{order.token_name}</span>
        </div>
        <div className='space-y-2 [&>h2]:text-xl [&>h2]:font-medium [&_span]:ml-auto'>
          <div className='flex items-center'>
            <h2>Price</h2>
            <span>{formattedPrice}</span>
          </div>
          <div className='flex items-center'>
            <h2>Amount</h2>
            <span>
              {formattedAmount} {order.token_name}
            </span>
          </div>
          <div className='flex items-center'>
            <h2>Trigger</h2>
            <span>
              Price {order.trigger_condition} {formattedPrice}
            </span>
          </div>
        </div>
        <div className='mt-6 pt-3'>
          <span className='text-sm'>{format(timestamp * 1000, 'HH:mm')}</span>
        </div>
      </div>
    </div>
  );
};
