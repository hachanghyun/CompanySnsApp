import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_BASE_URL } from '../config/config';

export default function RegisterScreen({ navigation }) {
  const [userid, setUserid] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Clear inputs when the screen is focused
      setUserid('');
      setName('');
      setPassword('');
      setConfirmPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const validate = () => {
    const alphanumeric = /^[a-zA-Z0-9]+$/;
    if (!userid || !name || !password || !confirmPassword) {
      Alert.alert('알림', 'ID랑 PW를 입력하세요');
      return false;
    }
    if (!alphanumeric.test(userid)) {
      Alert.alert('알림', '유저네임은 대소문자와 숫자가 포함되어야 합니다.');
      return false;
    }
    if (!alphanumeric.test(password)) {
      Alert.alert('알림', '비밀번호는 대소문자와 숫자가 포함되어야 합니다.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (validate()) {
      try {
        console.log('Sending request to server...');
        console.log('API_BASE_URL:', API_BASE_URL);
        console.log('Request body:', {
          userid,
          name,
          password,
        });

        const response = await fetch(`${API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid,
            name,
            password,
          }),
        });

        console.log('Response received:', response);

        if (response.ok) {
          const responseData = await response.json();
          Alert.alert('회원가입 성공');
          console.log('Success', responseData.message);
          navigation.navigate('Login');
        } else {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          Alert.alert('Error', '등록 실패: ' + (errorData.message || 'Unknown error'));
        }
      } catch (error) {
        console.log('Fetch error:', error);
        Alert.alert('Error', '등록 실패');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="User ID"
        value={userid}
        onChangeText={setUserid}
        style={styles.input}
        maxLength={20} // Set max length to 20
      />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        maxLength={20} // Set max length to 20
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        maxLength={20} // Set max length to 20
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        maxLength={20} // Set max length to 20
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5, // Rounded corners
  },
  button: {
    backgroundColor: '#6200EE', // Modern purple color
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
