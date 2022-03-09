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

import { getKey, getID } from "../scripts/asyncstore"

import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";

import styles from "../styles"
import NavBar from "./navigationbar";
import {ProfileElement} from "./profileelement";

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
                                    <View style={{marginLeft: 25}}>
                                        <ProfileElement
                                            userID = {item.user_id}
                                            desc = "The Universe, Space"
                                            name = {item.user_givenname + " " + item.user_familyname}
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
