export function determineOrderType(order: OrderDetails): OrderType {
  if (order.trigger_condition === "=") {
    return "MARKET";
  }

  // For sell orders:
  // Stop Loss: triggers when price falls below (trigger_condition: '<')
  // Limit: triggers when price rises above (trigger_condition: '>')

  // For buy orders:
  // Stop Buy: triggers when price rises above (trigger_condition: '>')
  // Limit: triggers when price falls below (trigger_condition: '<')

  if (order.order_side === "SELL") {
    return order.trigger_condition === "<" ? "STOP" : "LIMIT";
  }
  return order.trigger_condition === ">" ? "STOP" : "LIMIT";
}

export function parseOrderDetails(jsonString: string): OrderDetails | null {
  try {
    const trimmed = trimMessage(jsonString);
    const order = JSON.parse(trimmed) as OrderDetails;
    const isValid = isValidOrderDetails(order);
    if (!isValid) {
      return null;
    }
    return order;
  } catch (_e) {
    return null;
  }
}

const beAbleOrderRegex = [
  "trigger_condition",
  "trigger_price",
  "token_name",
  "amount",
  "order_side",
];

export function parseUnknownMessage(jsonString: string): {
  text: string | null;
  beAbleOrder?: boolean;
} {
  const trimmed = trimMessage(jsonString);
  try {
    const isOrder = beAbleOrderRegex.some((key) => trimmed.includes(key));
    if (isOrder) {
      return {
        text: null,
        beAbleOrder: true,
      };
    }

    const message = JSON.parse(trimmed);
    if (message.error) {
      return {
        text: message.error,
        beAbleOrder: false,
      };
    }

    return {
      text: trimmed,
      beAbleOrder: false,
    };
  } catch (_e) {
    return {
      text: trimmed,
      beAbleOrder: false,
    };
  }
}

export const isValidOrderDetails = (order: OrderDetails) => {
  try {
    if (
      !order.trigger_condition ||
      !order.trigger_price ||
      !order.token_name ||
      !order.amount ||
      !order.order_side
    ) {
      return false;
    }
    return true;
  } catch (_e) {
    return false;
  }
};

const trimMessage = (jsonString: string) => {
  let trimmed = jsonString.trim();
  // Remove code block markers if present
  trimmed = trimmed.replace(/^```(json)?/, "");
  trimmed = trimmed.replace(/```$/, "");
  // Remove single backticks if present
  trimmed = trimmed.replace(/^`/, "");
  trimmed = trimmed.replace(/`$/, "");
  return trimmed;
};
