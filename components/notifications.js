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
    TextInput,
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


function Notifications() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    let icon_size = windowWidth / 18

    const navigation = useNavigation();

    const [isLoading, setLoading] = useState(true);
    const [searchTerms, setSearchTerms] = useState(true);
    const [data, setData] = useState([]);

    const getFriendRequests = async (searchTerms) => { //also get existing friends, make it so you can't add your friends again (different buttons)
        let apiKey = await getKey()
        const friendUrl = "http://localhost:3333/api/1.0.0/friendrequests"
        try {
            const response = await fetch(friendUrl, {
                method: 'GET',
                headers: {
                    'X-Authorization': apiKey,
                    'accept': 'application/json'
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
        getFriendRequests();
    }, []);


    function Refresh() {
        navigation.reset({
            index: 0,
            routes: [{name: 'Welcome'}]
        })
        navigation.navigate('Notifications')
    }

    function UserElement(props) {

        async function Accept(userID) {
            const apiKey = await getKey()
            const url = "http://127.0.0.1:3333/api/1.0.0/friendrequests/" + userID ;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-Authorization': apiKey,
                        'Accept': '*/*'
                    }
                })
                if (await response.ok) {
                    console.log("Friend request from " + userID + " accepted")
                }
                else {
                    console.log("Friend request not accepted successfully")
                }

                Refresh()

            } catch (error) {
                console.error(error);
            }
        }

        async function Reject(userID) {
            const apiKey = await getKey()
            const url = "http://127.0.0.1:3333/api/1.0.0/friendrequests/" + userID ;

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'X-Authorization': apiKey,
                        'Accept': '*/*'
                    }
                })
                if (await response.ok) {
                    console.log("Friend request from " + userID + " rejected")
                }
                else {
                    console.log("Friend request not rejected successfully")
                }

                Refresh()

            } catch (error) {
                console.error(error);
            }

        }

        return(
            <View style={{flexDirection: 'row'}}>
                <ProfileElement
                    userID = {props.user_id}
                    desc = "The Universe, Space"
                    name = {props.fname + " " + props.lname}
                />
                <View style={{position: 'absolute', top: windowWidth/20, left: windowWidth-(windowWidth/2.8)}}>
                    <TouchableOpacity
                        activeOpacity={0.95} style={styles.friendButton}
                        onPress={() => Accept(props.user_id)}>
                        <Image source={require('../assets/accept.png')}
                               style={{width: icon_size, height: icon_size}}/>
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute', top: windowWidth/20, left: windowWidth-(windowWidth/4.3)}}>
                    <TouchableOpacity
                        activeOpacity={0.95} style={[styles.friendButton, {backgroundColor: '#D41455'}]}
                        onPress={() => Reject(props.user_id)}>

                        <Image source={require('../assets/reject.png')}
                               style={{width: icon_size, height: icon_size}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View>
                    <NavBar />
                </View>

                <View>
                    <Text style={{color: "white", fontSize: 24, paddingLeft: 27, paddingTop: 25}}>
                        Friend Requests
                    </Text>
                </View>

                <ScrollView>
                    <View>
                        {isLoading ? <ActivityIndicator/> : (
                            <FlatList
                                data={data}

                                keyExtractor={(item) => {
                                    return item.user_id;
                                }}
                                renderItem={({ item }) => (
                                    <View style={{marginLeft: 25}}>
                                        <UserElement
                                            user_id = {item.user_id}
                                            fname = {item.first_name}
                                            lname = {item.last_name}
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
export default Notifications;
