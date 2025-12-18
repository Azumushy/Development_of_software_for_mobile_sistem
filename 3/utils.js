/**
 * Вспомогательные утилиты для работы с асинхронным кодом
 */

/**
 * Имитация загрузки данных
 * @param {number} delay Время задержки в миллисекундах
 * @returns {Promise<void>}
 */
export function simulateLoading(delay) {
    console.log(`Имитация загрузки: ${delay}мс`);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Загрузка завершена');
            resolve();
        }, delay);
    });
}

/**
 * Выполнение операции с таймаутом
 * @param {Promise} promise Промис для выполнения
 * @param {number} timeoutMs Таймаут в миллисекундах
 * @returns {Promise<any>} Результат промиса или ошибка таймаута
 */
export function withTimeout(promise, timeoutMs) {
    console.log(`Устанавливаем таймаут ${timeoutMs}мс`);
    
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Таймаут операции: ${timeoutMs}мс`));
        }, timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}

/**
 * Повторение операции при ошибке
 * @param {Function} operation Асинхронная функция для выполнения
 * @param {number} retries Количество попыток
 * @returns {Promise<any>} Результат операции
 */
export async function retryOperation(operation, retries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Попытка ${attempt} из ${retries}`);
            return await operation();
        } catch (error) {
            lastError = error;
            console.error(`Попытка ${attempt} не удалась:`, error.message);
            
            if (attempt < retries) {
                // Экспоненциальная задержка
                const delay = Math.pow(2, attempt) * 100;
                console.log(`Ждем ${delay}мс перед следующей попыткой...`);
                await simulateLoading(delay);
            }
        }
    }
    
    throw new Error(`Все ${retries} попыток не удались. Последняя ошибка: ${lastError.message}`);
}

