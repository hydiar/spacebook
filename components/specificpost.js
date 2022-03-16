'use strict';

import * as React from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  ImageBackground,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';

import { getKey, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import Post from './post';

function SpecificPost({ navigation, route }) {
  const windowWidth = Dimensions.get('window').width;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  //Gets a specific post in JSON format from the /post/{post_id} endpoint
  // and populates the data object
  const getPost = async () => {
    const apiURL = await getApiUrl();
    const userID = route.params.postUserID;
    const postID = route.params.postID;
    let apiKey = await getKey();
    const url = apiURL + 'user/' + userID + '/post/' + postID;
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
    getPost();
  }, []);

  //Displays a specific post in isolation.
  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={styles.navbarBox}>
        <View>
          <NavBar />
        </View>

        <ScrollView>
          <View>
            {isLoading ? <ActivityIndicator/> : (
              <Post
                postID = {data.post_id}
                userID = {data.author.user_id}
                fname = {data.author.first_name}
                lname = {data.author.last_name}
                text = {data.text}
                time = {data.timestamp}
                likes = {data.numLikes}
              />
            )}
          </View>

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

export default SpecificPost;
