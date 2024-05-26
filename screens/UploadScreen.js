import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';

export default function UploadScreen({ route }) {
    // route.params가 undefined일 경우 대비
    const userid = route.params ? route.params.userid : null;
    console.log('Received userid in UploadScreen:', userid); // 디버깅 로그 추가
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('ImagePicker result:', result); // 디버깅 로그 추가

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);  // 'result.assets[0].uri' 사용
    }
  };

  const uploadImage = async () => {
    if (!selectedImage || !title) {
      Alert.alert('알림', '이미지와 제목을 입력하세요');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage,
      name: 'upload.jpg',
      type: 'image/jpeg',
    });
    formData.append('userid', userid);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post(`${API_BASE_URL}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      Alert.alert('알림', '이미지가 성공적으로 업로드 되었습니다');
      setSelectedImage(null);
      setTitle('');
      setDescription('');
      Keyboard.dismiss();  // 키보드 닫기
    } catch (error) {
      console.log('Error uploading image:', error);
      Alert.alert('Error', '이미지 업로드 실패');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>이미지 선택</Text>
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
          <TextInput
            placeholder="제목"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="내용"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            blurOnSubmit={true}  // 엔터를 누르면 입력 상자가 블러됩니다
            onSubmitEditing={Keyboard.dismiss}  // 키보드 닫기
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={uploadImage}>
            <Text style={styles.buttonText}>이미지 업로드</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: '90%',
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 16, // 글자 크기를 조금 키움
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15, // 패딩 크기를 조금 키움
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
    width: '90%',
  },
  uploadButton: {
    backgroundColor: '#03DAC6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
