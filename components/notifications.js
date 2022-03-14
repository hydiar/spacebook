'use strict';

import * as React from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { getKey, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import { ProfileElement } from './profileelement';

function Notifications() {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 18;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const navigation = useNavigation();

  const getFriendRequests = async () => {
    const apiURL = await getApiUrl();
    let apiKey = await getKey();
    const url = apiURL + 'friendrequests';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
          accept: 'application/json',
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
    getFriendRequests();
  }, []);

  function Refresh() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Notifications' }],
    });
    navigation.navigate('Notifications');
  }

  function UserElement(props) {

    async function Accept(userID) {
      const apiURL = await getApiUrl();
      const apiKey = await getKey();
      const url = apiURL + 'friendrequests/' + userID;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'X-Authorization': apiKey,
            Accept: '*/*',
          },
        });
        if (await response.ok) {
          console.log('Friend request from ' + userID + ' accepted');
        } else {
          console.log('Friend request not accepted successfully');
        }
        Refresh();
      } catch (error) {
        console.error(error);
      }
    }

    async function Reject(userID) {
      const apiURL = await getApiUrl();
      const apiKey = await getKey();
      const url = apiURL + 'friendrequests/' + userID;
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'X-Authorization': apiKey,
            Accept: '*/*',
          },
        });
        if (await response.ok) {
          console.log('Friend request from ' + userID + ' rejected');
        } else {
          console.log('Friend request not rejected successfully');
        }
        Refresh();
      } catch (error) {
        console.error(error);
      }

    }

    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileElement
          userID = {props.user_id}
          desc = "The Universe, Space"
          name = {props.fname + ' ' + props.lname}
        />

        <View style={ styles.acceptButtonBox }>
          <TouchableOpacity
            activeOpacity={0.95} style={styles.friendButton}
            onPress={() => Accept(props.user_id)}
          >
            <Image source={require('../assets/accept.png')}
                   style={{ width: iconSize, height: iconSize }}
            />
          </TouchableOpacity>
        </View>

        <View style={ styles.rejectButtonBox }>
          <TouchableOpacity
            activeOpacity={0.95} style={[styles.friendButton, { backgroundColor: '#D41455' }]}
            onPress={() => Reject(props.user_id)}
          >
            <Image source={require('../assets/reject.png')}
                   style={{ width: iconSize, height: iconSize }}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View>
          <NavBar />
        </View>

        <View>
          <Text style={styles.textHeading}>
            Friend Requests
          </Text>
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
                  <View style={{ marginLeft: 25 }}>
                    <UserElement
                      user_id = {item.user_id}
                      fname = {item.first_name}
                      lname = {item.last_name}
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

export default Notifications;
