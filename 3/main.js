/**
 * Главный модуль для демонстрации асинхронной работы
 */
import { getActiveUsers, getUserWithPosts, findUserByEmail } from './userFunctions.js';
import { getRecentPosts, getPostsByTitleSearch, getPostsStats } from './orderFunctions.js';
import { simulateLoading, withTimeout, retryOperation } from './utils.js';

/**
 * Основная демонстрационная функция
 */
async function main() {
    console.log('Запуск демонстрации асинхронной системы');
    console.log('='.repeat(50));
    
    try {
        // 1. Получение списка активных пользователей (последовательно)
        console.log('\n1. Получение активных пользователей...');
        await simulateLoading(1000);
        const activeUsers = await getActiveUsers();
        console.log('Активные пользователи:', activeUsers.map(u => u.name));
        
        // 2. Получение детальной информации о первом пользователе
        console.log('\n2. Получение данных пользователя и его постов...');
        if (activeUsers.length > 0) {
            const firstUserId = activeUsers[0].id;
            const userWithPosts = await getUserWithPosts(firstUserId);
            console.log(`Данные пользователя: ${userWithPosts.user.name}`);
            console.log(`Количество постов: ${userWithPosts.postCount}`);
            if (userWithPosts.posts.length > 0) {
                console.log('Первый пост:', userWithPosts.posts[0].title);
            }
        }
        
        // 3. Поиск пользователя по email
        console.log('\n3. Поиск пользователя по email...');
        const emailToSearch = 'Sincere@april.biz'; // Известный email из JSONPlaceholder
        const foundUser = await findUserByEmail(emailToSearch);
        if (foundUser) {
            console.log(`Найден: ${foundUser.name} (${foundUser.email})`);
        }
        
        // 4. Получение последних постов
        console.log('\n4. Получение последних постов...');
        const recentPosts = await getRecentPosts(3);
        console.log('Последние 3 поста:');
        recentPosts.forEach(post => {
            console.log(`  - ${post.title.substring(0, 50)}...`);
        });
        
        // 5. Поиск постов по заголовку (с таймаутом)
        console.log('\n5. Поиск постов по заголовку (с таймаутом)...');
        try {
            const searchPromise = getPostsByTitleSearch('dolor');
            const searchResult = await withTimeout(searchPromise, 5000);
            console.log(`Найдено ${searchResult.length} постов с "dolor"`);
        } catch (timeoutError) {
            console.error('Поиск постов не удался:', timeoutError.message);
        }
        
        // 6. Получение статистики (параллельные запросы)
        console.log('\n6. Получение статистики (параллельные запросы)...');
        await simulateLoading(500);
        const stats = await getPostsStats();
        console.log('Статистика системы:');
        console.log(`  Всего пользователей: ${stats.totalUsers}`);
        console.log(`  Всего постов: ${stats.totalPosts}`);
        console.log(`  Среднее постов на пользователя: ${stats.averagePostsPerUser}`);
        console.log(`  Самый активный автор: ${stats.topPoster.name} (${stats.topPoster.postCount} постов)`);
        
        // 7. Демонстрация повторных попыток
        console.log('\n7. Демонстрация повторных попыток...');
        await simulateLoading(500);
        
        // Создаем функцию, которая иногда падает
        const unstableOperation = async () => {
            await simulateLoading(100);
            const random = Math.random();
            if (random < 0.7) {
                throw new Error(`Случайная ошибка (${random.toFixed(2)})`);
            }
            return 'Успех!';
        };
        
        try {
            const result = await retryOperation(unstableOperation, 3);
            console.log('Операция завершена успешно:', result);
        } catch (retryError) {
            console.error('Операция не удалась после всех попыток:', retryError.message);
        }
        
        // 8. Параллельные операции
        console.log('\n8. Параллельные операции с Promise.all...');
        await simulateLoading(300);
        
        const parallelOperations = [
            getRecentPosts(2),
            getPostsByTitleSearch('sit'),
            simulateLoading(1000)
        ];
        
        console.log('Запускаем 3 операции параллельно...');
        const [recent, searchResults, _] = await Promise.all(parallelOperations);
        console.log('Параллельные операции завершены:');
        console.log(`  Получено последних постов: ${recent.length}`);
        console.log(`  Найдено постов с "sit": ${searchResults.length}`);
        
    } catch (error) {
        console.error('\nКритическая ошибка в демонстрации:', error);
    } finally {
        console.log('\n' + '='.repeat(50));
        console.log('Демонстрация завершена');
        console.log('Все асинхронные операции обработаны');
    }
}

// Запуск демонстрации с обработкой ошибок верхнего уровня
main().catch(error => {
    console.error('Необработанная ошибка:', error);
    process.exit(1);
});