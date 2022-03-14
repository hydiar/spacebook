'use strict';

import * as React from 'react';
import {
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
 } from 'react-native';
import { useState } from 'react';

import { storeKey, storeID, getApiUrl } from '../scripts/asyncstore';
import { wait, checkEmail, checkPassword } from '../scripts/validation';
import styles from '../styles';
import Home from '../components/home';

function WelcomeScreen({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let logoSize = windowWidth / 2;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);

  let key = '';
  let id = '';

  async function login() {
    if (checkEmail(email) && checkPassword(password)) {
      const apiURL = await getApiUrl();
      const url = apiURL + 'login'; //for testing on phone
      const result = fetch(url, {
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
        //set key in global async storage
        await storeKey(key);
        await storeID(id);
        navigation.navigate('Home');
      }
    } else {
      console.log('One or more of the inputs are invalid');
      setIsValid(false);
      wait(1500).then(() => setIsValid(true));
    }
  }

  return (
    <ImageBackground source={require('../assets/stars.png')}
                     style={styles.background}
    >
      <View style={[styles.container]}>

        <Image source={require('../assets/icon.png')}
               style={{ width: logoSize, height: logoSize }}
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
          returnKeyType = "go"
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              login();
            }
          }}

        />

        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.button, { backgroundColor: '#E03E69' }]}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.95} style={styles.button}
              onPress={() => login()}>
              <Text style={styles.buttonText}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        {!isValid ?
          <View style={{ position: 'absolute', marginBottom: windowWidth / 10 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>
              Invalid Input
            </Text>
          </View>
            : (
            <View/>
        )}

        <View style={{ height: windowHeight / 14 }}></View>

      </View>
    </ImageBackground>
  );
}

export default WelcomeScreen;
