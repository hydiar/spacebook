'use strict';

import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { getKey, getID, storeKey, storeID, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import NavBar from './navigationbar';

export function UpdateDetail(props) {
  const windowWidth = Dimensions.get('window').width;
  const [inputText, setInputText] = useState('');

  //Dynamic function that can update a variety of user details.
  //Depending on the props that are parsed to the UpdateDetail component, a json body
  // is created, which is then sent in a PATCH request to the user/{user_id} endpoint
  async function updateProfile() {
    const apiURL = await getApiUrl();
    const userID = await getID();
    const apiKey = await getKey();
    const url = apiURL + 'user/' + userID;

    let jsonBody;
    if (props.postData == 'first_name' && inputText != '') {
      jsonBody = JSON.stringify({
        first_name: inputText,
      });
    } else if (props.postData == 'last_name' && inputText != '') {
      jsonBody = JSON.stringify({
        last_name: inputText,
      });
    } else if (props.postData == 'email' && inputText != '') {
      jsonBody = JSON.stringify({
        email: inputText,
      });
    } else if (props.postData == 'password' && inputText != '') {
      jsonBody = JSON.stringify({
        password: inputText,
      });
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'X-Authorization': apiKey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      });
      if (await response.ok) {
        console.log(props.buttonText + ' updated successfully');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setInputText(props.textField);
  }, []);

  //Displays a text input and a button to update one of many personal details
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 7 }}>
      <TextInput
        style={styles.edit}
        placeholder={inputText}
        secureTextEntry={props.isPassword}
        onChangeText={(inputText) => setInputText(inputText)}
      />

      <TouchableOpacity
        activeOpacity={0.95}
        style={[styles.button, { backgroundColor: '#E03E69', width: windowWidth * 0.32 }]}
        onPress={() => updateProfile()}>
        <Text style={styles.editButtonText}>Update {props.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

function Settings() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const navigation = useNavigation();

  //Define the pickImage function, which uses the ImagePicker tool, allowing users to
  // select local image files or take a picture with their device's camera
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      await uploadProfilePicture(result);
    }
  };

  //Gets a single JSON element of the user's current personal information
  // from the /user endpoint and populates it in the data object
  const getUserData = async () => {
    const apiURL = await getApiUrl();
    const userID = await getID();
    const apiKey = await getKey();
    const url = apiURL + 'user/' + userID;
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

  useEffect(() => {
    getUserData();
  }, []);

  //Sends a post request with the parsed image data to the {user_id}/photo endpoint.
  //Sending an image file to this endpoint updates the user's Spacebook profile picture
  //Once sent, the page is refreshed.
  async function uploadProfilePicture(image) {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const userID = await getID();

    const res = await fetch(image.uri);
    let blob = await res.blob();

    const url = apiURL + 'user/' + userID + '/photo';
    let result = fetch(url, {
      method: 'POST',
      headers: {
        'X-Authorization': apiKey,
      },
      body: blob,
    })
      .catch((error) => console.log(error));
    await result;

    navigation.reset({
      index: 0,
      routes: [{ name: 'Settings' }],
    });
    navigation.navigate('Settings');
  }

  //Sends an authenticated  post request to the /logout endpoint.
  //Once a response is received, the locally stored API key and userID is cleared
  // and the user is navigated back to the login screen.
  async function logout() {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const url = apiURL + 'logout';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Authorization': apiKey,
          Accept: '*/*',
        },
      });
      if (await response.ok) {
        await storeKey(null);
        await storeID(null);
        console.log('Logout successful');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
        navigation.navigate('Welcome');
      } else {
        console.log('Logout unsuccessful');
      }
    } catch (error) {
      console.error(error);
    }
  }

  //Displays numerous text input fields to change the user's personal data, and a
  // button that allows the user to upload a new profile picture.
  return (
    <ImageBackground source={require('../assets/stars_darker.png')}
                     style={styles.background}
    >
      <View>
        <View>
          <NavBar />
        </View>

        <ScrollView>
          <View>
            <Text style={styles.textHeading}>
              Menu
            </Text>

            <Text style={ styles.subHeading }>
              Update Personal Info
            </Text>
          </View>

          {isLoading ?
            <View style={[styles.loading, { height: windowHeight / 3 }]}>
              <ActivityIndicator/>
            </View> : (

            <View style={{ marginLeft: 27 }}>
              <UpdateDetail
                textField = {data.first_name}
                buttonText = "first name"
                postData = "first_name"
              />

              <UpdateDetail
                textField = {data.last_name}
                buttonText = "last name"
                postData = "last_name"
              />

              <UpdateDetail
                textField = {data.email}
                buttonText = "email"
                postData = "email"
              />

              <UpdateDetail
                buttonText = "password"
                postData = "password"
                isPassword = {true}
              />
            </View>
            )}

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.95}
              style={ styles.uploadButton }
              onPress={() => pickImage()}>
              <Text style={styles.buttonText}>Upload New Profile Picture</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        <View style={ styles.logoutButton }>
          <TouchableOpacity
            activeOpacity={0.95}
            style={[styles.button, { width: windowWidth * 0.5 }]}
            onPress={() => logout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

export default Settings;
