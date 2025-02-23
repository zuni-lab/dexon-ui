export function determineOrderType(order: OrderDetails): OrderType {
  if (order.trigger_condition === '=') {
    return 'market';
  }

  // For sell orders:
  // Stop Loss: triggers when price falls below (trigger_condition: '<')
  // Limit: triggers when price rises above (trigger_condition: '>')

  // For buy orders:
  // Stop Buy: triggers when price rises above (trigger_condition: '>')
  // Limit: triggers when price falls below (trigger_condition: '<')

  if (order.order_side === 'sell') {
    return order.trigger_condition === '<' ? 'stop' : 'limit';
  }
  return order.trigger_condition === '>' ? 'stop' : 'limit';
}

export function parseOrderDetails(jsonString: string): OrderDetails | null {
  try {
    let trimmed = jsonString.trim();
    // Remove code block markers if present
    trimmed = trimmed.replace(/^```(json)?/, '');
    trimmed = trimmed.replace(/```$/, '');
    // Remove single backticks if present
    trimmed = trimmed.replace(/^`/, '');
    trimmed = trimmed.replace(/`$/, '');

    const order = JSON.parse(trimmed) as OrderDetails;
    return order;
  } catch (e) {
    return null;
  }
}
