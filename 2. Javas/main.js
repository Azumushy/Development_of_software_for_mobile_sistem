//main.js

import { users, orders } from "./data.js";
import { createUser, findUserById, updateUser } from "./userFunctions.js";
import { getUserOrders, addProductToOrder, getOrderSummary } from "./orderFunctions.js";
import { calculateTotal, formatUserInfo } from "./utils.js";

console.log("=== Начальные данные ===");
console.log("Пользователи:", users);
console.log("Заказы:", orders);

// Создание нового пользователя
const newUser = createUser({ name: "Ольга", email: "olga@yandex.ru" });
console.log("\nСоздан новый пользователь:", newUser);

// Поиск пользователя по ID
const foundUser = findUserById(2);
console.log("\nНайден пользователь (id=2):", foundUser);

// Обновление пользователя
const updatedUser = updateUser(3, { email: "romanich@yandex.ru", isActive: false });
console.log("\nОбновленный пользователь (id=3):", updatedUser);

// Получение заказов пользователя
const userOrders = getUserOrders(1);
console.log("\nЗаказы пользователя (id=1):", userOrders);

// Добавление товара в заказ
const updatedOrder = addProductToOrder(101, "Карандаш");
console.log("\nОбновленный заказ (id=101):", updatedOrder);

// Получение сводки по заказу
const summary = getOrderSummary(103);
console.log("\nСводка заказа (id=103):", summary);

// Использование utils
const total = calculateTotal(10, 20.5, 5);
console.log("\nОбщая сумма (utils):", total);

console.log("\nФорматированная инфо о пользователе:");
console.log(formatUserInfo(users[0]));
