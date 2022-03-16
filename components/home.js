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
  FlatList
} from 'react-native';
import { useEffect, useState } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';

import { getKey, getID, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import Post from './post';

function HomeScreen({ navigation }) {
  const windowWidth = Dimensions.get('window').width;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getAllPosts = async () => {
    const apiURL = await getApiUrl();
    const userID = await getID();
    let apiKey = await getKey();
    const friendUrl = apiURL + 'user/' + userID + '/friends';
    try {
      const response = await fetch(friendUrl, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
        },
      });
      const jsonFriends = await response.json();
      let postArray = [];
      for (let i = 0; i < jsonFriends.length; i++) {
        const urlPosts = apiURL + 'user/' + jsonFriends[i].user_id + '/post';
        try {
          const response = await fetch(urlPosts, {
            method: 'GET',
            headers: {
              'X-Authorization': apiKey,
            },
          });
          const jsonPosts = await response.json();
          for (let i = 0; i < jsonPosts.length; i++) {
            postArray.push(jsonPosts[i]);
          }
        } catch (error) {
          console.error(error);
        }
      }

      postArray.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setData(postArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (

    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={styles.navbarBox}>
        <View>
          <NavBar />
        </View>

        <PullToRefresh onRefresh={getAllPosts}>
          <ScrollView>
            {isLoading ?
              <View style={styles.loading}>
                <ActivityIndicator/>
              </View> : (
              <View>
                {data.length === 0 ?
                  <Text style={styles.noResultText}>
                    No posts to display
                  </Text> : (

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
                      />
                    )}
                  />
                )}
              </View>
            )}
          </ScrollView>
        </PullToRefresh>
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

export default HomeScreen;
