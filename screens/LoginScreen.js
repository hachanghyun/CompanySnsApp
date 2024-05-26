import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';

export default function LoginScreen({ navigation }) {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Clear inputs when the screen is focused
      setUserid('');
      setPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!userid || !password) {
      Alert.alert('알림', 'ID와 비밀번호를 입력하세요');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        userid,
        password,
      });
      console.log('Response received:', response.data);
      if (response.data.success) {
        console.log('Navigating to Home with userid:', response.data.userid); // 디버깅 로그 추가
        navigation.navigate('Home', { userid });
      } else {
        Alert.alert('Error', '로그인 에러');
      }
    } catch (error) {
      console.log('Error during login:', error);
      Alert.alert('Error', '로그인 실패');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="User ID"
        value={userid}
        onChangeText={setUserid}
        style={styles.input}
        maxLength={20}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        maxLength={20}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>회원가입</Text>
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
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
