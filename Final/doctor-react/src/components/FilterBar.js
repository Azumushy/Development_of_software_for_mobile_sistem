import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPECIALTIES, SORT_OPTIONS, SORT_LABELS } from '../utils/constants';

const FilterChip = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const FilterBar = ({ specialty, onSpecialtyChange, sortBy, onSortChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {SPECIALTIES.map((spec) => (
          <FilterChip
            key={spec}
            label={spec}
            selected={specialty === spec}
            onPress={() => onSpecialtyChange(spec)}
          />
        ))}
      </ScrollView>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Сортировка:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sortScrollView}
        >
          {Object.values(SORT_OPTIONS).map((option) => (
            <FilterChip
              key={option}
              label={SORT_LABELS[option]}
              selected={sortBy === option}
              onPress={() => onSortChange(option)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  sortScrollView: {
    flex: 1,
  },
});

export default FilterBar;

