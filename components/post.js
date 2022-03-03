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

import { getKey, getID } from "./asyncstore"

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import {getProfilePic} from "./functions";
import styles from "../styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

function Post(props) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();

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

    const formatDate = (dateString) => {
        const options = { hour: "numeric", minute: "numeric", year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    let icon_size = windowWidth / 7

    return (
        <View style={{marginLeft: 15, marginRight: 10}}>
            <View style={{flexDirection: 'row', alignItems: "flex-start"}}>
                <TouchableHighlight style={{padding: 15, paddingLeft: 0}} onPress={() => navigation.navigate('Welcome')}>
                    <View>
                        {isLoading ? <ActivityIndicator/> : (
                            <Avatar
                                size={icon_size * 0.85}
                                rounded
                                source={profilePic}
                                title="Profile Picture"
                                containerStyle={{ backgroundColor: 'white'  }}
                            />
                        )}
                    </View>
                </TouchableHighlight>

                <View>
                    <Text style={{paddingTop: icon_size/3, color: "white", fontSize: 20}}>
                        {props.fname + " " + props.lname}
                    </Text>
                    <Text style={{color: "white", fontSize: 12}}>{formatDate(props.time)}</Text>
                </View>
            </View>

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
                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
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
