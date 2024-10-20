import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // For navigation to other screens after sign-in

  // Mock function to simulate sign-in validation
  const handleSignIn = () => {
    if (email === 'test' && password === '123') {
      Alert.alert('Success', 'You have successfully logged in!');
      // Navigate to another screen after successful login
      navigation.navigate('HomeScreen');
    } else {
      Alert.alert('Error', 'Invalid email or password');
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
