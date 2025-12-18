/**
 * Асинхронные операции с пользователями
 */
import { fetchUsers, fetchUserById, fetchPostsByUserId } from './api.js';

/**
 * Получение активных пользователей
 * @returns {Promise<Array>} Массив активных пользователей
 */
export async function getActiveUsers() {
    try {
        console.log('Получаем активных пользователей...');
        const users = await fetchUsers();
        
        // Активные пользователи - те, у которых ID кратен 2
        const activeUsers = users.filter(user => user.id % 2 === 0);
        
        console.log(`Найдено ${activeUsers.length} активных пользователей из ${users.length}`);
        return activeUsers;
    } catch (error) {
        console.error('Ошибка при получении активных пользователей:', error);
        return [];
    }
}

/**
 * Получение пользователя и его постов
 * @param {number} userId ID пользователя
 * @returns {Promise<Object>} Объект с данными пользователя и его постами
 */
export async function getUserWithPosts(userId) {
    try {
        console.log(`Получаем данные пользователя ${userId} и его посты...`);
        
        // Параллельное выполнение запросов с помощью Promise.all
        const [user, posts] = await Promise.all([
            fetchUserById(userId),
            fetchPostsByUserId(userId)
        ]);
        
        if (!user) {
            throw new Error(`Пользователь с ID ${userId} не найден`);
        }
        
        // Деструктуризация для создания результирующего объекта
        const { id, name, email, username } = user;
        
        const result = {
            user: {
                id,
                name,
                email,
                username
            },
            posts: posts.map(post => ({
                id: post.id,
                title: post.title,
                body: post.body
            })),
            postCount: posts.length
        };
        
        console.log(`Получен пользователь "${name}" с ${posts.length} постами`);
        return result;
    } catch (error) {
        console.error(`Ошибка при получении данных пользователя ${userId}:`, error);
        throw error;
    }
}

/**
 * Поиск пользователя по email
 * @param {string} email Email для поиска
 * @returns {Promise<Object|null>} Найденный пользователь или null
 */
export async function findUserByEmail(email) {
    try {
        console.log(`Ищем пользователя с email: ${email}`);
        const users = await fetchUsers();
        
        // Регистронезависимый поиск
        const foundUser = users.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
        );
        
        if (foundUser) {
            console.log(`Пользователь найден: ${foundUser.name}`);
            return foundUser;
        } else {
            console.log(`Пользователь с email ${email} не найден`);
            return null;
        }
    } catch (error) {
        console.error('Ошибка при поиске пользователя по email:', error);
        return null;
    }
}