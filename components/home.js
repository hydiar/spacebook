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

import AsyncStorage from '@react-native-async-storage/async-storage';

import NavBar from "./navigationbar";
import Post from "./post";
import styles from "../styles"
import { useEffect, useState } from "react";

function HomeScreen({ navigation }) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

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


    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    let apiKey

    const getPosts = async () => {
        const userID = await getID()
        apiKey = await getKey()
        const url = "http://localhost:3333/api/1.0.0/user/" + userID + "/post"
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
        getPosts();
    }, []);


    //const posts = ["hello", "here I am"]

    //{posts.map(postText =>  <Post text={postText}/>)}

    //keyExtractor={({ id }, index) => id}

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <ScrollView style={styles.scrollView}>

                    <View>
                        {isLoading ? <ActivityIndicator/> : (
                            <FlatList
                                data={data}

                                keyExtractor={(item) => {
                                    return item.post_id;
                                }}
                                renderItem={({ item }) => (
                                    <Post
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
