'use strict';

import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TextInput,
    Button,
    TouchableOpacity,
    Linking,
    Dimensions } from "react-native";

import { storeKey, storeID } from "../scripts/asyncstore"

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Home from "../components/home"
import styles from "../styles"

import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function WelcomeScreen({ navigation }) {
    let logo_size = windowWidth / 2

    if (windowHeight < windowWidth) {
        logo_size = windowWidth / 5
    }

    //let or const?
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let key = ""
    let id = ""

    async function Login() {
        const url = "http://127.0.0.1:3333/api/1.0.0/login"; //for testing on phone
        let jsonRaw
        let result = fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // body :
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
            .then((response) => response.json())
            .then((json) => {
                key = json['token']
                id = json['id']
            })
            .catch((error) => console.log(error));

        await result
        if (key != "") {
            //set key in global secure storage
            await storeKey(key)
            await storeID(id)
            navigation.navigate('Home')
        }
    }

    return (

        <ImageBackground source={require("../assets/stars.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={styles.container}>

                <Image source={require("../assets/icon.png")}
                       style={{width: logo_size, height: logo_size}}
                />

                <TextInput
                    style={styles.input}
                    placeholder={"Email address"}
                    onChangeText={(email) => setEmail(email)}
                    returnKeyType = "done"
                />

                <TextInput
                    style={styles.input}
                    placeholder={"Password"}
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    returnKeyType = "go"
                    onKeyPress={(ev) => {
                        if (ev.key === "Enter") {
                            navigation.navigate('Home');
                        }
                    }}
                />

                <View style={{flexDirection: 'row'}}>
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.95}
                            style={[styles.button, {backgroundColor: '#E03E69'}]}
                            //onPress={() => navigation.navigate('Home')}>
                            onPress={() => navigation.navigate('Register')}>

                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            activeOpacity={0.95} style={styles.button}
                            onPress={() => Login()}>

                        <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={{height: windowHeight/14}}></View>

            </View>
        </ImageBackground>
    );
}
export default WelcomeScreen;
