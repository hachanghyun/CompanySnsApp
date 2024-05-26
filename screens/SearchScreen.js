import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen({ route }) {
  const { userid } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/search?userid=${userid}&query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.log('Error searching users:', error);
      Alert.alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleFollow = async (followUserid) => {
    try {
      // 팔로우 상태 확인
      const checkFollowResponse = await axios.get(`${API_BASE_URL}/api/isFollowing?userid=${userid}&followUserid=${followUserid}`);

      if (checkFollowResponse.data) {
        Alert.alert('이미 팔로우 중입니다.');
        return;
      }

      // 팔로우 요청
      console.log('followUserid:', userid, followUserid);
      const response = await axios.post(`${API_BASE_URL}/api/follow?userid=${userid}&followUserid=${followUserid}`);
      Alert.alert('팔로우 성공');
    } catch (error) {
      console.log('Error following user:', error);
      Alert.alert('팔로우 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="사용자 아이디 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="검색" onPress={handleSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.userid}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text>{item.name} ({item.userid})</Text>
            <Button title="팔로우" onPress={() => handleFollow(item.userid)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
