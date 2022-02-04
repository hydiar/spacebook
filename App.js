'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TextInput,
    Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class App extends Component{
  render() {
      let logo_size = windowWidth / 2

      if (windowHeight < windowWidth) {
          logo_size = windowWidth / 5
      }

      const [email, getEmail] = "";
      const [password, getPassword] = "";

      return (
          <ImageBackground source={require("./assets/stars.png")} style={{width: windowWidth, height: windowHeight}}>
              <View style={styles.container}>

                  <Image source={require("./assets/logo.png")}
                         style={{width: logo_size, height: logo_size}}
                  />

                  <TextInput
                      style={styles.input}
                      placeholder={"Phone number or email address"}
                      onChangeText={(email) => setEmail(email)}
                  />

                  <TextInput
                      style={styles.input}
                      placeholder={"Password"}
                      secureTextEntry={true}
                      onChangeText={(password) => setPassword(password)}
                  />

              </View>
          </ImageBackground>

      );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
        borderColor: "transparent",
        borderBottomColor: "#aaa",
        height: 40,
        width: windowWidth * 0.75,
        margin: 12,
        borderWidth: 1,
        //padding: 10,
    },
});

export default App