'use strict';

import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    ImageBackground,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Button,
    TextInput
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-elements';

import NavBar from "./navigationbar"
import styles from "../styles"
import {useState} from "react";

function WritePost({ navigation }) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [postText, setPostText] = useState("");

    let icon_size = windowWidth / 7

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

    async function SubmitPost() {
        if (postText != "") {
            const userID = await getID()
            const apiKey = await getKey()
            const url = "http://127.0.0.1:3333/api/1.0.0/user/" + userID + "/post";
            let result = fetch(url, {
                method: 'POST',
                headers: {
                    'X-Authorization': apiKey,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                // body :
                body: JSON.stringify({
                    text: postText,
                })
            })
                //.then((response) => response.json())
                .then((response) => response.json())
                .then((json) => console.log(json))

                .catch((error) => console.log(error));

            await result
            navigation.navigate('Home')
        }


    }

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{alignItems: 'top'}}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <NavBar />
                    </View>

                </View>
            </View>

            <View style={{marginLeft: 15, marginTop: 7, alignItems: 'top'}}>
                <View style={{flexDirection: 'row', alignItems: "flex-start"}}>
                    <TouchableHighlight style={{padding: 15, paddingLeft: 0}} onPress={() => navigation.navigate('Welcome')}>
                        <View>
                            <Avatar
                                size={icon_size * 0.85}
                                rounded
                                source={{ uri: 'https://randomuser.me/api/portraits/men/99.jpg' }}
                                title="Search"
                                containerStyle={{ backgroundColor: 'white'  }}
                            />
                        </View>
                    </TouchableHighlight>

                    <View>
                        <Text style={{paddingTop: icon_size/3, color: "white", fontSize: 20}}>Harold Parold</Text>
                        <Text style={{color: "white", fontSize: 12}}>Change this text or remove ...</Text>
                    </View>
                </View>
            </View>

            <View style={{alignItems: 'center'}}>
                <ScrollView style={styles.scrollView}>

                    <TextInput
                        style={styles.inputBox}
                        multiline
                        placeholder={"Tell people about your space adventures ..."}
                        onChangeText={(postText) => setPostText(postText)}
                        returnKeyType = "done"
                    />

                </ScrollView>

                <View style={{flexDirection: 'row'}}>
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.95}
                            style={[styles.button, {backgroundColor: '#E03E69', width: windowWidth/2.2, margin: 6}]}
                            //onPress={() => navigation.navigate('Home')}>
                            onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.buttonText}>Save as Draft</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            activeOpacity={0.95} style={[styles.button, {width: windowWidth/2.2, margin: 6}]}
                            onPress={() => SubmitPost()}>

                            <Text style={styles.buttonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </ImageBackground>
    );
}

export default WritePost;
