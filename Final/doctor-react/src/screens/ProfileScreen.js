import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getReviews } from '../utils/storage';
import Button from '../components/Button';
import ReviewList from '../components/ReviewList';
import { COLORS } from '../utils/constants';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (user) {
      loadUserReviews();
    }
  }, [user]);

  const loadUserReviews = async () => {
    const allReviews = await getReviews();
    const userReviews = allReviews.filter((r) => r.userId === user?.id);
    setReviews(userReviews);

    if (userReviews.length > 0) {
      const avgRating =
        userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      setStats({
        totalReviews: userReviews.length,
        averageRating: avgRating,
      });
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await updateUser({ avatar: result.assets[0].uri });
      Alert.alert('Успешно', 'Аватар обновлен');
    }
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleReviewPress = async (review) => {
    navigation.navigate('DoctorDetail', { doctorId: review.doctorId });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Необходимо войти в систему</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.email[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.editAvatarBadge}>
            <Text style={styles.editAvatarText}>✎</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>
          Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalReviews}</Text>
          <Text style={styles.statLabel}>Отзывов</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
          </Text>
          <Text style={styles.statLabel}>Средняя оценка</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мои отзывы</Text>
        {reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Вы еще не оставили ни одного отзыва</Text>
          </View>
        ) : (
          <ReviewList reviews={reviews} onReviewPress={handleReviewPress} />
        )}
      </View>

      <View style={styles.section}>
        <Button
          title="Выйти из системы"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
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
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  editAvatarText: {
    fontSize: 16,
    color: COLORS.white,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
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
    marginBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;

