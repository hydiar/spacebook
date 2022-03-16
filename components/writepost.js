'use strict';

import * as React from 'react';
import {
  Dimensions,
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Picker,
  ActivityIndicator
} from 'react-native';
import { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import { getApiUrl, getID, getKey, getPostDraft, storePostDraft } from '../scripts/asyncstore';
import { wait } from '../scripts/validation';
import styles from '../styles';
import NavBar from './navigationbar';
import ProfilePic from './profilepic';

function WritePost({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 7;

  const [userData, setUserData] = useState([]);
  const [postText, setPostText] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduledPost, setScheduledPost] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date());

  //Gets a single JSON element of the user's current personal information
  // from the /user endpoint and populates it in the data object
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

  //Takes the value from the postText object, packages it in a JSON POST request to
  // the {user_id}/post endpoint, and submits the written post.
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
        } else {
          console.log('Post not successful');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  //When this saveDraftText function is called:
  // If the postText object, and therefore the input box, is not empty:
  // save the current value of postText as a draft associated with the user ID.
  async function saveDraftText() {
    if (postText && postText != '') {
      const id = await getID();
      await storePostDraft(id, postText);
      setDraftSaved(true);
    }
  }

  //When this getDraftText function is called:
  // If the retrieved asynchronous storage object is not empty:
  // set the value of the postText object, and therefore the input box,
  // to that of the previously saved draft.
  async function getDraftText() {
    const id = await getID();
    const draftText = await getPostDraft(id);
    if (draftText && draftText != '') {
      setPostText(draftText);
    }
  }

  //Format the date into a neat text string
  const formatDate = (date) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  //When called, copy the draft value into its own variable, clear the draft value and
  // calculate the difference between the current time and the chosen scheduled post time.
  // Wait that amount of time, and then post the saved post to Spacebook
  const scheduleTextPost = async () => {
    try {
      const postToSend = await getDraftText();
      const userID = await getID();
      await storePostDraft(userID, '');
      const timeToWait = scheduledTime - new Date();
      setScheduledPost(true);
      setPostText('');
      wait(timeToWait).then(async () => {
        setPostText(postToSend);
        await submitPost();
        console.log('Scheduled post successfully posted');
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
    getDraftText();
  }, []);

  //Displays the 'Write post' screen, a text input with options to post to:
  // - Post straight to Spacebook
  // - Save a post as a draft and come back to it later
  // - Schedule a post to be posted at a chosen time
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

        {scheduledPost ?
          <View>
            <Text style={{ padding: 5, color: 'gray', fontSize: 12, textAlign: 'center' }} >
              Post successfully scheduled for {formatDate(scheduledTime)}
            </Text>
          </View>
        : (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {schedulePost ?
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ paddingTop: windowWidth / 32 }}>
                <View style={{ backgroundColor: 'white' }}>
                  <DateTimePicker
                    onChange={(datetime) => setScheduledTime(datetime)}
                    value={scheduledTime}
                  />
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.95}
                style={[styles.postButton, { backgroundColor: '#D13D9D', width: windowWidth / 2 }]}
                onPress={() => scheduleTextPost()}>
                <Text style={styles.buttonText}>
                  Schedule
                </Text>
              </TouchableOpacity>
            </View>
          : (
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.95}
                style={[styles.postButton, { backgroundColor: '#D13D9D' }]}
                onPress={() => setSchedulePost(true)}>
                <Text style={styles.buttonText}>
                  Schedule Post
                </Text>
              </TouchableOpacity>
              <View>
                <Text style={{ padding: 5, color: 'gray', fontSize: 12, textAlign: 'center' }} >
                  Scheduling a post will post your{'\n'}
                  saved draft at a specified time
                </Text>

              </View>
            </View>
          )}
        </View>
      )}


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
