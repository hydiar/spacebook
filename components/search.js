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

//TODO Make it so that your own account doesn't appear in the search
//TODO Make it impossible to click 'add friend' twice

function Search() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    let icon_size = windowWidth / 16

    const navigation = useNavigation();

    const [isLoading, setLoading] = useState(true);
    const [searchTerms, setSearchTerms] = useState(true);
    const [data, setData] = useState([]);

    const getUsers = async (searchTerms) => { //also get existing friends, make it so you can't add your friends again (different buttons)
        const userID = await getID()
        let apiKey = await getKey()

        let searchQuery = "";
        if (searchTerms && (searchTerms != "") && (searchTerms != " ")) {
            searchQuery = "?q=" + searchTerms + "&limit=20&offset=0"
            searchQuery = searchQuery.replace(' ', '%20')
        }

        const friendUrl = "http://localhost:3333/api/1.0.0/search" + searchQuery
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
        getUsers();
    }, []);

    function refreshResults() {
        getUsers(searchTerms);
    }

    function UserElement(props) {

        async function AddFriend(userID) {
            const apiKey = await getKey()
            const url = "http://127.0.0.1:3333/api/1.0.0/user/" + userID + "/friends";

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-Authorization': apiKey,
                        'Accept': '*/*'
                    }
                })
                if (await response.ok) {
                    console.log("Friend " + userID + " added successfully")
                }
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
                <View style={{position: 'absolute', top: windowWidth/20, left: windowWidth-(windowWidth/3.2)}}>
                    <TouchableOpacity
                        activeOpacity={0.95} style={styles.addButton}
                        onPress={() => AddFriend(props.user_id)}>
                        <Image source={require('../assets/add_friend.png')}
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

                <View style={{alignItems: 'center'}}>
                    <TextInput
                        style={[styles.input, {width: windowWidth*0.85}]}
                        placeholder={"Search ..."}
                        onChangeText={(searchTerms) => {
                            setSearchTerms(searchTerms)
                            refreshResults()} //refresh results
                        }
                    />
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
                                            fname = {item.user_givenname}
                                            lname = {item.user_familyname}
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
export default Search;
