import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { getDoctors, initializeData } from '../utils/storage';
import { SORT_OPTIONS, SPECIALTIES, COLORS } from '../utils/constants';
import DoctorCard from '../components/DoctorCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

const HomeScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RATING);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    await initializeData();
    const data = await getDoctors();
    setDoctors(data);
  };

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = [...doctors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query)
      );
    }

    if (specialty !== SPECIALTIES[0]) {
      filtered = filtered.filter((doctor) => doctor.specialty === specialty);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.RATING:
          return b.rating - a.rating;
        case SORT_OPTIONS.NAME:
          return a.name.localeCompare(b.name);
        case SORT_OPTIONS.EXPERIENCE:
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    return filtered;
  }, [doctors, searchQuery, specialty, sortBy]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDoctors();
    setRefreshing(false);
  };

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetail', { doctorId: doctor.id });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Поиск по имени или специальности..."
      />
      <FilterBar
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <FlatList
        data={filteredAndSortedDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={() => handleDoctorPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Врачи не найдены</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default HomeScreen;

