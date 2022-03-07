'use strict';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/home';
import WelcomeScreen from './components/welcome';
import Register from './components/register';
import WritePost from './components/writepost';
import Friends from './components/friends';
import Settings from './components/settings';
import Search from "./components/search";

function App() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Write Post" component={WritePost} />
                <Stack.Screen name="Friends" component={Friends} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Search" component={Search} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
