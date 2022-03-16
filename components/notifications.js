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
import PullToRefresh from 'react-simple-pull-to-refresh';

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

  //Gets an array of the user's friend requests in JSON format from the
  // /friendrequests endpoint and populates the data array
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

  //A 'Refresh' function that clears the stack and navigates back to the same screen
  function Refresh() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Notifications' }],
    });
    navigation.navigate('Notifications');
  }

  function UserElement(props) {

    //Sends a POST request to the /friendrequests/{user_id} endpoint to accept the
    // specific friend request
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
        //If an OK is received from the API, the friend request is accepted
        // and the page refreshed
        if (await response.ok) {
          console.log('Friend request from ' + userID + ' accepted');
          Refresh();
        } else {
          console.log('Friend request not accepted successfully');
        }
      } catch (error) {
        console.error(error);
      }
    }

    //Sends a DELETE request to the /friendrequests/{user_id} endpoint to reject the current friend request
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
        //If an OK is received from the API, the friend request is rejected and the page refreshed
        if (await response.ok) {
          console.log('Friend request from ' + userID + ' rejected');
          Refresh();
        } else {
          console.log('Friend request not rejected successfully');
        }
      } catch (error) {
        console.error(error);
      }

    }

    // For each request rendered below, the user's profile picture and name is displayed.
    // An option is diplayed to accept/reject the request.
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

  //Displays the 'Notifications' screen, a FlatList of the currently logged-in user's pending friend requests
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

        <PullToRefresh onRefresh={getFriendRequests}>
          <ScrollView>
            {isLoading ?
              <View style={styles.loading}>
                <ActivityIndicator/>
              </View> : (
                <View>
                {data.length === 0 ?
                  <Text style={styles.noResultText}>
                    No friends requests to display
                  </Text> : (
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
            )}
          </ScrollView>
        </PullToRefresh>
      </View>
    </ImageBackground>
  );
}

export default Notifications;
