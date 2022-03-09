'use strict';

import * as React from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    Dimensions,
    Text,
    Button, ActivityIndicator
} from "react-native";

import { getKey, getID } from "../scripts/asyncstore"
import {ProfileElement} from "./profileelement";

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import styles from "../styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";


function Post(props) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();

    let icon_size = windowWidth / 7

    const [numLikes, setNumLikes] = useState(true);
    const [liked, setLiked] = useState(true);

    async function LikePost(userID, postID) {
        const apiKey = await getKey()
        const url = "http://127.0.0.1:3333/api/1.0.0/user/" + userID + "/post/" + postID + "/like";

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-Authorization': apiKey,
                    'Accept': '*/*'
                }
            })
            if (await response.ok) {
                console.log("Post " + postID + " successfully liked")
            }
            else {
                console.log("Liking post " + postID + " unsuccessful")
            }

        } catch (error) {
            console.error(error);
        }
    }

    async function GetNumLikes(userID, postID) {
        const apiKey = await getKey()
        const url = "http://127.0.0.1:3333/api/1.0.0/user/" + userID + "/post/" + postID;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Authorization': apiKey
                }
            });
            const jsonPost = await response.json();
            setNumLikes(jsonPost.numLikes)

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{marginLeft: 15, marginRight: 10}}>
            <ProfileElement
                userID = {props.userID}
                time = {props.time}
                name = {props.fname + " " + props.lname}
            />

            <Text style={{color: "white", fontSize: 20}}>
                {props.text}
            </Text>

            <View style={{flexDirection: 'row'}}>

                <TouchableHighlight style={{paddingTop: 3}} onPress={() => navigation.navigate('Welcome')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/like_button.png')}
                               style={{width: icon_size/3, height: icon_size/3}}/>
                        <Text style={{padding: icon_size/12, color: "white", fontSize: 11}}>{props.likes}</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={{position: 'absolute', right: 10}} onPress={() => navigation.navigate('Welcome')}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{padding: icon_size/15, color: "white", fontSize: 11}}>3</Text>
                        <Image source={require('../assets/comment_button.png')}
                               style={{width: icon_size/3, height: icon_size/3}}/>
                    </View>
                </TouchableHighlight>
            </View>

            <View style={{flexDirection: 'row', alignItems: "flex-start", paddingBottom: 6}}>
                <TouchableHighlight style={styles.navButton} onPress={() => LikePost(props.userID, props.postID)}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/like_button.png')}
                               style={{width: icon_size/2, height: icon_size/2}}/>
                        <Text style={{padding: icon_size/8, color: "white", fontSize: 14}}>Like</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/comment_button.png')}
                            style={{width: icon_size/2, height: icon_size/2}}/>
                        <Text style={{padding: icon_size/8, color: "white", fontSize: 14}}>Comment</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/share_button.png')}
                            style={{width: icon_size/2, height: icon_size/2}}/>
                        <Text style={{padding: icon_size/8, color: "white", fontSize: 14}}>Share</Text>
                    </View>
                </TouchableHighlight>
            </View>

        </View>
    );
}

export default Post;
