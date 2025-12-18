export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRegistration = (email, password, confirmPassword) => {
  const errors = {};

  if (!email) {
    errors.email = 'Email обязателен';
  } else if (!validateEmail(email)) {
    errors.email = 'Некорректный email';
  }

  if (!password) {
    errors.password = 'Пароль обязателен';
  } else if (!validatePassword(password)) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Подтверждение пароля обязательно';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = 'Email обязателен';
  } else if (!validateEmail(email)) {
    errors.email = 'Некорректный email';
  }

  if (!password) {
    errors.password = 'Пароль обязателен';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

