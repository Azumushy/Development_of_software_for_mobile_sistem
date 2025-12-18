import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getDoctors } from '../utils/storage';
import { COLORS } from '../utils/constants';

const ReviewList = ({ reviews, onReviewPress }) => {
  const [doctorNames, setDoctorNames] = useState({});

  useEffect(() => {
    loadDoctorNames();
  }, [reviews]);

  const loadDoctorNames = async () => {
    const doctors = await getDoctors();
    const names = {};
    reviews.forEach((review) => {
      const doctor = doctors.find((d) => d.id === review.doctorId);
      if (doctor) {
        names[review.doctorId] = doctor.name;
      }
    });
    setDoctorNames(names);
  };

  return (
    <>
      {reviews.map((review) => (
        <TouchableOpacity
          key={review.id}
          style={styles.reviewItem}
          onPress={() => onReviewPress(review)}
        >
          <View style={styles.reviewItemHeader}>
            <Text style={styles.reviewItemDoctor} numberOfLines={1}>
              {doctorNames[review.doctorId] || 'Врач'}
            </Text>
            <Text style={styles.reviewItemRating}>
              {'★'.repeat(review.rating)}
            </Text>
          </View>
          {review.comment && (
            <Text style={styles.reviewItemComment} numberOfLines={2}>
              {review.comment}
            </Text>
          )}
          <Text style={styles.reviewItemDate}>
            {new Date(review.date).toLocaleDateString('ru-RU')}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  reviewItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewItemDoctor: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  reviewItemRating: {
    fontSize: 16,
    color: COLORS.star,
  },
  reviewItemComment: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewItemDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

export default ReviewList;

