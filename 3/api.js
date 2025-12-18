/**
 * Модуль для работы с JSONPlaceholder API
 * Все функции асинхронные и обрабатывают ошибки
 */

// Базовый URL API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Утилита для обработки HTTP-ответов
 */
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Получение списка всех пользователей
 * @returns {Promise<Array>} Массив пользователей
 */
export async function fetchUsers() {
    try {
        console.log('Запрашиваем список пользователей...');
        const response = await fetch(`${BASE_URL}/users`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        throw error;
    }
}

/**
 * Получение конкретного пользователя по ID
 * @param {number} id ID пользователя
 * @returns {Promise<Object|null>} Объект пользователя или null
 */
export async function fetchUserById(id) {
    try {
        console.log(`Запрашиваем пользователя с ID ${id}...`);
        const response = await fetch(`${BASE_URL}/users/${id}`);
        
        if (response.status === 404) {
            console.warn(`Пользователь с ID ${id} не найден`);
            return null;
        }
        
        return await handleResponse(response);
    } catch (error) {
        console.error(`Ошибка при получении пользователя ${id}:`, error);
        return null;
    }
}

/**
 * Получение всех постов (будут использоваться как "заказы")
 * @returns {Promise<Array>} Массив постов
 */
export async function fetchPosts() {
    try {
        console.log('Запрашиваем список постов...');
        const response = await fetch(`${BASE_URL}/posts`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        throw error;
    }
}

/**
 * Получение постов конкретного пользователя
 * @param {number} userId ID пользователя
 * @returns {Promise<Array>} Массив постов пользователя
 */
export async function fetchPostsByUserId(userId) {
    try {
        console.log(`Запрашиваем посты пользователя ${userId}...`);
        const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Ошибка при получении постов пользователя ${userId}:`, error);
        throw error;
    }
}