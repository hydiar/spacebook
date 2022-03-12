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
    FlatList, TouchableOpacity
} from 'react-native';

import { getKey, getID } from "../scripts/asyncstore"

import NavBar from "./navigationbar";
import ProfilePic from "./profilepic";
import styles from "../styles"
import { useEffect, useState } from "react";
import {useNavigation} from "@react-navigation/native";
import Post from "./post";

function Profile({route}, props) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [isLoadingUser, setUserLoading] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
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
            setUserData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setUserLoading(false);
        }
    }

    const getUserPosts = async () => {
        const apiKey = await getKey()
        const url = "http://localhost:3333/api/1.0.0/user/" + route.params.userID + "/post"
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
        getUserPosts();
    }, []);

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <ScrollView>

                    <View style={{alignItems: 'center', padding: 12}}>
                        <ProfilePic
                            userID = {route.params.userID}
                            multiplier = {5}
                        />
                    </View>

                    {isLoadingUser ? <ActivityIndicator/> : (
                        <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: "white", fontSize: 24, padding: 6, paddingTop: 15}}>
                                    {userData.first_name + " " + userData.last_name}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    style={styles.button}
                                    onPress={() => navigation.navigate('Home')}>
                                    <Text style={styles.buttonText}>Friends</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}


                    {isLoading ? <ActivityIndicator/> : (
                        <View>

                            <Text style={{color: "white", fontSize: 24, paddingLeft: 18, paddingTop: 12}}>
                                Posts
                            </Text>

                            <FlatList
                                data={data}

                                keyExtractor={(item) => {
                                    return item.post_id;
                                }}
                                renderItem={({ item }) => (
                                    <Post
                                        postID = {item.post_id}
                                        userID = {item.author.user_id}
                                        fname = {item.author.first_name}
                                        lname = {item.author.last_name}
                                        text = {item.text}
                                        time = {item.timestamp}
                                        likes = {item.numLikes}

                                    />
                                )}
                            />
                        </View>
                    )}


                </ScrollView>

            </View>
        </ImageBackground>
    );
}

export default Profile;