import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  DOCTORS: 'doctors',
  REVIEWS: 'reviews',
  USER: 'user',
};

export const getDoctors = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DOCTORS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting doctors:', error);
    return [];
  }
};

export const saveDoctors = async (doctors) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    return true;
  } catch (error) {
    console.error('Error saving doctors:', error);
    return false;
  }
};

export const getReviews = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const saveReviews = async (reviews) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return true;
  } catch (error) {
    console.error('Error saving reviews:', error);
    return false;
  }
};

export const initializeData = async () => {
  const doctors = await getDoctors();
  if (doctors.length === 0) {
    const initialDoctors = [
      {
        id: '1',
        name: 'Иванов Иван Иванович',
        specialty: 'Терапевт',
        experience: 15,
        rating: 4.8,
        reviewsCount: 24,
        avatar: null,
        description: 'Опытный терапевт с многолетним стажем работы. Специализируется на лечении заболеваний внутренних органов.',
        fullInfo: 'Высококвалифицированный врач-терапевт с 15-летним опытом работы. Окончил медицинский университет с отличием. Регулярно повышает квалификацию и участвует в медицинских конференциях.',
      },
      {
        id: '2',
        name: 'Петрова Мария Сергеевна',
        specialty: 'Кардиолог',
        experience: 12,
        rating: 4.9,
        reviewsCount: 31,
        avatar: null,
        description: 'Специалист по заболеваниям сердечно-сосудистой системы. Проводит комплексную диагностику и лечение.',
        fullInfo: 'Врач-кардиолог высшей категории. Специализируется на диагностике и лечении заболеваний сердца и сосудов. Имеет множество благодарностей от пациентов.',
      },
      {
        id: '3',
        name: 'Сидоров Алексей Викторович',
        specialty: 'Невролог',
        experience: 8,
        rating: 4.6,
        reviewsCount: 18,
        avatar: null,
        description: 'Молодой специалист в области неврологии. Использует современные методы диагностики и лечения.',
        fullInfo: 'Врач-невролог с 8-летним опытом. Специализируется на лечении заболеваний нервной системы. Применяет современные методики лечения.',
      },
      {
        id: '4',
        name: 'Козлова Елена Дмитриевна',
        specialty: 'Педиатр',
        experience: 20,
        rating: 4.7,
        reviewsCount: 45,
        avatar: null,
        description: 'Опытный детский врач. Работает с детьми всех возрастов, находит подход к каждому ребенку.',
        fullInfo: 'Врач-педиатр с 20-летним стажем. Специализируется на лечении детей от рождения до 18 лет. Имеет большой опыт работы с детьми различных возрастов.',
      },
      {
        id: '5',
        name: 'Морозов Дмитрий Александрович',
        specialty: 'Хирург',
        experience: 18,
        rating: 4.5,
        reviewsCount: 28,
        avatar: null,
        description: 'Хирург широкого профиля. Выполняет операции различной сложности.',
        fullInfo: 'Врач-хирург высшей категории с 18-летним опытом. Специализируется на общей хирургии. Выполнил более 1000 успешных операций.',
      },
    ];
    await saveDoctors(initialDoctors);
  }
};

