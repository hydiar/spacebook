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
  FlatList, Text,
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
  const [searchTerms, setSearchTerms] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [friendData, setFriendData] = useState([]);
  const [data, setData] = useState([]);

  const getFriends = async () => {
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

  const getUsers = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = await getID();

    let searchQuery = '?q=' + searchTerms + '&limit=20&offset=0';
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
      setHasSearched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function addFriend(userID) {
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

  function checkFriend(userID) {
    for (let i = 0; i < friendData.length; i++) {
      if (friendData[i].user_id == userID) {
        return true;
      }
    }
  }

  useEffect(() => {
    getFriends();
    checkFriend();
  }, []);

  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View>
          <NavBar />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TextInput
            style={ styles.search }
            placeholder={'Search ...'}
            onChangeText={(search) => setSearchTerms(search)}
          />
          <TouchableOpacity
            activeOpacity={0.95}
            style={ styles.searchButton }
            onPress={() => getUsers()}
          >
            <Image source={require('../assets/search.png')}
                   style={{ width: iconSize, height: iconSize }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {isLoading ? <ActivityIndicator/> : (
            <View>
              {data.length === 0 && hasSearched ?
                <Text style={[styles.noResultText, { paddingLeft: 35 }]}>
                  No results ...
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

                      {checkFriend(item.user_id) ?
                        <View/>
                        : (
                          <View style={ styles.addFriendButtonBox }>
                            <TouchableOpacity
                              activeOpacity={0.95} style={styles.addButton}
                              onPress={() => addFriend(item.user_id)}>
                              <Image source={require('../assets/add_friend.png')}
                                     style={{ width: iconSize, height: iconSize }}/>
                            </TouchableOpacity>
                          </View>
                        )}

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

export default Search;
