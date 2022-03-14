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

  async function UpdateProfile() {
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

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 7 }}>
      <TextInput
        style={styles.edit}
        placeholder={props.textField}
        secureTextEntry={props.isPassword}
        onChangeText={(inputText) => setInputText(inputText)}
      />

      <TouchableOpacity
        activeOpacity={0.95}
        style={[styles.button, { backgroundColor: '#E03E69', width: windowWidth * 0.32 }]}
        onPress={() => UpdateProfile()}>
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

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      await UploadProfilePicture(result);
    }
  };

  const GetUserData = async () => {
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
    GetUserData();
  }, []);

  async function UploadProfilePicture(image) {
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

  async function Logout() {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    let logoutSuccess;
    const url = apiURL + 'logout';
    let result = fetch(url, {
      method: 'POST',
      headers: {
        'X-Authorization': apiKey,
      },
    })  //add check whether logout api was connected to before clearing variables and logging out
      .catch((error) => console.log(error));
    await result;
    await storeKey(null);
    await storeID(null);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
    navigation.navigate('Welcome');
  }

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

          <View style={{ marginLeft: 27 }}>
            {isLoading ? <ActivityIndicator/> : (
              <UpdateDetail
                textField = {data.first_name}
                buttonText = "first name"
                postData = "first_name"
              />
            )}
            {isLoading ? <ActivityIndicator/> : (
              <UpdateDetail
                textField = {data.last_name}
                buttonText = "last name"
                postData = "last_name"
              />
            )}
            {isLoading ? <ActivityIndicator/> : (
              <UpdateDetail
                textField = {data.email}
                buttonText = "email"
                postData = "email"
              />
            )}
            {isLoading ? <ActivityIndicator/> : (
              <UpdateDetail
                buttonText = "password"
                postData = "password"
                isPassword = {true}
              />
            )}
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.95}
              style={ styles.uploadButton }
              onPress={() => PickImage()}>
              <Text style={styles.buttonText}>Upload New Profile Picture</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        <View style={ styles.logoutButton }>
          <TouchableOpacity
            activeOpacity={0.95}
            style={[styles.button, { width: windowWidth * 0.5 }]}
            onPress={() => Logout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

export default Settings;
