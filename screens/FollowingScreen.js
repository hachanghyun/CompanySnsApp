import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const numColumns = 3;
const { width } = Dimensions.get('window');
const imageSize = (width - 32) / numColumns;

export default function FollowingScreen({ route }) {
  const { userid } = route.params;
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchAllPosts = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/allPosts`, {
            params: { userid },
          });
          setPosts(response.data);
          console.log("response.data",response.data);
        } catch (error) {
          console.log('Error fetching posts:', error);
        }
      };

      fetchAllPosts();
    }, [userid])
  );

  const handleImagePress = (image) => {
    navigation.navigate('컨텐츠', { image });
  };

  //console.log("###test:",image);
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {posts && posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          style={styles.grid}
        />
      ) : (
        <View style={styles.noImagesContainer}>
          <Text style={styles.noImagesText}>게시물이 없습니다</Text>
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
