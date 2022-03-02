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
    TouchableOpacity,
    Button,
    TextInput
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-elements';

import NavBar from "./navigationbar"
import styles from "../styles"
import {useState} from "react";

function WritePost({ navigation }) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [postText, setPostText] = useState("");

    let icon_size = windowWidth / 7

    return (
        <ImageBackground source={require("../assets/stars_darker.png")} style={{width: windowWidth, height: windowHeight}}>
            <View style={{alignItems: 'top'}}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <NavBar />
                    </View>

                </View>
            </View>

            <View style={{marginLeft: 15, marginTop: 7, alignItems: 'top'}}>
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
                        <Text style={{color: "white", fontSize: 12}}>Change this text or remove ...</Text>
                    </View>
                </View>
            </View>

            <View style={{alignItems: 'center'}}>
                <ScrollView style={styles.scrollView}>

                    <TextInput
                        style={styles.inputBox}
                        multiline
                        placeholder={"Tell people about your space adventures ..."}
                        onChangeText={(postText) => setPostText(postText)}
                        returnKeyType = "done"
                    />

                </ScrollView>

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

                <View style={{flexDirection: 'row'}}>
                    <View>
                        <TouchableOpacity
                            activeOpacity={0.95}
                            style={[styles.button, {backgroundColor: '#E03E69', width: windowWidth/2.2, margin: 6}]}
                            //onPress={() => navigation.navigate('Home')}>
                            onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.buttonText}>Save as Draft</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            activeOpacity={0.95} style={[styles.button, {width: windowWidth/2.2, margin: 6}]}
                            onPress={() => Login()}>

                            <Text style={styles.buttonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </ImageBackground>
    );
}

export default WritePost;
