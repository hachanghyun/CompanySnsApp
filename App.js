import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // 아이콘 사용을 위해 추가
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import ImageDetailScreen from './screens/ImageDetailScreen';
import FollowingScreen from './screens/FollowingScreen';
import SearchScreen from './screens/SearchScreen';
import FollowerScreen from './screens/FollowerScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs({ route }) {
  const { userid } = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Homes') {
            iconName = 'home';
          } else if (route.name === 'Upload') {
            iconName = 'cloud-upload';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato', // 활성화된 탭 색상
        tabBarInactiveTintColor: 'gray', // 비활성화된 탭 색상
      })}
    >
      <Tab.Screen
        name="Following"
        component={FollowingScreen}
        initialParams={{ userid }}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
          />
        <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        initialParams={{ userid }} 
        options={{ 
      title: '검색',           tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Followers" 
        component={FollowerScreen} 
        initialParams={{ userid }} 
        options={{ 
          title: '팔로워',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen} 
        initialParams={{ userid }} 
        options={{ 
          title: '컨텐츠 업로드',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="cloud-upload" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Homes" 
        component={HomeScreen} 
        initialParams={{ userid }} 
        options={{ 
          title: '사용자',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '회원가입' }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="컨텐츠" component={ImageDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
