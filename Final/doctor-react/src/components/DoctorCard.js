import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import StarRating from './StarRating';

const DoctorCard = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {doctor.avatar ? (
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={doctor.rating} disabled size={16} />
          <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsCount}>({doctor.reviewsCount})</Text>
        </View>
        <Text style={styles.experience}>Опыт: {doctor.experience} лет</Text>
        {doctor.description && (
          <Text style={styles.description} numberOfLines={2}>
            {doctor.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  experience: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default DoctorCard;

