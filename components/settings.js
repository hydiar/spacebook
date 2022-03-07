'use strict';

import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    ImageBackground,
    ActivityIndicator,
    TextInput,
    TouchableOpacity
} from 'react-native';

import {getKey, getID, storeKey, storeID} from "../scripts/asyncstore"

import NavBar from "./navigationbar";
import Post from "./post";
import styles from "../styles"
import { useEffect, useState } from "react";
import {useNavigation} from "@react-navigation/native";

export function UpdateDetail(props) {
    const windowWidth = Dimensions.get('window').width;
    const [inputText, setInputText] = useState("");

    const [data, setData] = useState([]);

    async function UpdateProfile() {
        const userID = await getID()
        const apiKey = await getKey()
        let responseToUpdate = "";
        const url = "http://127.0.0.1:3333/api/1.0.0/user/" + userID;

        let jsonBody;
        if (props.postData == "first_name" && inputText != "") {
            jsonBody = JSON.stringify({
                first_name: inputText
            })
        }
        else if (props.postData == "last_name" && inputText != "") {
            jsonBody = JSON.stringify({
                last_name: inputText
            })
        }
        else if (props.postData == "email" && inputText != "") {
            jsonBody = JSON.stringify({
                email: inputText
            })
        }
        else if (props.postData == "password" && inputText != "") {
            jsonBody = JSON.stringify({
                password: inputText
            })
        }

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'X-Authorization': apiKey,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: jsonBody
            })
            if (await response.ok) {
                console.log(props.buttonText + " updated successfully")
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 7}}>
            <TextInput
                style={styles.edit}
                placeholder={props.textField}
                secureTextEntry={props.isPassword}
                onChangeText={(inputText) => setInputText(inputText)}
            />

            <TouchableOpacity
                activeOpacity={0.95}
                style={[styles.button, {backgroundColor: '#E03E69', width: windowWidth*0.32}]}
                //onPress={() => navigation.navigate('Home')}>
                onPress={() => UpdateProfile()}>
                    <Text style={styles.editButtonText}>Update {props.buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

function Settings() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const navigation = useNavigation();

    const getUserData = async () => {
        const userID = await getID()
        const apiKey = await getKey()
        const url = "http://localhost:3333/api/1.0.0/user/" + userID
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Authorization': apiKey
                }
            });
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    async function Logout() {
        const apiKey = await getKey();
        let logoutSuccess;
        const url = "http://127.0.0.1:3333/api/1.0.0/logout";
        let result = fetch(url, {
            method: 'POST',
            headers: {
                'X-Authorization': apiKey
            }
        })  //add check whether logout api was connected to before clearing variables and logging out
            .catch((error) => console.log(error));
        await result
        await storeKey(null)
        await storeID(null)

        navigation.reset({
            index: 0,
            routes: [{name: 'Welcome'}]
        })
        navigation.navigate('Welcome')

    }

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View>
                <View>
                    <NavBar />
                </View>

                <ScrollView>
                    <View>
                        <Text style={{color: "white", fontSize: 24, paddingLeft: 27, paddingTop: 25}}>
                            Menu
                        </Text>

                        <Text style={{color: "white", fontSize: 16, paddingLeft: 27, paddingTop: 18}}>
                            Update Personal Info
                        </Text>
                    </View>

                    <View style={{marginLeft: 27}}>
                        {isLoading ? <ActivityIndicator/> : (
                            <UpdateDetail
                                textField = {data.first_name}
                                buttonText = "first name"
                                postData = "first_name"
                            />
                        )}
                        {isLoading ? <ActivityIndicator/> : (
                            <UpdateDetail
                                textField = {data.last_name}
                                buttonText = "last name"
                                postData = "last_name"
                            />
                        )}
                        {isLoading ? <ActivityIndicator/> : (
                            <UpdateDetail
                                textField = {data.email}
                                buttonText = "email"
                                postData = "email"
                            />
                        )}
                        {isLoading ? <ActivityIndicator/> : (
                            <UpdateDetail
                                buttonText = "password"
                                postData = "password"
                                isPassword = {true}
                            />
                        )}
                    </View>

                    <View style={{alignItems: 'center', padding: 5}}>
                        <TouchableOpacity
                            activeOpacity={0.95}
                            style={[styles.button, {width: windowWidth*0.5}]}
                            onPress={() => Logout()}>
                                <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}

export default Settings;