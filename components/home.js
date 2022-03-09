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
import Post from "./post";
import styles from "../styles"
import { useEffect, useState } from "react";

function HomeScreen({ navigation }) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getAllPosts = async () => {
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
            const jsonFriends = await response.json();
            let postArray = []
            for (let i = 0; i < jsonFriends.length; i++) {

                const urlPosts = "http://localhost:3333/api/1.0.0/user/" + jsonFriends[i].user_id + "/post"
                try {
                    const response = await fetch(urlPosts, {
                        method: 'GET',
                        headers: {
                            'X-Authorization': apiKey
                        }
                    });
                    const jsonPosts = await response.json();
                    for (let i = 0; i < jsonPosts.length; i++) {
                        postArray.push(jsonPosts[i]);
                    }

                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }

            }
            postArray.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            })
            setData(postArray)

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllPosts();
    }, []);


    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <ScrollView>

                    <View>
                        {isLoading ? <ActivityIndicator/> : (
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
                        )}
                    </View>

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
