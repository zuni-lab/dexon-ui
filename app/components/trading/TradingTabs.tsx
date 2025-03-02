import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/Tabs';
import { OrderRecords } from '@/constants/orders';
import { OrderWrapper } from './OrderWrapper';

const TabButton: IComponent<{ value: OrderType; label: string }> = ({ value, label }) => {
  return (
    <TabsTrigger
      value={value}
      className='data-[state=active]:bg-purple3 text-white font-semibold text-normal px-4 py-3.5 rounded-lg flex items-center justify-center capitalize'
    >
      {label}
    </TabsTrigger>
  );
};

const OrderContent: IComponent<{ value: OrderType }> = ({ value }) => {
  return (
    <TabsContent value={value} className='grow'>
      <OrderWrapper type={value} />
    </TabsContent>
  );
};

export const TradingTabs: IComponent = () => {
  return (
    <Tabs defaultValue='market' className='p-6 grow gap-3 flex flex-col'>
      <TabsList className='grid grid-cols-4 bg-purple2 p-1 gap-1 rounded-xl h-fit'>
        {Object.entries(OrderRecords).map(([key, value]) => (
          <TabButton key={key} value={key as OrderType} label={value} />
        ))}
      </TabsList>
      <OrderContent value='market' />
      <OrderContent value='limit' />
      <OrderContent value='stop' />
    </Tabs>
  );
};
