'use strict';

import * as React from 'react';
import {
    Dimensions,
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    TextInput, ActivityIndicator
} from 'react-native';
import { useEffect, useState } from 'react';

import { getApiUrl, getID, getKey, getPostDraft, storePostDraft } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import ProfilePic from './profilepic';

function WritePost({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 7;

  const [userData, setUserData] = useState([]);
  const [postText, setPostText] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);

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
        setLoading(false);
      }
    };

  async function submitPost() {
    if (postText != '') {
      const apiURL = await getApiUrl();
      const userID = await getID();
      const apiKey = await getKey();
      const url = apiURL + 'user/' + userID + '/post';

      try {
        const response = fetch(url, {
          method: 'POST',
          headers: {
            'X-Authorization': apiKey,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: postText,
          }),
        });
        if (await response) {
          console.log('Posted successfully');
          await storePostDraft('');
          navigation.navigate('Home');
        } else {
          console.log('Post not successful');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function saveDraftText() {
    if (postText && postText != '') {
      const id = await getID();
      await storePostDraft(id, postText);
      setDraftSaved(true);
    }
  }

  async function getDraftText() {
    const id = await getID();
    const draftText = await getPostDraft(id);
    if (draftText && draftText != '') {
      setPostText(draftText);
    }
  }

  useEffect(() => {
    getUserData();
    getDraftText();
  }, []);

  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={ styles.background }
    >
      <View>
        <View style={styles.navbarBox}>
          <NavBar />
        </View>
      </View>

      <View style={styles.leftMargin}>
        {isLoading ? <ActivityIndicator/> : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <ProfilePic
              userID = {userData.user_id}
              multiplier = {1.5}
            />
            <Text style={styles.writePostText}
                  onPress={() => {
                    navigation.navigate('My Profile');
                  }}
            >
              {userData.first_name + ' ' + userData.last_name}
            </Text>

          </View>
        )}
      </View>

      <View style={{ alignItems: 'center' }}>
        <ScrollView style={styles.scrollView}>

          <TextInput
            value={postText}
            style={styles.inputBox}
            multiline
            placeholder={'Tell people about your space adventures ...'}
            onChangeText={(postText) => setPostText(postText)}
            returnKeyType = "done"
          />

        </ScrollView>

        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.postButton, { backgroundColor: '#E03E69', }]}
              onPress={() => saveDraftText()}>
              <Text style={styles.buttonText}>
                Save as Draft
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.95} style={ styles.postButton }
              onPress={() => submitPost()}>
              <Text style={styles.buttonText}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {draftSaved ?
          <Text style={{ color: 'white', fontSize: iconSize / 4.5 }}>
            Draft Saved
          </Text> : (
            <View/>
        )}
      </View>

    </ImageBackground>
  );
}

export default WritePost;
