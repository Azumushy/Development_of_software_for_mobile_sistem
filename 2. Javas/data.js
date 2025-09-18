// data.js

export const users = [
  { id: 1, name: "Кристина", email: "kristina@yandex.ru", isActive: true },
  { id: 2, name: "Миша", email: "misha@yandex.ru", isActive: false },
  { id: 3, name: "Рома", email: "roma@yandex.ru", isActive: true }
];

export const orders = [
  { id: 101, userId: 1, products: ["Книга", "Ручка"], total: 15.50, status: "отправлен" },
  { id: 102, userId: 1, products: ["Блокнот"], total: 10.00, status: "доставлен" },
  { id: 103, userId: 2, products: ["Ноутбук", "Чехол"], total: 1250.00, status: "в обработке" },
  { id: 104, userId: 3, products: ["Кофе"], total: 5.75, status: "отправлен" }
];
