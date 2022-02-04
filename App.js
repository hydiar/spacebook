'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TextInput,
    Button,
    TouchableOpacity,
    Linking,
    Dimensions } from "react-native";
import TextAncestorContext from "react-native-web/dist/exports/Text/TextAncestorContext";
import button from "react-native-web/dist/exports/Button";

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
                      placeholder={"Email address"}
                      onChangeText={(email) => setEmail(email)}
                  />

                  <TextInput
                      style={styles.input}
                      placeholder={"Password"}
                      secureTextEntry={true}
                      onChangeText={(password) => setPassword(password)}
                  />

                  <View style={{flexDirection: 'row'}}>
                      <View>
                          <TouchableOpacity activeOpacity={0.95} style={styles.buttonRegister}>
                              <Text style={styles.buttonText}>Register</Text>
                          </TouchableOpacity>
                      </View>

                      <View>
                          <TouchableOpacity activeOpacity={0.95} style={styles.button}>
                              <Text style={styles.buttonText}>Log In</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

                  <View style={{height: windowHeight/14}}></View>

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
        color: "white",
        placeholderTextColor: "#bbb",
        borderColor: "transparent",
        borderBottomColor: "#aaa",
        height: windowHeight / 22,
        width: windowWidth * 0.75,
        margin: 11,
        borderWidth: 1,
        //padding: 10,
    },
    button: {
        flexDirection: 'row',
        height: windowHeight / 23,
        width: windowWidth * 1 / 3,
        backgroundColor: '#791AD9',
        text: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: (windowWidth * 1 / 3) / 8,
        elevation: 10,
        borderRadius: 4
    },
    buttonRegister: {
        flexDirection: 'row',
        height: windowHeight / 23,
        width: windowWidth * 1 / 3,
        backgroundColor: '#E03E69',
        text: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: (windowWidth * 1 / 3) / 8,
        elevation: 10,
        borderRadius: 4

    },
    buttonText: {
        color: "#fff",
        fontSize: windowWidth / 25
    }
});

export default App