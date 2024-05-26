import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ImageDetailScreen({ route }) {
  const { image } = route.params;
  console.log('image:', image);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.headerRightText}>{image.username || 'Unknown User'}</Text>
      ),
    });
  }, [navigation, image]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{image.title}</Text>
      <Image source={{ uri: image.imageUrl }} style={styles.image} />
      <Text style={styles.description}>{image.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  headerRightText: {
    marginRight: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
