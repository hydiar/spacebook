'use strict';

import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useEffect, useState } from 'react';

import { getApiUrl, getID, getKey } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';
import ProfilePic from './profilepic';

function EditPost({ route, navigation }) {
  const [postText, setPostText] = useState('');

  async function patchPost() {
    if (postText != '') {
      const apiURL = await getApiUrl();
      const userID = await getID();
      const apiKey = await getKey();
      const postID = route.params.postID;
      const url = apiURL + 'user/' + userID + '/post/' + postID;
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'X-Authorization': apiKey,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: postText,
          }),
        });
        if (await response.ok) {
          console.log('Post ' + postID + ' updated successfully');
          navigation.reset({
            index: 0,
            routes: [{ name: 'My Profile' }],
          });
          navigation.navigate('My Profile');
        } else {
          console.log('Post ' + postID + ' not updated');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    const originalText = route.params.text;
    if (originalText && originalText != '') {
      setPostText(originalText);
    }
  }, []);

  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View style={{ alignItems: 'top' }}>
        <View style={styles.navbarBox}>
          <NavBar />
        </View>
      </View>

      <View style={styles.leftMargin}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <ProfilePic
            userID = { route.params.userID }
            multiplier = {1.5}
          />
          <Text style={styles.largeHeading}>
            Edit Post...
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <ScrollView style={ styles.scrollView }>
          <TextInput
            value={ postText }
            style={ styles.inputBox }
            multiline
            placeholder={ 'Tell people about your space adventures ...' }
            onChangeText={ (postText) => setPostText(postText) }
            returnKeyType = 'done'
          />
        </ScrollView>

        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.postButton, { backgroundColor: '#E03E69' }]}
              onPress={() => navigation.goBack()}>
              <Text style={ styles.buttonText }>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.95} style={ styles.postButton }
              onPress={() => patchPost()}>
              <Text style={ styles.buttonText }>
                Update Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

export default EditPost;
