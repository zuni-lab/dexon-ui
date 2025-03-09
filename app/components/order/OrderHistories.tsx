"use client";

import { TOrder, dexonService } from "@/api/dexon";
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
import { ITEMS_PER_PAGE } from "@/constants/orders";
import { getTokenPairFromPath } from "@/utils/dex";
import { cn } from "@/utils/shadcn";
import { formatNumber, getForrmattedFullDate } from "@/utils/tools";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileSearch, Trash2 } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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

// Add pagination props to OrdersTable
const OrdersTable: IComponent<{
  orders?: TOrder[];
  value: OrderTab;
  cancelOrder: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({
  orders,
  value,
  cancelOrder,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (!orders) {
    return null;
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[38vh] flex-col items-center justify-center rounded-2xl py-2 text-white/40">
        <div>
          <FileSearch size={48} />
        </div>
        <div className="my-4">
          {value === "OPEN" ? "No open orders" : "No order history"}
        </div>
      </div>
    );
  }

  const condition = (orderType: OrderType, orderSide: OrderSide) =>
    orderType === "LIMIT"
      ? orderSide === "BUY"
        ? "<"
        : ">"
      : orderSide === "BUY"
        ? ">"
        : "<";

  return (
    <TabsContent value={value} className="mx-6 flex min-h-[38vh] flex-col pb-2">
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none font-semibold">
              <TableHead className="text-gray-400 text-sm">Date</TableHead>
              <TableHead className="text-gray-400 text-sm">Pair</TableHead>
              <TableHead className="text-gray-400 text-sm">Type</TableHead>
              <TableHead className="text-gray-400 text-sm">Side</TableHead>
              <TableHead className="text-center text-gray-400 text-sm">
                Amount
              </TableHead>
              <TableHead className="text-center text-gray-400 text-sm">
                Trigger price
              </TableHead>
              {value === "OPEN" ? (
                <TableHead className="text-center text-gray-400 text-sm">
                  Estimated Total
                </TableHead>
              ) : (
                <TableHead className="text-center text-gray-400 text-sm">
                  Actual Total
                </TableHead>
              )}
              {value === "OPEN" ? (
                <TableHead className="text-right text-gray-400 text-sm">
                  Cancel
                </TableHead>
              ) : (
                <TableHead className="text-right text-gray-400 text-sm">
                  Status
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="font-semibold">
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className={cn(
                  "border-gray-500 border-b-[1px] transition-colors hover:bg-secondary/50",
                  order.status === "CANCELLED" && "opacity-50",
                )}
              >
                <TableCell className="w-1/6">
                  {getForrmattedFullDate(order.createdAt)}
                </TableCell>
                <TableCell className="w-1/6">
                  {getTokenPairFromPath(order.paths)}
                </TableCell>
                <TableCell className={"capitalize"}>
                  <span className={"rounded px-2 py-1"}>
                    {order.type.toLowerCase()}
                  </span>
                </TableCell>
                <TableCell
                  className={cn(
                    "capitalize",
                    order.side === "BUY" ? "text-green-500" : "text-red-500",
                  )}
                >
                  {order.side.toLowerCase()}
                </TableCell>
                <TableCell className="text-center">
                  {`${formatNumber(order.amount)} ${
                    getTokenPairFromPath(order.paths).split("/")[0]
                  }`}
                </TableCell>
                <TableCell className="text-center">
                  {`${condition(order.type, order.side)} ${formatNumber(order.price)} USDC`}
                </TableCell>
                {value === "OPEN" ? (
                  <TableCell className="text-center">
                    {`${formatNumber(order.amount * order.price)} USDC`}
                  </TableCell>
                ) : (
                  <TableCell className="text-center">
                    {order.actualAmount
                      ? `${formatNumber(order.actualAmount)} USDC`
                      : "-"}
                  </TableCell>
                )}
                {value === "OPEN" ? (
                  <TableCell className="text-right">
                    <TooltipWrapper text="Cancel Order" side="right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-right text-white/70 hover:text-white"
                        onClick={() => cancelOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipWrapper>
                  </TableCell>
                ) : (
                  <TableCell
                    className={cn(
                      "capitalize",
                      // order.status === "CANCELLED" && "text-amber-500",
                    )}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <div>{order.status.toLowerCase()}</div>
                      {order.status !== "CANCELLED" && (
                        <Link
                          href={`https://testnet.monadexplorer.com/tx/${order.txHash}`}
                          target="_blank"
                        >
                          <ExternalLink size={20} className="ms-1 mb-1" />
                        </Link>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 w-8 text-white/70 hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 w-8 text-white/70 hover:text-white disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export const OrderHistories: IComponent<{ className?: string }> = ({
  className,
}) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [type, setType] = useState<OrderTab>("OPEN");

  const [openPage, setOpenPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const { data: openOrders } = useQuery({
    queryKey: ["orders", address, "OPEN", openPage],
    queryFn: () => {
      return dexonService.getOrders({
        wallet: address!,
        offset: (openPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        status: ["PENDING"],
      });
    },
    enabled: !!address,
    refetchInterval: 5000,
  });

  const { data: placedOrders } = useQuery({
    queryKey: ["orders", address, "HISTORY", historyPage],
    queryFn: () => {
      return dexonService.getOrders({
        wallet: address!,
        offset: (historyPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        notStatus: ["PENDING"],
      });
    },
    enabled: !!address,
    refetchInterval: 5000,
  });

  // Calculate total pages
  const openTotalPages = Math.ceil((openOrders?.total || 0) / ITEMS_PER_PAGE);
  const historyTotalPages = Math.ceil(
    (placedOrders?.total || 0) / ITEMS_PER_PAGE,
  );

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (type === "OPEN") {
      setOpenPage(page);
    } else {
      setHistoryPage(page);
    }
  };

  // Reset page when changing tabs
  useEffect(() => {
    if (type === "OPEN") {
      setOpenPage(1);
    } else {
      setHistoryPage(1);
    }
  }, [type]);

  const { mutateAsync: cancelOrder } = useMutation({
    mutationFn: async (orderId: number) => {
      if (!address) return;
      await dexonService.cancelOrder({
        orderId,
        wallet: address,
      });
    },
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

  if (!address) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-secondary bg-primary/60 py-2",
        className,
      )}
    >
      <Tabs
        defaultValue="OPEN"
        value={type}
        onValueChange={(value) => setType(value as OrderTab)}
      >
        <TabsList className="mx-4">
          <TabButton
            value="OPEN"
            label={`Open Orders (${openOrders?.total || 0})`}
          />
          <TabButton value="HISTORY" label="Order History" />
        </TabsList>
        <div className="h-[1px] w-full bg-gray-500" />
        {type === "OPEN" && (
          <OrdersTable
            orders={openOrders?.orders}
            value={type}
            cancelOrder={cancelOrder}
            currentPage={openPage}
            totalPages={openTotalPages}
            onPageChange={handlePageChange}
          />
        )}
        {type === "HISTORY" && (
          <OrdersTable
            orders={placedOrders?.orders}
            value={type}
            cancelOrder={cancelOrder}
            currentPage={historyPage}
            totalPages={historyTotalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Tabs>
    </div>
  );
};
