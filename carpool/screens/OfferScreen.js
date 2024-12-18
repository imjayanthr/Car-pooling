

import { View, Text, Button, Platform,TextInput } from 'react-native';
import React, { useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const OfferScreen = () => {
  // States for date and time
  const [date, setDate] = useState(new Date()); // Current date
  const [time, setTime] = useState(new Date()); // Current time
  const [showDatePicker, setShowDatePicker] = useState(false); // To show/hide the DatePicker
  const [showTimePicker, setShowTimePicker] = useState(false); // To show/hide the TimePicker
  const [seatsAvailable, setSeatsAvailable] = useState(''); // State to store the number of seats
  const [source,setsource]=useState("");
  const [destination,setdestination]=useState("");
  const navigation = useNavigation(); // For navigation to other screens

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Hide on Android after selection
    setDate(currentDate); // Set the selected date
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios'); // Hide on Android after selection
    setTime(currentTime); // Set the selected time
  };
  const showDatepicker = () => {
    setShowDatePicker(true); // Show the date picker modal
  };
  const showTimepicker = () => {
    setShowTimePicker(true); // Show the time picker modal
  };
  const handleSeatsChange = (input) => {
        setSeatsAvailable(input); // Update state with the input value
  };
  const handleSetSource = (input) => {
    setsource(input);
  }
  const handleSetDestination = (input) => {
    setdestination(input);
  }
  // const handleSubmit = () => {
  //       // Here you can handle what to do with the seatsAvailable value
  //       console.log('From :', source);
  //       console.log('To :', destination);
  //       console.log('Available seats :', seatsAvailable);
  //       console.log("date:",date.toLocaleDateString('en-US'));
  //       console.log("time:",time.toLocaleTimeString('en-US'));
  // };

  const handleSubmit = async () => {
    console.log('Submit button clicked'); // Log function execution
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log('Retrieved user ID:', userId); // Log user ID retrieval
  
      if (!userId) {
        Alert.alert('Error', 'User not signed in!');
        return;
      }
  
      const rideData = {
        user_id: parseInt(userId, 10),
        source,
        destination,
        date: date.toISOString().split('T')[0],
        time: time.toTimeString().split(' ')[0],
        seats_available: parseInt(seatsAvailable, 10),
      };
  
      console.log('Ride data to be sent:', rideData); // Log ride data
  
      const response = await axios.post('http://192.168.1.48:5000/rides', rideData);
      console.log('API Response:', response.data); // Log API response
      Alert.alert('Success', response.data.message);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error Response:', error.response?.data || error.message); // Log error
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong!');
    }
  };
  

  return (
    <View>
      <Text style={tw`p-10 font-bold`}>OfferScreen</Text>

      {/* Google Places From Field */}
      {/* <View style={tw`m-6 p-5`}>
        <GooglePlacesAutocomplete
          placeholder="From.."
          onPress={(data, details = null) => {
            console.log(data, details); // Handle selection
          }}
          query={{
            key: 'YOUR API KEY',
            language: 'en',
          }}
        />
      </View> */}
      {/* Google Places To Field */}
      {/* <View style={tw`m-6 p-5`}>
        <GooglePlacesAutocomplete
          placeholder="To.."
          onPress={(data, details = null) => {
            console.log(data, details); // Handle selection
          }}
          query={{
            key: 'YOUR API KEY',
            language: 'en',
          }}
        />
      </View> */}
       <View >
            <TextInput
                placeholder="From.."
                value={source} // Bind input value to state
                onChangeText={handleSetSource} // Update state on text change
            />
        </View>
        <View >
            <TextInput
                placeholder="To.."
                value={destination} // Bind input value to state
                onChangeText={handleSetDestination} // Update state on text change
            />
        </View>

      {/* Date and Time Pickers */}
      <View style={{ padding: 20 }}>
        {/* Date Picker */}
        <Button onPress={showDatepicker} title="Select Date" />
        {/* Ensure date is rendered inside a Text component */}
        <Text>Date: {date ? date.toLocaleDateString('en-US') : ''}</Text> 
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date" // This is for picking a date
            display="default" // Android default display
            onChange={onChangeDate} // Callback when date is picked
          />
        )}

        {/* Time Picker */}
        <Button onPress={showTimepicker} title="Select Time" />
        {/* Ensure time is rendered inside a Text component */}
        <Text>Time: {time ? time.toLocaleTimeString('en-US') : ''}</Text> 

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time" // This is for picking a time
            display="default" // Android default display
            onChange={onChangeTime} // Callback when time is picked
          />
        )}
      </View>
      <View >
            <Text>Enter Number of Seats Available</Text>
            <TextInput
                placeholder="Number of seats..."
                keyboardType="numeric" // Only allow numeric input
                value={seatsAvailable} // Bind input value to state
                onChangeText={handleSeatsChange} // Update state on text change
            />
            <Button title="Submit" onPress={handleSubmit} /> 
        </View>
    </View>
  );
};

export default OfferScreen;
