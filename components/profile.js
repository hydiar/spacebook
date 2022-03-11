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
    ActivityIndicator,
    FlatList
} from 'react-native';

import { getKey, getID } from "../scripts/asyncstore"

import NavBar from "./navigationbar";
import ProfilePic from "./profilepic";
import styles from "../styles"
import { useEffect, useState } from "react";
import HomeScreen from "./home";
import {useNavigation} from "@react-navigation/native";

function Profile({route}, props) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [isLoading, setLoading] = useState(true); //TODO
    const [data, setData] = useState([]);

    const navigation = useNavigation();

    const getUserData = async () => {
        const apiKey = await getKey()
        const url = "http://localhost:3333/api/1.0.0/user/" + route.params.userID
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

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <ScrollView>

                    <ProfilePic style={{marginLeft: 15}}
                        userID = {route.params.userID}
                        multiplier = {4}
                    />

                    <Text style={{color: "white", fontSize: 24, paddingTop: 5}}>
                        {data.first_name + " " + data.last_name}
                    </Text>

                </ScrollView>

            </View>
        </ImageBackground>
    );
}

export default Profile;