'use strict';

import * as React from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    Dimensions,
    Text,
    Button
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import styles from "../styles"

function Post() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();

    let icon_size = windowWidth / 7

    return (
        <View style={{marginLeft: 15, marginRight: 10}}>
            <View style={{flexDirection: 'row', alignItems: "flex-start"}}>
                <TouchableHighlight style={{padding: 15, paddingLeft: 0}} onPress={() => navigation.navigate('Welcome')}>
                    <View>
                        <Avatar
                            size={icon_size * 0.85}
                            rounded
                            source={{ uri: 'https://randomuser.me/api/portraits/men/99.jpg' }}
                            title="Search"
                            containerStyle={{ backgroundColor: 'white'  }}
                        />
                    </View>
                </TouchableHighlight>

                <View>
                    <Text style={{paddingTop: icon_size/3, color: "white", fontSize: 20}}>Harold Parold</Text>
                    <Text style={{color: "white", fontSize: 12}}>3 days ago...</Text>
                </View>
            </View>

            <Text style={{color: "white", fontSize: 20}}>
                Hello everyone, my name is Harold Parold and this is my first post on Spacebook.
                I hope to become an astronaut one day, as my mother always told me to shoot for
                the stars. Please add me as your friend if you can, and I will review your application
                and get back to you as soon as possible. Thanks ;), Hazza P.
            </Text>

            <View style={{flexDirection: 'row', alignItems: "flex-start", padding: 6}}>
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
