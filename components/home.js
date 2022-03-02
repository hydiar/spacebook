'use strict';

import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    ImageBackground,
    Image,
    TouchableHighlight, Button,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import NavBar from "./navigationbar";
import Post from "./post";
import styles from "../styles"

function HomeScreen({ navigation }) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const getKey = async () => {
        try {
            const value = await AsyncStorage.getItem('@api_Key')
            if(value !== null) {
                return value
            }
        } catch(e) {
            console.log("Error retrieving API Key")
        }
    }

    const getID = async () => {
        try {
            const value = await AsyncStorage.getItem('@ID')
            if(value !== null) {
                return value
            }
        } catch(e) {
            console.log("Error retrieving API Key")
        }
    }

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <ScrollView style={styles.scrollView}>

                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>

                </ScrollView>
            </View>

            <View style={{position: 'absolute', top: windowHeight-(windowHeight/10), left: windowWidth-(windowWidth/4.5)}}>
                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Write Post')}>

                    <Image source={require('../assets/new_post.png')}
                           style={{width: windowWidth/6.5, height: windowWidth/6.5}}/>
                </TouchableHighlight>
            </View>
        </ImageBackground>
    );
}

export default HomeScreen;
