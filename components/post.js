'use strict';

import * as React from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    Dimensions,
    Text,
    Share,
    TouchableOpacity
} from "react-native";

import { getKey, getID } from "../scripts/asyncstore"
import {ProfileElement} from "./profileelement";

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import styles from "../styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

//TODO allow users to click on a post and it take them to a view of just that post


function Post(props) {
    const windowWidth = Dimensions.get('window').width;

    const navigation = useNavigation();

    let icon_size = windowWidth / 7

    const [likeNum, setLikeNum] = useState(true);

    const [isEditable, setIsEditable] = useState(false);

    async function LikeAction(userID, postID) {
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
                setLikeNum(likeNum+1)
            }
            else {
                try {
                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'X-Authorization': apiKey,
                            'Accept': '*/*'
                        }
                    })
                    if (await response.ok) {
                        console.log("Post " + postID + " like successfully removed")
                        setLikeNum(likeNum-1)
                    }
                    else {
                        console.log("Removing post " + postID + " like unsuccessful")
                    }

                } catch (error) {
                    console.error(error);
                }
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
            setLikeNum(jsonPost.numLikes)

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        GetNumLikes(props.userID, props.postID);
        if (props.iseditable == "true") {
            setIsEditable(true)
        }

    }, []);

    const sharePost = async (postText) => {
        try {
            const result = await Share.share({
                message:
                    props.text
            });
            if (result.action === Share.sharedAction) {
                console.log("Shared")
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={{marginLeft: 15, marginRight: 10}}>
            <View style={{flexDirection: 'row'}}>
                <ProfileElement
                    userID = {props.userID}
                    time = {props.time}
                    name = {props.fname + " " + props.lname}
                />
                <View style={{paddingTop: icon_size/6}}>
                    {isEditable ?
                        <TouchableOpacity
                            activeOpacity={0.95}
                            style={[styles.button, {width: icon_size/2, height: icon_size/2}]}
                            onPress={() => navigation.navigate('Settings')}>
                            <Image source={require('../assets/edit.png')}
                                   style={{width: icon_size/3, height: icon_size/3}}/>
                        </TouchableOpacity>
                        : <View/>
                    }
                </View>
            </View>


            <Text style={{color: "white", fontSize: 20, width: windowWidth*0.9}}
                  onPress={() => navigation.navigate('Post', {
                      postID: props.postID,
                      postUserID: props.userID
                  })}
            >
                {props.text}
            </Text>

            <View style={{flexDirection: 'row'}}>

                <TouchableHighlight style={{paddingTop: 3}} onPress={() => navigation.navigate('Welcome')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/like_button.png')}
                               style={{width: icon_size/3, height: icon_size/3}}/>
                        <Text style={{padding: icon_size/12, color: "white", fontSize: 11}}>{likeNum}</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={{position: 'absolute', right: 10}}
                                    onPress={() => navigation.navigate('Post', {
                                        postID: props.postID,
                                        postUserID: props.userID
                                    })}
                >
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{padding: icon_size/15, color: "white", fontSize: 11}}>0</Text>
                        <Image source={require('../assets/comment_button.png')}
                               style={{width: icon_size/3, height: icon_size/3}}/>
                    </View>
                </TouchableHighlight>
            </View>

            <View style={{flexDirection: 'row', alignItems: "flex-start", paddingBottom: 6}}>
                <TouchableHighlight style={styles.navButton} onPress={() => LikeAction(props.userID, props.postID)}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/like_button.png')}
                               style={{width: icon_size/2, height: icon_size/2}}/>
                        <Text style={{padding: icon_size/8, color: "white", fontSize: 14}}>Like</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Post', {
                    postID: props.postID,
                    postUserID: props.userID
                })}
                >
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../assets/comment_button.png')}
                            style={{width: icon_size/2, height: icon_size/2}}/>
                        <Text style={{padding: icon_size/8, color: "white", fontSize: 14}}>Comment</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => sharePost()}>
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
