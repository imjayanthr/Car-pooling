import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import tw from 'tailwind-react-native-classnames';

const RideCard = ({ ride }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('RideDetailsScreen', { ride })}>
      <View style={styles.card}>
        <Text style={styles.title}>From: {String(ride.from)}</Text>
        <Text style={styles.details}>To: {String(ride.to)}</Text>
        <Text style={styles.details}>Date: {String(ride.date)}</Text>
        <Text style={styles.details}>Time: {String(ride.time)}</Text>
        <Text style={styles.details}>Available Seats: {String(ride.seatsAvailable)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const RideAvailableScreen = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const rideData = [
        { id: '1', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 3 },
        { id: '2', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 2 },
        { id: '3', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 5 },
        { id: '4', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 2 },
        { id: '5', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 3 },
        { id: '6', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 1 },
      ];
      setRides(rideData);
    };

    fetchRides();
  }, []);

  return (
    <View style={tw`p-5`}>
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RideCard ride={item} />}
        />
      ) : (
        <Text style={tw`text-center mt-10 text-lg`}>No rides available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
});

export default RideAvailableScreen;
