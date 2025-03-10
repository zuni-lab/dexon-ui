export const validateOrderDetails = (order: OrderDetails) => {
  if (
    !order.trigger_condition ||
    !order.trigger_price ||
    !order.token_name ||
    !order.amount ||
    !order.order_side
  ) {
    throw new Error("Missing required fields");
  }

  if (!["<", ">", "="].includes(order.trigger_condition)) {
    throw new Error("Invalid trigger condition");
  }

  if (!/^\d+(\.\d+)?$/.test(order.trigger_price)) {
    throw new Error("Invalid trigger price");
  }

  if (!/^\d+(\.\d+)?$/.test(order.amount)) {
    throw new Error("Invalid amount");
  }

  if (!["BUY", "SELL"].includes(order.order_side)) {
    throw new Error("Invalid order side");
  }

  if (!["WBTC", "WETH", "WSOL"].includes(order.token_name)) {
    throw new Error("Invalid token name");
  }

  return true;
};

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

export function parseUnknownMessage(jsonString: string): {
  text: string | null;
  beAbleOrder?: boolean;
} {
  const trimmed = trimMessage(jsonString);
  try {
    const isOrder = trimmed.startsWith("{");
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

export const cleanupJsonString = (jsonString: string): string => {
  let cleanedString = jsonString;

  // Handle case where we have concatenated partial JSON objects
  if (jsonString.startsWith("{") && !jsonString.endsWith("}")) {
    cleanedString += "}";
  }

  // Fix common issues with quotes and syntax
  cleanedString = cleanedString
    // Fix cases where we have ": " (missing closing quote)
    .replace(/:\s*"([^"]*)(,|$)/g, ':"$1"$2')
    // Fix cases where we have missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
    // Fix double colons
    .replace(/::/g, ":")
    // Remove any stray quotes
    .replace(/"""/g, '"')
    .replace(/""/g, '"');

  // Attempt to validate and format JSON
  try {
    const parsed = JSON.parse(cleanedString);
    return JSON.stringify(parsed);
  } catch (e) {
    // If our fixes didn't work, return the original string
    console.warn("Couldn't cleanup JSON:", e);
    return jsonString;
  }
};

export const isValidJson = (str: string): boolean => {
  // Remove any potential Unicode BOM and whitespace
  const trimmed = str.trim().replace(/^\uFEFF/, "");

  // Basic JSON structure validation
  const jsonRegex = /^[\],:{}\s]*$/;

  return jsonRegex.test(
    trimmed
      .replace(/\\["\\\/bfnrtu]/g, "@")
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        "]",
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ""),
  );
};
