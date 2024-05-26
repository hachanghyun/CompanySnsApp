import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
import { useFocusEffect,useNavigation } from '@react-navigation/native'; // useFocusEffect 추가
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용을 위해 추가

const numColumns = 3;
const { width } = Dimensions.get('window');
//const imageSize = width / numColumns;
//const imageSize = width / numColumns - 2; // 이미지 사이즈 계산, -2는 margin을 고려한 값
const imageSize = (width - 32) / numColumns; // 이미지 사이즈 계산, 여백을 고려한 값

// 기본 이미지 URL
//const DEFAULT_PROFILE_IMAGE = 'https://companysnsspringboot.s3.ap-northeast-2.amazonaws.com/default-profile.png';
//const DEFAULT_PROFILE_IMAGE = require('../assets/default-profile.png'); // 로컬 이미지 경로
export default function HomeScreen({ route, extraData }) {
  //console.log('DEFAULT_PROFILE_IMAGE:', DEFAULT_PROFILE_IMAGE); // 디버깅 로그 추가
  const userid = extraData?.userid || (route.params && route.params.userid);
  console.log('Received userid in HomeScreen:', userid); // 디버깅 로그 추가

  const navigation = useNavigation(); // useNavigation 훅 추가
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]); // 이미지 상태 추가

 //useEffect(() => {
    const fetchProfile = async () => {
      if (!userid) {
        console.log('No userid provided');
        return;
      }

      try {
        console.log('Fetching profile for userid:', userid);
        const response = await axios.get(`${API_BASE_URL}/api/profile/${userid}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Profile data:', response.data);
        setProfile(response.data);
      } catch (error) {
        console.log('Error fetching profile data:', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Request data:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
        Alert.alert('프로필 이미지를 불러오지 못하였습니다.');
        console.log('Error message:', error.message);
      }
    };

    const fetchImages = async () => { // 이미지 가져오는 함수 추가
        if (!userid) {
          console.log('No userid provided');
          return;
        }
  
        try {
          const response = await axios.get(`${API_BASE_URL}/api/images?userid=${userid}`);
          //console.log('Images data:', response.data);
          setImages(response.data);
        } catch (error) {
          console.log('Error fetching images:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchImages();
      }, [userid]);
    
      useFocusEffect(
        useCallback(() => {
          fetchImages(); // 화면이 포커스를 받을 때마다 이미지 다시 가져오기
        }, [userid])
      );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        name: 'profile.jpg',
        type: 'image/jpeg'
      });
      formData.append('userid', userid);
      console.log('formData:', formData);
      console.log('formData.uri:', result.assets[0].uri);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/profile/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log('Upload response:', response.data);
        setProfile(prevProfile => ({ ...prevProfile, profileImage: response.data.url }));
      } catch (error) {
        console.log('Error uploading image:', error);
      }
    }
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직 추가
    Alert.alert('로그아웃 하였습니다.');
    navigation.navigate('Login'); // 예시: 로그인 화면으로 이동
  };

  const handleImagePress = (image) => {
    navigation.navigate('컨텐츠', { image }); // 이미지 클릭 시 ImageDetailScreen으로 이동
  };

  //const renderItem = ({ item }) => ( // renderItem 함수 추가
  //  <Image source={{ uri: item.imageUrl }} style={styles.image} />
  //);
  const renderItem = ({ item }) => ( // renderItem 함수 추가
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );


  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.username}>{profile.name}</Text>
      </View>
      {images && images.length > 0 ? ( // profile.images에서 images로 변경
        <FlatList
          data={images} // profile.images에서 images로 변경
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row} // 추가된 스타일
          style={styles.grid}
        />
      ) : (
        <View style={styles.noImagesContainer}>
          <Text style={styles.noImagesText}>이미지가 없습니다</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerContainer: { // 헤더 컨테이너 스타일 추가
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    flex: 1,
  },
  image: {
    width: imageSize,
    height: imageSize,
    margin: 1,
  },
  noImagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    fontSize: 16,
    color: 'gray',
  },
});
