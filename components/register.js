'use strict';

import * as React from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { storeKey, storeID, getApiUrl } from '../scripts/asyncstore';

import styles from '../styles';
import Home from '../components/home';

function Register({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  let logoSize = windowWidth / 2;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  async function Register() {
    const apiURL = await getApiUrl();
    let key = '';
    let id = '';
    const url = apiURL + 'user';

    try {
      const response = fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });
      if (await response) {
        const loginURL = apiURL + 'login/';

        const result = fetch(loginURL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            key = json.token;
            id = json.id;
          })
          .catch((error) => console.log(error));
        await result;
        if (key != '') {
          //set key in global secure storage
          await storeKey(key);
          key = '';
          await storeID(id);
          id = '';
          navigation.navigate('Home');
        }
      } else {
        console.log('User not created successfully');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (

    <ImageBackground source={require('../assets/stars.png')}
                       style={styles.background}
    >
      <View style={styles.container}>

        <Image source={require('../assets/icon.png')}
               style={{ width: logoSize, height: logoSize }}
        />

        <TextInput
          style={styles.input}
          placeholder={'First Name'}
          onChangeText={(firstName) => setFirstName(firstName)}
          returnKeyType = "done"
        />

        <TextInput
          style={styles.input}
          placeholder={'Last Name'}
          onChangeText={(lastName) => setLastName(lastName)}
          returnKeyType = "done"
        />

        <TextInput
          style={styles.input}
          placeholder={'Email address'}
          onChangeText={(email) => setEmail(email)}
          returnKeyType = "done"
        />

        <TextInput
          style={styles.input}
          placeholder={'Password'}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          returnKeyType = "done"
        />

        <TextInput
          style={styles.input}
          placeholder={'Confirm Password'}
          secureTextEntry={true}
          onChangeText={(passwordConfirm) => setPasswordConfirm(passwordConfirm)}
          returnKeyType = "go"
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              Register();
            }
          }}

        />

        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity
            activeOpacity={0.95}
            style={[styles.button, { backgroundColor: '#E03E69' }]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>
              Go Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.button}
            onPress={() => Register()}>
            <Text style={styles.buttonText}>
              Sign Up
            </Text>
          </TouchableOpacity>

        </View>

        <View style={{ height: windowHeight / 14 }}></View>

      </View>
    </ImageBackground>
  );
}

export default Register;
