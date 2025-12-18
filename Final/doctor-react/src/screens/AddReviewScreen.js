import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getReviews, saveReviews, getDoctors, saveDoctors } from '../utils/storage';
import Input from '../components/Input';
import StarRating from '../components/StarRating';
import Button from '../components/Button';
import { COLORS } from '../utils/constants';

const AddReviewScreen = ({ route, navigation }) => {
  const { doctorId, doctorName } = route.params;
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите оценку');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, оставьте комментарий');
      return;
    }

    setLoading(true);

    try {
      const allReviews = await getReviews();
      const newReview = {
        id: Date.now().toString(),
        doctorId,
        userId: user.id,
        authorEmail: user.email,
        rating,
        comment: comment.trim(),
        visitDate: visitDate || null,
        date: new Date().toISOString(),
      };

      const updatedReviews = [...allReviews, newReview];
      await saveReviews(updatedReviews);

      const doctors = await getDoctors();
      const doctor = doctors.find((d) => d.id === doctorId);
      if (doctor) {
        const doctorReviews = updatedReviews.filter((r) => r.doctorId === doctorId);
        const newRating =
          doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length;
        doctor.rating = newRating;
        doctor.reviewsCount = doctorReviews.length;
        await saveDoctors(doctors);
      }

      Alert.alert('Успешно', 'Отзыв добавлен', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить отзыв');
      console.error(error);
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Оставить отзыв</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>

          <View style={styles.ratingSection}>
            <Text style={styles.label}>Оценка *</Text>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={32}
              showRating
            />
          </View>

          <Input
            label="Комментарий *"
            value={comment}
            onChangeText={setComment}
            placeholder="Оставьте ваш отзыв..."
            multiline
            numberOfLines={6}
            style={styles.commentInput}
          />

          <Input
            label="Дата посещения (опционально)"
            value={visitDate}
            onChangeText={setVisitDate}
            placeholder="ГГГГ-ММ-ДД"
            keyboardType="default"
          />

          <Button
            title="Отправить отзыв"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
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
    padding: 20,
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  ratingSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  commentInput: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default AddReviewScreen;

