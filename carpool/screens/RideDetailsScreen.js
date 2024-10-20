import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const RideDetailsScreen = ({ route }) => {
  const { ride } = route.params; // Get the ride data from navigation parameters
  const [savedRide, setSavedRide] = useState(null); // State to store saved ride details

  // Function to handle saving the ride details
  const handleSaveDetails = () => {
    // Simulate saving the details
    setSavedRide(ride); // Store the ride details in state
    Alert.alert('Success', 'Ride details saved successfully!');
    
    // For debugging purposes, you can also log the details to the console:
    console.log('Saved Ride Details:', ride);
  };

  return (
    <View style={tw`p-5`}>
      <Text style={styles.title}>Ride Details</Text>
      <Text style={styles.details}>From: {ride.from}</Text>
      <Text style={styles.details}>To: {ride.to}</Text>
      <Text style={styles.details}>Date: {ride.date}</Text>
      <Text style={styles.details}>Time: {ride.time}</Text>
      <Text style={styles.details}>Seats Available: {ride.seatsAvailable}</Text>

      {/* Save Details Button */}
      <View style={tw`mt-5`}>
        <Button title="Save Details" onPress={handleSaveDetails} />
      </View>

      {/* Conditionally render saved ride details if present */}
      {savedRide && (
        <View style={tw`mt-5 p-4 bg-gray-200 rounded-lg`}>
          <Text style={styles.savedTitle}>Saved Ride Details</Text>
          <Text style={styles.details}>From: {savedRide.from}</Text>
          <Text style={styles.details}>To: {savedRide.to}</Text>
          <Text style={styles.details}>Date: {savedRide.date}</Text>
          <Text style={styles.details}>Time: {savedRide.time}</Text>
          <Text style={styles.details}>Seats Available: {savedRide.seatsAvailable}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginVertical: 5,
  },
  savedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
});

export default RideDetailsScreen;
