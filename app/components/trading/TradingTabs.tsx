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

export const TradingTabs: IComponent = () => {
  return (
    <Tabs defaultValue='market' className='p-6 grow'>
      <TabsList className='grid grid-cols-4 bg-purple2 mb-3 p-1 gap-1 rounded-xl h-fit'>
        {Object.entries(OrderRecords).map(([key, value]) => (
          <TabButton key={key} value={key as OrderType} label={value} />
        ))}
      </TabsList>
      <TabsContent value='market'>
        <OrderWrapper type='market' />
      </TabsContent>
      <TabsContent value='limit'>
        <OrderWrapper type='limit' />
      </TabsContent>
      <TabsContent value='stop'>
        <OrderWrapper type='stop' />
      </TabsContent>
    </Tabs>
  );
};
