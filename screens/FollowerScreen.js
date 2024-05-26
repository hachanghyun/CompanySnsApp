import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
import { useFocusEffect } from '@react-navigation/native';

export default function FollowerScreen({ route }) {
  const { userid } = route.params;
  const [connections, setConnections] = useState([]);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/connections?userid=${userid}`);
      setConnections(response.data);
      console.log('response:', response.data);
    } catch (error) {
      console.log('Error fetching connections:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConnections();
    }, [userid])
  );

  const handleUnfollow = async (connectionId) => {
    try {
      console.log('connectionId', connectionId);
      await axios.post(`${API_BASE_URL}/api/unfollow?userid=${userid}&followUserid=${connectionId}`);
      Alert.alert('팔로우 취소 성공');
      // 최신 연결 목록을 다시 가져옵니다
      fetchConnections();
    } catch (error) {
      console.log('Error unfollowing user:', error);
      Alert.alert('팔로우 취소 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={connections}
        keyExtractor={(item) => item.userid}
        renderItem={({ item }) => (
          <View style={styles.connectionContainer}>
            <Text>{item.name} ({item.userid})</Text>
            <Button title="팔로우 취소" onPress={() => handleUnfollow(item.userid)} />
          </View>
        )}
        extraData={connections}
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
  connectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
