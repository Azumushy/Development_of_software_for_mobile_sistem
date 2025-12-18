import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { getDoctors, getReviews, saveReviews } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { REVIEW_SORT_OPTIONS, REVIEW_SORT_LABELS, COLORS } from '../utils/constants';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import Button from '../components/Button';

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState(REVIEW_SORT_OPTIONS.DATE_DESC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [doctorId]);

  useEffect(() => {
    if (reviews.length > 0) {
      sortReviews();
    }
  }, [sortBy]);

  const loadData = async () => {
    setLoading(true);
    const doctors = await getDoctors();
    const foundDoctor = doctors.find((d) => d.id === doctorId);
    setDoctor(foundDoctor);

    const allReviews = await getReviews();
    const doctorReviews = allReviews.filter((r) => r.doctorId === doctorId);
    const sortedReviews = sortReviewsArray(doctorReviews, sortBy);
    setReviews(sortedReviews);
    setLoading(false);
  };

  const sortReviewsArray = (reviewsArray, sortOption) => {
    const sorted = [...reviewsArray];
    sorted.sort((a, b) => {
      switch (sortOption) {
        case REVIEW_SORT_OPTIONS.DATE_DESC:
          return new Date(b.date) - new Date(a.date);
        case REVIEW_SORT_OPTIONS.DATE_ASC:
          return new Date(a.date) - new Date(b.date);
        case REVIEW_SORT_OPTIONS.RATING_DESC:
          return b.rating - a.rating;
        case REVIEW_SORT_OPTIONS.RATING_ASC:
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    return sorted;
  };

  const sortReviews = () => {
    const sorted = sortReviewsArray(reviews, sortBy);
    setReviews(sorted);
  };

  const handleAddReview = () => {
    if (!user) {
      Alert.alert('Ошибка', 'Необходимо войти в систему для оставления отзыва');
      return;
    }
    navigation.navigate('AddReview', { doctorId, doctorName: doctor?.name });
  };

  const handleEditReview = (review) => {
    navigation.navigate('EditReview', { review, doctorId, doctorName: doctor?.name });
  };

  const handleDeleteReview = async (reviewId) => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите удалить этот отзыв?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            const allReviews = await getReviews();
            const updatedReviews = allReviews.filter((r) => r.id !== reviewId);
            await saveReviews(updatedReviews);
            await loadData();
          },
        },
      ]
    );
  };

  if (loading || !doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  const userReviews = reviews.filter((r) => r.userId === user?.id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {doctor.avatar ? (
            <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {doctor.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.ratingContainer}>
            <StarRating rating={doctor.rating} disabled size={24} showRating />
            <Text style={styles.reviewsCount}>
              {doctor.reviewsCount} {doctor.reviewsCount === 1 ? 'отзыв' : 'отзывов'}
            </Text>
          </View>
          <Text style={styles.experience}>Опыт работы: {doctor.experience} лет</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О враче</Text>
        <Text style={styles.description}>{doctor.fullInfo || doctor.description}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Отзывы ({reviews.length})</Text>
          {user && (
            <Button
              title="Оставить отзыв"
              onPress={handleAddReview}
              variant="primary"
              style={styles.addReviewButton}
            />
          )}
        </View>

        {reviews.length > 0 && (
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Сортировка: </Text>
            {Object.values(REVIEW_SORT_OPTIONS).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortButton,
                  sortBy === option && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy(option)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === option && styles.sortButtonTextActive,
                  ]}
                >
                  {REVIEW_SORT_LABELS[option]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {reviews.length === 0 ? (
          <View style={styles.emptyReviews}>
            <Text style={styles.emptyText}>Пока нет отзывов</Text>
            {user && (
              <Button
                title="Оставить первый отзыв"
                onPress={handleAddReview}
                variant="primary"
              />
            )}
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReviewCard
                review={item}
                onEdit={
                  item.userId === user?.id ? () => handleEditReview(item) : null
                }
                onDelete={
                  item.userId === user?.id
                    ? () => handleDeleteReview(item.id)
                    : null
                }
                canEdit={item.userId === user?.id}
              />
            )}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  experience: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addReviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: 12,
    color: COLORS.text,
  },
  sortButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
});

export default DoctorDetailScreen;

