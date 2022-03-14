'use strict';

import * as React from 'react';
import {
  Dimensions,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useEffect, useState } from 'react';

import { getKey, getID, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import { ProfileElement } from './profileelement';

function Search() {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 16;

  const [isLoading, setLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState(true);
  const [friendData, setFriendData] = useState([]);
  const [data, setData] = useState([]);

  const GetFriends = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = await getID();
    const url = apiURL + 'user/' + userID + '/friends';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
        },
      });
      const json = await response.json();
      setFriendData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GetUsers = async (searchTerms) => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = await getID();

    let searchQuery = '';
    if (searchTerms && (searchTerms != '') && (searchTerms != ' ')) {
      searchQuery = '?q=' + searchTerms + '&limit=20&offset=0';
      searchQuery = searchQuery.replace(' ', '%20');
    }

    const friendUrl = apiURL + 'search' + searchQuery;
    try {
      const response = await fetch(friendUrl, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
          accept: 'application/json',
        },
      });
      const json = await response.json();
      let searchResults = [];
      for (let i = 0; i < json.length; i++) {
        if (json[i].user_id != userID) {
          searchResults.push(json[i]);
        }
      }

      setData(searchResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetFriends();
    GetUsers();
  }, []);

  function refreshResults() {
    GetUsers(searchTerms);
  }

  function UserElement(props) {
    const [isFriend, setIsFriend] = useState(false);

    async function AddFriend(userID) {
      const apiURL = await getApiUrl();
      const apiKey = await getKey();
      const url = apiURL + 'user/' + userID + '/friends';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'X-Authorization': apiKey,
            Accept: '*/*',
          },
        });
        if (await response.ok) {
          console.log('Friend ' + userID + ' added successfully');
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function CheckFriend() {
      for (let i = 0; i < props.friendData.length; i++) {
        if (props.friendData[i].user_id == props.user_id) {
          setIsFriend(true);
        }
      }
    }

    useEffect(() => {
      CheckFriend();
    }, []);

    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileElement
          userID = {props.user_id}
          desc = "The Universe, Space"
          name = {props.fname + ' ' + props.lname}
        />

        {isFriend ?
          <View/>
          : (
            <View style={ styles.addFriendButtonBox }>
              <TouchableOpacity
                activeOpacity={0.95} style={styles.addButton}
                onPress={() => AddFriend(props.user_id)}>
                <Image source={require('../assets/add_friend.png')}
                       style={{ width: iconSize, height: iconSize }}/>
              </TouchableOpacity>
            </View>
          )}
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

        <View style={{ alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { width: windowWidth * 0.85 }]}
            placeholder={'Search ...'}
            onChangeText={(searchTerms) => {
              setSearchTerms(searchTerms);
              refreshResults();
            }}
          />
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
                      fname = {item.user_givenname}
                      lname = {item.user_familyname}
                      friendData = {friendData}
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

export default Search;
