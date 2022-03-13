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

function SpecificPost({ route }) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    console.log("post ID: " + route.params.postID)

    const getPost = async () => {
        const userID = route.params.postUserID
        const postID = route.params.postID
        let apiKey = await getKey()
        const url = "http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Authorization': apiKey
                }
            });
            const json = await response.json();
            setData(json)

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPost();
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
                            <Post
                                postID = {data.post_id}
                                userID = {data.author.user_id}
                                fname = {data.author.first_name}
                                lname = {data.author.last_name}
                                text = {data.text}
                                time = {data.timestamp}
                                likes = {data.numLikes}

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

export default SpecificPost;
