import React, { useContext, useState } from 'react';
import { View, TextInput, StyleSheet, Image, Pressable, Text } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import images from "@/assets/images/images";
import { AuthContext } from '../AuthProvider';
import { IP_ADDRESS } from '@/ip';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const validateInputs = () => {
    let valid = true;
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const login = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/login`, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const { token } = response.data;
      console.log("token", token);
      if (authContext) {
        authContext.setToken(token);
      }

      router.push('/todos');
    } catch (error) {
      console.error('Error logging in:', (error as any)?.response?.data.error);
      setPasswordError((error as any)?.response?.data.error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: `https://wsrv.nl/?url=${images.auth}` }} style={styles.image} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888888"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (emailError) {
              setEmailError('');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888888"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (passwordError) {
              setPasswordError('');
            }
          }}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>
      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  button: {
    width: '100%',
    backgroundColor: '#43CFC6',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    paddingVertical: 4
  },
});

export default LoginScreen;
