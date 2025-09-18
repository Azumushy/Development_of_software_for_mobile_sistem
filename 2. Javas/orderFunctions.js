// orderFunctions.js

import { orders } from "./data.js";

// получение заказов пользователя
export function getUserOrders(userId) {
  return orders.filter(order => order.userId === userId);
}

// добавление товара в заказ
export function addProductToOrder(orderId, newProduct) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;
  order.products = [...order.products, newProduct];
  return order;
}

// получение сводки по заказуn
export function getOrderSummary(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const { products, total, status, userId } = order;
  return {
    productsCount: products.length,
    total: `$${total.toFixed(2)}`,
    status: status.toUpperCase(),
    userId
  };
}
