import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { validateRegistration } from '../utils/validation';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const validation = validateRegistration(email, password, confirmPassword);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await register(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Ошибка', result.error || 'Не удалось зарегистрироваться');
    } else {
      Alert.alert('Успешно', 'Регистрация завершена', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Регистрация</Text>
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Введите email"
            keyboardType="email-address"
            error={errors.email}
            autoCapitalize="none"
          />

          <Input
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            placeholder="Введите пароль (минимум 6 символов)"
            secureTextEntry
            error={errors.password}
          />

          <Input
            label="Подтверждение пароля"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Повторите пароль"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Button
            title="Зарегистрироваться"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Уже есть аккаунт? </Text>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              Войти
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;

