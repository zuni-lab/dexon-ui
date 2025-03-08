"use client";

import { dexonService } from "@/api/dexon";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/shadcn/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/Tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/Tooltip";
import { getTokenPairFromPath } from "@/utils/dex";
import { cn } from "@/utils/shadcn";
import { formatNumber, getForrmattedFullDate } from "@/utils/tools";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

type OrderTab = "OPEN" | "HISTORY";

const TabButton: IComponent<{ value: OrderTab; label: string }> = ({
  value,
  label,
}) => {
  return (
    <TabsTrigger
      value={value}
      className="mr-6 border-transparent border-t-2 border-b-2 px-0 py-2 font-semibold text-gray-400 capitalize data-[state=active]:border-b-white data-[state=active]:text-white"
    >
      {label}
    </TabsTrigger>
  );
};

const OrdersTable: IComponent<{
  value: OrderTab;
}> = ({ value }) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["orders", address, value],
    queryFn: () => {
      if (!address) throw new Error("Address is undefined");

      if (value === "OPEN") {
        return dexonService.getOrders({
          wallet: address,
          offset: 0,
          status: ["PENDING"],
        });
      }
      return dexonService.getOrders({
        wallet: address,
        offset: 0,
        notStatus: ["PENDING"],
      });
    },
  });
  const { mutate: cancelOrder } = useMutation({
    mutationFn: dexonService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", address, "OPEN"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders", address, "HISTORY"],
      });
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!address || !data) return null;

  if (data.orders.length === 0) {
    return (
      <TabsContent value={value} className="mx-6">
        <div className="py-4 text-center text-gray-400 text-sm">No orders</div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value={value} className="mx-6">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="text-gray-400 text-sm">Date</TableHead>
            <TableHead className="text-gray-400 text-sm">Pair</TableHead>
            <TableHead className="text-gray-400 text-sm">Type</TableHead>
            <TableHead className="text-gray-400 text-sm">Side</TableHead>
            <TableHead className="text-gray-400 text-sm">Amount</TableHead>
            <TableHead className="text-gray-400 text-sm">
              Trigger price
            </TableHead>
            <TableHead className="text-gray-400 text-sm">USDC Value</TableHead>
            {value === "OPEN" ? (
              <TableHead className="text-gray-400 text-sm">
                Cancel All
              </TableHead>
            ) : (
              <TableHead className="text-gray-400 text-sm">Status</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.orders.map((order) => (
            <TableRow
              key={order.id}
              className={cn(
                "border-gray-500 border-b-[1px] transition-colors hover:bg-secondary/50",
                // order.status === "CANCELLED" && "opacity-40",
              )}
            >
              <TableCell className="w-1/6">
                {getForrmattedFullDate(order.createdAt)}
              </TableCell>
              <TableCell className="w-1/6">
                {getTokenPairFromPath(order.paths)}
              </TableCell>
              <TableCell className="capitalize">
                {order.type.toLowerCase()}
              </TableCell>
              <TableCell
                className={cn(
                  "capitalize",
                  order.side === "BUY" ? "text-green-500" : "text-red-500",
                )}
              >
                {order.side.toLowerCase()}
              </TableCell>
              <TableCell>{formatNumber(order.amount)}</TableCell>
              <TableCell>${formatNumber(order.price)}</TableCell>
              <TableCell>${formatNumber(order.amount * order.price)}</TableCell>
              {value === "OPEN" ? (
                <TableCell>
                  <TooltipWrapper text="Cancel Order" side="right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-white/70 hover:text-white"
                      onClick={() =>
                        cancelOrder({ wallet: address, orderId: order.id })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipWrapper>
                </TableCell>
              ) : (
                <TableCell
                  className={cn(
                    "capitalize",
                    order.status === "CANCELLED" && "text-amber-500",
                  )}
                >
                  {order.status.toLowerCase()}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export const OrderTable: IComponent<{ className?: string }> = ({
  className,
}) => {
  const { address } = useAccount();
  if (!address) return null;

  return (
    <div
      className={cn(
        "min-h-[360px] rounded-2xl border border-secondary bg-primary py-2",
        className,
      )}
    >
      <Tabs defaultValue="OPEN">
        <TabsList className="mx-4">
          <TabButton value="OPEN" label="Open Orders" />
          <TabButton value="HISTORY" label="History Orders" />
        </TabsList>
        <div className="h-[1px] w-full bg-gray-500" />
        <OrdersTable value="OPEN" />
        <OrdersTable value="HISTORY" />
      </Tabs>
    </div>
  );
};
