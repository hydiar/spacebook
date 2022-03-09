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

//TODO fix register so that it properly logs the user in once registered

function WelcomeScreen({ navigation }) {
    let logo_size = windowWidth / 2

    if (windowHeight < windowWidth) {
        logo_size = windowWidth / 5
    }

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    let key = ""
    let id = ""

    async function Register() {
        if (password == passwordConfirm ) {
            if (firstName != "" && lastName != "" && email != "") {
                //const url = "http://192.168.1.53:3333/api/1.0.0/login";
                const url = "http://127.0.0.1:3333/api/1.0.0/user"; //for testing on phone
                let result = fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    })
                })
                    .then((response) => response.json())
                    .then((json) => key = json['token'])
                    .then((json) => id = json['id'])

                    .catch((error) => console.log(error));

                await result
                if (key != "") {
                    //set key in global secure storage
                    await storeKey(key)
                    await storeID(id)
                    navigation.navigate('Home')
                }
            }
            else {
                console.log("All fields are mandatory")
            }
        }
        else {
            console.log("Passwords do not match")

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
                    placeholder={"First Name"}
                    onChangeText={(firstName) => setFirstName(firstName)}
                    returnKeyType = "done"
                />

                <TextInput
                    style={styles.input}
                    placeholder={"Last Name"}
                    onChangeText={(lastName) => setLastName(lastName)}
                    returnKeyType = "done"
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
                    onChangeText={(passwordConfirm) => setPasswordConfirm(passwordConfirm)}
                    returnKeyType = "done"
                />

                <TextInput
                    style={styles.input}
                    placeholder={"Confirm Password"}
                    secureTextEntry={true}
                    onChangeText={
                    (password) => setPassword(password)
                }
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
                            style={[styles.button, {backgroundColor: '#E03E69', width: windowWidth*0.75}]}
                            //onPress={() => navigation.navigate('Home')}>
                            onPress={() => Register()}>

                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={{height: windowHeight/14}}></View>

            </View>
        </ImageBackground>
    );
}
export default WelcomeScreen;
