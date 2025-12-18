import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import StarRating from './StarRating';

const ReviewCard = ({ review, onEdit, onDelete, canEdit = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.author}>{review.authorEmail || 'Анонимный пользователь'}</Text>
          <StarRating rating={review.rating} disabled size={16} />
        </View>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>
      {review.visitDate && (
        <Text style={styles.visitDate}>
          Дата посещения: {formatDate(review.visitDate)}
        </Text>
      )}
      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
      {canEdit && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>Редактировать</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
              <Text style={[styles.actionText, styles.deleteText]}>Удалить</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  visitDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  comment: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  deleteText: {
    color: COLORS.error,
  },
});

export default ReviewCard;

