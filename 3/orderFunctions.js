/**
 * Асинхронные операции с заказами (постами)
 */
import { fetchPosts, fetchUsers } from './api.js';

/**
 * Получение последних постов
 * @param {number} limit Количество постов для возврата
 * @returns {Promise<Array>} Массив последних постов
 */
export async function getRecentPosts(limit = 5) {
    try {
        console.log(`Получаем ${limit} последних постов...`);
        const posts = await fetchPosts();
        
        // Сортировка по ID в порядке убывания
        const sortedPosts = posts.sort((a, b) => b.id - a.id);
        
        // Выбор первых N постов
        const recentPosts = sortedPosts.slice(0, limit);
        
        console.log(`Получено ${recentPosts.length} последних постов из ${posts.length}`);
        return recentPosts;
    } catch (error) {
        console.error('Ошибка при получении последних постов:', error);
        return [];
    }
}

/**
 * Поиск постов по заголовку
 * @param {string} searchTerm Поисковый запрос
 * @returns {Promise<Array>} Массив найденных постов
 */
export async function getPostsByTitleSearch(searchTerm) {
    try {
        console.log(`Ищем посты с текстом "${searchTerm}" в заголовке...`);
        const posts = await fetchPosts();
        
        // Регистронезависимый поиск
        const searchTermLower = searchTerm.toLowerCase();
        const foundPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTermLower)
        );
        
        console.log(`Найдено ${foundPosts.length} постов по запросу "${searchTerm}"`);
        return foundPosts;
    } catch (error) {
        console.error('Ошибка при поиске постов по заголовку:', error);
        return [];
    }
}

/**
 * Получение статистики по постам
 * @returns {Promise<Object>} Объект со статистикой
 */
export async function getPostsStats() {
    try {
        console.log('Получаем статистику по постам...');
        
        // Параллельное получение пользователей и постов
        const [users, posts] = await Promise.all([
            fetchUsers(),
            fetchPosts()
        ]);
        
        const totalPosts = posts.length;
        const totalUsers = users.length;
        const averagePostsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(2) : 0;
        
        // Поиск пользователей с максимальным количеством постов
        const userPostCounts = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            return {
                userId: user.id,
                userName: user.name,
                postCount: userPosts.length
            };
        });
        
        const topPoster = userPostCounts.sort((a, b) => b.postCount - a.postCount)[0];
        
        const stats = {
            totalPosts,
            totalUsers,
            averagePostsPerUser: parseFloat(averagePostsPerUser),
            topPoster: {
                id: topPoster.userId,
                name: topPoster.userName,
                postCount: topPoster.postCount
            },
            postsByUser: userPostCounts
        };
        
        console.log('Статистика получена:', {
            посты: totalPosts,
            пользователи: totalUsers,
            среднее: averagePostsPerUser
        });
        
        return stats;
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        throw error;
    }
}