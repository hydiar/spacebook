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

  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={ styles.background }
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View>
          <NavBar />
        </View>

        <ScrollView>
          <View>
            <Text style={styles.textHeading}>
              Your Friends
            </Text>
          </View>

          <View>
            {isLoading ? <ActivityIndicator/> : (
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
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

export default Friends;
