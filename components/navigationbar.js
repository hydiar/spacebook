'use strict';

import * as React from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    Dimensions, ActivityIndicator
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import styles from "../styles"
import {ProfilePic, ProfileElement} from "./profileelement";
import {getID, getKey} from "../scripts/asyncstore";
import {useEffect, useState} from "react";

function NavBar() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();

    let icon_size = windowWidth / 7

    let logo_size = (windowWidth / 2) -10

    const [isLoading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState(true);

    const getUserProfilePic = async () => {
        try {
            const userID = await getID()
            const response = await fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
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
        getUserProfilePic();
    }, []);


    return (
        <View>
            <View style={[styles.navBox, {borderBottomWidth: 0, paddingTop: 10}]}>

                <Image source={require('../assets/logo.png')}
                       style={{marginLeft: 10, marginBottom: 2, width: logo_size, height: logo_size/4}}/>


                <TouchableHighlight style={{marginLeft: (windowWidth / 2)-icon_size}} onPress={() => navigation.navigate('Search')}>
                    <View>
                        <Avatar
                            size={icon_size * 0.65}
                            rounded
                            source={require("../assets/search.png")}
                            title="Search"
                            containerStyle={{ backgroundColor: 'white'  }}
                        />
                    </View>
                </TouchableHighlight>


            </View>

            <View style={styles.navBox}>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../assets/home_purple.png')}
                               style={{width: icon_size, height: icon_size}}/>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Friends')}>
                    <Image source={require('../assets/friends.png')}
                           style={{width: icon_size, height: icon_size}}/>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Notifications')}>
                    <View>
                        <Avatar
                            size={icon_size}
                            rounded
                            source={require('../assets/notification.png')}
                            title="Notifications"
                            containerStyle={{ backgroundColor: 'black' }}
                        />
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Home')}>
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

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
                    <Image source={require('../assets/burger_purple.png')}
                           style={{width: icon_size, height: icon_size}}/>
                </TouchableHighlight>

            </View>
        </View>

    );
}
export default NavBar;