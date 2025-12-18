import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const Star = ({ filled, onPress, size = 20, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.star, { fontSize: size }, filled && styles.starFilled]}>
        ★
      </Text>
    </TouchableOpacity>
  );
};

const StarRating = ({
  rating = 0,
  onRatingChange,
  maxRating = 5,
  size = 20,
  showRating = false,
  disabled = false,
}) => {
  const handleStarPress = (index) => {
    if (!disabled && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }).map((_, index) => (
          <Star
            key={index}
            filled={index < rating}
            onPress={() => handleStarPress(index)}
            size={size}
            disabled={disabled}
          />
        ))}
      </View>
      {showRating && (
        <Text style={styles.ratingText}>
          {rating > 0 ? rating.toFixed(1) : 'Нет оценки'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    color: COLORS.starEmpty,
    marginRight: 4,
  },
  starFilled: {
    color: COLORS.star,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default StarRating;

