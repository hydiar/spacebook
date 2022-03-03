'use strict';

import * as React from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import styles from "../styles"

function NavBar() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();

    let icon_size = windowWidth / 7

    let logo_size = (windowWidth / 2) -10

    return (
        <View>
            <View style={[styles.navBox, {borderBottomWidth: 0, paddingTop: 10}]}>

                <Image source={require('../assets/logo.png')}
                       style={{marginLeft: 10, marginBottom: 2, width: logo_size, height: logo_size/4}}/>


                <TouchableHighlight style={{marginLeft: (windowWidth / 2)-icon_size}} onPress={() => navigation.navigate('Welcome')}>
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

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
                        <Image source={require('../assets/home_purple.png')}
                               style={{width: icon_size, height: icon_size}}/>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Friends')}>
                    <Image source={require('../assets/friends.png')}
                           style={{width: icon_size, height: icon_size}}/>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
                    <View>
                        <Avatar
                            size={icon_size}
                            rounded
                            source={require('../assets/notification.png')}
                            title="View Your Profile"
                            containerStyle={{ backgroundColor: 'black' }}
                        />
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
                    <View>
                        <Avatar
                            size={icon_size * 0.75}
                            rounded
                            source={{ uri: 'https://randomuser.me/api/portraits/men/3.jpg' }}
                            title="View Your Profile"
                            containerStyle={{ backgroundColor: 'grey' }}
                        />
                    </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.navButton} onPress={() => navigation.navigate('Welcome')}>
                    <Image source={require('../assets/burger_purple.png')}
                           style={{width: icon_size, height: icon_size}}/>
                </TouchableHighlight>

            </View>
        </View>

    );
}
export default NavBar;