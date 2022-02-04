'use strict';

import React, { Component } from 'react'
import {
  StyleSheet, Text, View, Image, ImageBackground, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class App extends Component{
  render() {
      let logo_size = windowWidth / 2

      if (windowHeight < windowWidth) {
          logo_size = windowWidth / 5
      }
      return (
          <ImageBackground source={require("./assets/stars.png")} style={{width: windowWidth, height: windowHeight}}>
              <View style={styles.container}>
                  <Text style={styles.text}>Inside</Text>

                  <Image source={require("./assets/logo.png")}
                         style={{width: logo_size, height: logo_size}}
                  />

                  <Text>
                      {"hello, world"}
                  </Text>
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
});

export default App