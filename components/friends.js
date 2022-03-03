'use strict';

import * as React from 'react';
import {
    View,
    ImageBackground,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    Text,
    Button,
    ScrollView,
    ActivityIndicator,
    FlatList
} from "react-native";

import { getKey, getID } from "./asyncstore"

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { useEffect, useState } from "react";

import styles from "../styles"
import NavBar from "./navigationbar";
import Post from "./post";

function FriendElement(props) {

    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;

    let icon_size = windowWidth / 7

    const [isLoading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState([]);

    const getProfilePic = async () => {
        try {
            const response = await  fetch("http://localhost:3333/api/1.0.0/user/" + props.userID + "/photo", {
                method: 'GET',
                headers: {
                    'X-Authorization': await getKey(),
                }
            });
            const blob = await response.blob();
            const pic = URL.createObjectURL(blob)
            setProfilePic(pic);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfilePic();
    }, []);

    return (
        <View style={{marginLeft: 15, marginTop: 7, alignItems: 'top'}}>
            <View style={{flexDirection: 'row', alignItems: "flex-start"}}>
                <TouchableHighlight style={{padding: 15, paddingLeft: 0}} onPress={() => navigation.navigate('Welcome')}>
                    <View>
                        {isLoading ? <ActivityIndicator/> : (
                            <Avatar
                                size={icon_size * 0.85}
                                rounded
                                source={profilePic}
                                title="Search"
                                containerStyle={{ backgroundColor: 'white' }}
                            />
                        )}
                    </View>
                </TouchableHighlight>

                <View>
                    <Text style={{paddingTop: icon_size/3, color: "white", fontSize: 20}}>{props.fname + " " + props.lname}</Text>
                    <Text style={{color: "white", fontSize: 12}}>Space, The Universe</Text>
                </View>
            </View>
        </View>
    );
}

function Friends() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getFriends = async () => {
        const userID = await getID()
        let apiKey = await getKey()
        const friendUrl = "http://localhost:3333/api/1.0.0/user/" + userID + "/friends"
        try {
            const response = await fetch(friendUrl, {
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
        getFriends();
    }, []);
    console.log(data)

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <ScrollView>

                    <View>
                        <Text style={{color: "white", fontSize: 24, paddingLeft: 27, paddingTop: 25}}>
                            Your Friends
                        </Text>
                    </View>

                    <View>
                        {isLoading ? <ActivityIndicator/> : (
                            <FlatList
                                data={data}

                                keyExtractor={(item) => {
                                    return item.user_id;
                                }}
                                renderItem={({ item }) => (
                                    <View style={{paddingLeft: 10}}>
                                        <FriendElement
                                            userID = {item.user_id}
                                            fname = {item.user_givenname}
                                            lname = {item.user_familyname}
                                        />
                                    </View>

                                )}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>

    );
}
export default Friends;