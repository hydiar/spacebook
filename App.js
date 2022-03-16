'use strict';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { storeApiUrl } from './scripts/asyncstore';
import HomeScreen from './components/home';
import WelcomeScreen from './components/welcome';
import Register from './components/register';
import WritePost from './components/writepost';
import Friends from './components/friends';
import Settings from './components/settings';
import Search from './components/search';
import Notifications from './components/notifications';
import Profile from './components/profile';
import MyProfile from './components/myprofile';
import SpecificPost from './components/specificpost';
import EditPost from './components/editpost';

function App() {
  const Stack = createNativeStackNavigator();

  //Stores the API URL for the entire application
  async function saveApiUrl() {
    await storeApiUrl('http://127.0.0.1:3333/api/1.0.0/'); //This URL MUST end with a "/" character
  }

  useEffect(() => {
    saveApiUrl();
  }, []);

  //Sets up the navigation stack and creates routes for all screen components,
  // then navigates to 'Welcome' screen
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={ WelcomeScreen } />
        <Stack.Screen name="Home" component={ HomeScreen } />
        <Stack.Screen name="Register" component={ Register } />
        <Stack.Screen name="Write Post" component={ WritePost } />
        <Stack.Screen name="Friends" component={ Friends } />
        <Stack.Screen name="Notifications" component={ Notifications } />
        <Stack.Screen name="Settings" component={ Settings } />
        <Stack.Screen name="Search" component={ Search } />
        <Stack.Screen name="Profile" component={ Profile } />
        <Stack.Screen name="My Profile" component={ MyProfile } />
        <Stack.Screen name="Post" component={ SpecificPost } />
        <Stack.Screen name="Edit Post" component={ EditPost } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
