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
import { wait, checkEmail, checkPassword, checkName } from '../scripts/validation';

function Register({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  let logoSize = windowWidth / 2;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isValid, setIsValid] = useState(true);

  //After checking each of the inputs for validity and that the passwords match,
  // send a POST request to the /user endpoint to register a new user.
  //If a successful response is received, send another request to the /login endpoint
  // containing the newly registered credentials. Once logged in, navigate to 'Home'.
  async function register() {
    if (password === passwordConfirm) {
      if (checkEmail(email) &&
          checkPassword(password) &&
          checkPassword(passwordConfirm) &&
          checkName(firstName) &&
          checkName(lastName)) {

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
      } else {
        console.log('One or more of the inputs are invalid');
        setIsValid(false);
        wait(1500).then(() => setIsValid(true));
      }
    } else {
      console.log('Passwords do not match');
      setPasswordMatch(false);
      wait(1500).then(() => setPasswordMatch(true));
    }
  }

  //Displays the 'Register' screen, where the user can input their name, an email and a
  // password to register to Spacebook. There is a button to submit these details and
  // register, or another one to go back to the 'Welcome' screen
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
              register();
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
            onPress={() => register()}>
            <Text style={styles.buttonText}>
              Sign Up
            </Text>
          </TouchableOpacity>

        </View>

        {!isValid ?
          <View style={{ position: 'absolute', marginBottom: windowWidth / 1.8 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>
              Invalid Input
            </Text>
          </View>
          : (
            <View/>
          )}

        {!passwordMatch ?
          <View style={{ position: 'absolute', marginBottom: windowWidth / 1.8 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>
              Passwords do not match
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

export default Register;
