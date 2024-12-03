import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PassengerScreen = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null); // Store selected ride
  const [available_seats, setSeats] = useState(''); // Number of seats to book

  const fetchRides = async () => {
    try {
      const response = await axios.get('http://192.168.1.48:5000/rides', {
        params: { source, destination },
      });
      setRides(response.data.rides);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong!');
    }
  };

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
  };

  const confirmBooking = async () => {
    if (!selectedRide || !available_seats) {
      Alert.alert('Error', 'Please select a ride and specify the number of seats.');
      return;
    }
    const user_id = await AsyncStorage.getItem('user_id');

    try {
      const response = await axios.post('http://192.168.1.48:5000/book', {
      // Replace with logged-in user ID
      user_id,
        ride_id: selectedRide.ride_id,
        available_seats: parseInt(available_seats),
      });
      Alert.alert('Success', response.data.message);
      setSelectedRide(null); // Reset after booking
      setSeats('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <View>
      <Text>Search Rides</Text>
      <TextInput
        placeholder="Source"
        value={source}
        onChangeText={setSource}
        style={{ borderWidth: 1, margin: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
        style={{ borderWidth: 1, margin: 10, padding: 5 }}
      />
      <Button title="Search" onPress={fetchRides} />

      <FlatList
        data={rides}
        keyExtractor={(item) => item.ride_id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>From: {item.origin}</Text>
            <Text>To: {item.destination}</Text>
            <Text>Time: {item.departure_time}</Text>
            <Text>Seats Available: {item.available_seats}</Text>
            <Text>Driver: {item.driver_name}</Text>
            <Button
              title="Select"
              onPress={() => handleRideSelect(item)}
              disabled={selectedRide?.ride_id === item.ride_id} // Disable button if already selected
            />
          </View>
        )}
      />

      {selectedRide && (
        <View style={{ padding: 20 }}>
          <Text>Selected Ride:</Text>
          <Text>From: {selectedRide.origin}</Text>
          <Text>To: {selectedRide.destination}</Text>
          <Text>Seats Available: {selectedRide.available_seats}</Text>

          <TextInput
            placeholder="Enter seats to book"
            value={available_seats}
            onChangeText={setSeats}
            keyboardType="numeric"
            style={{ borderWidth: 1, marginVertical: 10, padding: 5 }}
          />
          <Button title="Confirm Booking" onPress={confirmBooking} />
        </View>
      )}
    </View>
  );
};

export default PassengerScreen;
