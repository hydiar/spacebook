'use strict';

import * as React from 'react';
import {
  View,
  ImageBackground,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useEffect, useState } from 'react';

import { getKey, getID, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import { ProfileElement } from './profileelement';

function Friends() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  //Gets an array of the user's friends in JSON format from the /friends endpoint
  // and populates the data array
  const getFriends = async () => {
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
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  //Displays the 'Friends' screen, a FlatList of the currently logged-in user's friends
  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={ styles.background }
    >
      <View style={styles.navbarBox}>
        <View>
          <NavBar />
        </View>

        <ScrollView>
          <View>
            <Text style={styles.textHeading}>
              Your Friends
            </Text>
          </View>

          {isLoading ?
            <View style={styles.loading}>
              <ActivityIndicator/>
            </View> : (
              <View>
              {data.length === 0 ?
                <Text style={styles.noResultText}>
                  No friends to display
                </Text> : (
                <FlatList
                  data={data}

                  keyExtractor={(item) => {
                    return item.user_id;
                  }}

                  renderItem={({ item }) => (
                    <View style={{ marginLeft: 25 }}>
                      <ProfileElement
                        userID = {item.user_id}
                        desc = "The Universe, Space"
                        name = {item.user_givenname + ' ' + item.user_familyname}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

export default Friends;
