import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/Tabs";
import { OrderRecords } from "@/constants/orders";
import { OrderWrapper } from "./OrderWrapper";

const TabButton: IComponent<{ value: OrderType; label: string }> = ({
  value,
  label,
}) => {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center justify-center rounded-lg px-4 py-3.5 font-semibold text-normal text-white capitalize data-[state=active]:bg-purple3"
    >
      {label}
    </TabsTrigger>
  );
};

const OrderContent: IComponent<{ value: OrderType }> = ({ value }) => {
  return (
    <TabsContent value={value} className="grow">
      <OrderWrapper type={value} />
    </TabsContent>
  );
};

export const TradingTabs: IComponent = () => {
  return (
    <Tabs defaultValue="MARKET" className="flex grow flex-col gap-3 p-6">
      <TabsList className="grid h-fit grid-cols-4 gap-1 rounded-xl bg-purple2 p-1">
        {Object.entries(OrderRecords).map(([key, value]) => (
          <TabButton key={key} value={key as OrderType} label={value} />
        ))}
      </TabsList>
      <OrderContent value="MARKET" />
      <OrderContent value="LIMIT" />
      <OrderContent value="STOP" />
    </Tabs>
  );
};
