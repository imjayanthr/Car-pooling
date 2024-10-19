import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';

// Sample Ride Card Component
const RideCard = ({ ride }) => (
  <View style={styles.card}>
    <Text style={styles.title}>From: {ride.from}</Text>
    <Text style={styles.details}>To: {ride.to}</Text>
    <Text style={styles.details}>Date: {ride.date}</Text>
    <Text style={styles.details}>Time: {ride.time}</Text>
    <Text style={styles.details}>Available Seats: {ride.seatsAvailable}</Text>
  </View>
);

// Main Component to List Rides
const AvailableRidesScreen = () => {
  const [rides, setRides] = useState([]);

  // Simulate fetching ride data
  useEffect(() => {
    // Replace this with real API call or data fetching logic
    const fetchRides = async () => {
      // Simulated data
      const rideData = [
        { id: '1', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 3 },
        { id: '2', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 2 },
        { id: '3', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 3 },
        { id: '4', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 2 },
        { id: '5', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 3 },
        { id: '6', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 2 },
        { id: '7', from: 'New York', to: 'Boston', date: '2024-10-08', time: '10:00 AM', seatsAvailable: 3 },
        { id: '8', from: 'Los Angeles', to: 'San Francisco', date: '2024-10-09', time: '2:30 PM', seatsAvailable: 2 },
      ];
      setRides(rideData);
    };

    fetchRides();
  }, []);

  return (
    <View style={tw`p-5`}>
      {/* Conditionally render rides or 'No Rides Available' */}
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

export default AvailableRidesScreen;
