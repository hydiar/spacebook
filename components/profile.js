'use strict';

import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { getKey, getID, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import ProfilePic from './profilepic';
import Post from './post';
import { ProfileElement } from './profileelement';

function Profile({ route }) {
  const [isLoadingUser, setUserLoading] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [viewPosts, setViewPosts] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [friendData, setFriendData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]);

  const navigation = useNavigation();

  const CheckOwnProfile = async () => {
    const parsedID = route.params.userID;
    const myID = await getID();
    if (parsedID == myID) {
      navigation.navigate('My Profile');
    }
  };

  let CheckNotFriend = async () => {
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
      let isFriend = false;
      for (let i = 0; i < json.length; i++) {
        if (json[i].user_id == route.params.userID) {
          isFriend = true;
        }
      }

      if (isFriend == true) {
        return false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GetUserData = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = route.params.userID;
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

  const GetUserPosts = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const url = apiURL + 'user/' + route.params.userID + '/post';
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

  const GetUserFriends = async () => {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = route.params.userID;
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

  async function AddFriend() {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = route.params.userID;
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

  useEffect(() => {
    const SetupPage = async () => {
      await CheckOwnProfile();
      await GetUserData();
      if (await CheckNotFriend() == false) {
        setIsPrivate(false);
        GetUserPosts();
        GetUserFriends();
      }
    };
    SetupPage();
  }, []);

  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={styles.navbarBox}>
        <View>
          <NavBar />
        </View>

        <ScrollView>
          <View style={{ alignItems: 'center', padding: 12 }}>
            <ProfilePic
              userID = {route.params.userID}
              multiplier = {5}
            />
          </View>

          {isPrivate ?
            <View>
              {isLoadingUser ? <ActivityIndicator/> : (
                <View style={{ alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.nameText}>
                      {userData.first_name + ' ' + userData.last_name}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.95}
                      style={styles.button}
                      onPress={() => AddFriend()}>
                      <Text style={styles.buttonText}>
                        Add Friend
                      </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              )}
            </View>
            : (
              <View>
                {isLoadingUser ? <ActivityIndicator/> : (
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>

                      <Text style={styles.nameText}>
                        {userData.first_name + ' ' + userData.last_name}
                      </Text>

                      {viewPosts ?
                        <TouchableOpacity
                          activeOpacity={0.95}
                          style={styles.button}
                          onPress={() => setViewPosts(false)}>
                          <Text style={styles.buttonText}>
                            View Friends
                          </Text>
                        </TouchableOpacity> : (

                          <TouchableOpacity
                            activeOpacity={0.95}
                            style={[styles.button, { backgroundColor: '#E03E69' }]}
                            onPress={() => setViewPosts(true)}>
                            <Text style={styles.buttonText}>
                              View Posts
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                  </View>
                )}

                {viewPosts ?
                  <View>
                    {isLoading ? <ActivityIndicator/> : (
                      <View>
                        <Text style={styles.textHeading}>
                          Posts
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
                            />
                          )}
                        />
                      </View>
                    )}
                  </View>
                  : (
                    <ScrollView>
                      <View>
                        <Text style={styles.textHeading}>
                          Friends
                        </Text>
                      </View>

                      <View>
                        {isLoading ? <ActivityIndicator/> : (
                          <FlatList
                            data={friendData}

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
                  )}
              </View>
            )}

        </ScrollView>

      </View>
    </ImageBackground>
  );
}

export default Profile;
