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
  FlatList, TouchableOpacity
} from 'react-native';
import { useEffect, useState } from 'react';

import { getKey, getID, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import ProfilePic from './profilepic';

import Post from './post';

function MyProfile({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 18;

  const [isLoadingUser, setUserLoading] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]);

  //Gets a single JSON element of the user's personal information
  // from the /user endpoint and populates it in the userData object
  const getUserData = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = await getID();
    const url = apiURL + 'user/' + userID;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
        },
      });
      const json = await response.json();
      setUserData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  };

  //Gets an array of the user's posts in JSON format from the /post
  // endpoint and populates the data array
  const getUserPosts = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = await getID();
    const url = apiURL + 'user/' + userID + '/post';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
        },
      });
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
    getUserPosts();
  }, []);

  //Displays the 'My Profile' screen, an editable Profile displaying the user's own posts
  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={styles.navbarBox}>
        <View>
          <NavBar />
        </View>

        <ScrollView>

        {isLoadingUser && isLoading ?
          <View style={styles.loading}>
            <ActivityIndicator/>
          </View> : (
            <View>

              <View style={{ alignItems: 'center', padding: 12 }}>
                <ProfilePic
                  userID = {userData.user_id}
                  multiplier = {5}
                />
              </View>

              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.nameText}>
                    {userData.first_name + ' ' + userData.last_name}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.95}
                    style={styles.editProfileButton}
                    onPress={() => navigation.navigate('Settings')}
                  >
                    <Image source={require('../assets/edit.png')}
                           style={{ width: iconSize, height: iconSize }}
                    />
                  </TouchableOpacity>
                </View>
              </View>


              <View>

                <Text style={styles.textHeading}>
                  My Posts
                </Text>

                <FlatList
                  data={data}

                  keyExtractor={(item) => {
                    return item.post_id;
                  }}

                  renderItem={({ item }) => (
                    <Post
                      postID = {item.post_id}
                      userID = {item.author.user_id}
                      fname = {item.author.first_name}
                      lname = {item.author.last_name}
                      text = {item.text}
                      time = {item.timestamp}
                      likes = {item.numLikes}
                      iseditable = {'true'}
                    />
                  )}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.writePostButton}>
        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('Write Post')}
        >
          <Image source={require('../assets/new_post.png')}
                 style={{ width: windowWidth / 6.5, height: windowWidth / 6.5 }}
          />
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
}

export default MyProfile;
