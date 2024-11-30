import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // For navigation to other screens after sign-in

  // Mock function to simulate sign-in validation
  // const handleSignIn = async () => {
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Please fill in all fields');
  //     return;
  //   }
  
  //   // API call to log in user
  //   try {
  //     const response = await axios.post('http://192.168.1.48:5000//users/signin', {
  //       email,
  //       password,
  //     });
  //     Alert.alert('Success', response.data.message);
  //     navigation.navigate('HomeScreen'); // Navigate to HomeScreen
  //   } catch (error) {
  //     Alert.alert('Error', error.response?.data?.error || 'Invalid email or password');
  //   }
  //   // if (email === 'test' && password === '123') {
  //   //   Alert.alert('Success', 'You have successfully logged in!');
  //   //   // Navigate to another screen after successful login
  //   //   navigation.navigate('HomeScreen');
  //   // } else {
  //   //   Alert.alert('Error', 'Invalid email or password');
  //   // }
  // };

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.1.48:5000/users/signin', {
        email,
        password,
      });
      console.log(response.data); 
      const userId = response.data.user_id; // Get the user ID from the response
      await AsyncStorage.setItem('user_id', userId.toString()); // Store it in AsyncStorage
      Alert.alert('Success', 'Signed in successfully!');
      navigation.navigate('HomeScreen'); // Navigate to the home screen
    } catch (error) {
      console.log('Error:', error); // Log the full error object
      console.log('Error Response:', error.response?.data); // Log response from server
      
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong!');
    }
  };
  
  return (
    <View style={tw`p-10 justify-center`}>
      <Text style={styles.title}>Sign In</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Sign In Button */}
      <View style={tw`mt-5`}>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>

      {/* Sign Up Navigation (if the user doesn't have an account) */}
      <Text
        style={tw`mt-5 text-blue-500 text-center`}
        onPress={() => navigation.navigate('SignUpScreen')}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default SignInScreen;
