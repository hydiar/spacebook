'use strict';

import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './components/home'
import WelcomeScreen from './components/welcome'
import NavBar from './components/navigationbar'
import Register from './components/register'
import WritePost from './components/writepost'

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Write Post" component={WritePost} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
