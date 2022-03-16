'use strict';

import * as React from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import styles from '../styles';
import { ProfilePic } from './profileelement';
import { getApiUrl, getID, getKey } from '../scripts/asyncstore';

function NavBar() {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 7;
  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(true);

  //Gets the user's profile picture as a blob, creates a local URL
  // reference and populates the profilePic object with it
  const getUserProfilePic = async () => {
      try {
        const apiURL = await getApiUrl();
        const userID = await getID();
        const url = apiURL + 'user/' + userID + '/photo';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Authorization': await getKey(),
          },
        });
        const blob = await response.blob();
        const pic = URL.createObjectURL(blob);
        setProfilePic(pic);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getUserProfilePic();
  }, []);

  //Displays the 'Navigation Bar' component, which is used to navigate the app.
  // It is displayed at the top of most screens.
  return (
    <View>
      <View style={[styles.navBox, { borderBottomWidth: 0, paddingTop: 10 }]}>
        <Image source={require('../assets/logo.png')}
               style={styles.logo}
        />

        <TouchableHighlight style={{ marginLeft: (windowWidth / 2) - iconSize }}
                            onPress={() => navigation.navigate('Search')}
        >
          <View>
            <Avatar
              size={iconSize * 0.65}
              rounded
              source={ require('../assets/search.png')}
              title="Search"
              containerStyle={{ backgroundColor: 'white' }}
            />
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.navBox}>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('Home')}
        >
          <Image source={require('../assets/home_purple.png')}
                 style={{ width: iconSize, height: iconSize }}
          />
        </TouchableHighlight>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('Friends')}
        >
          <Image source={require('../assets/friends.png')}
                 style={{ width: iconSize, height: iconSize }}/>
        </TouchableHighlight>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('Notifications')}
        >
          <View>
            <Avatar
              size={iconSize}
              rounded
              source={require('../assets/notification.png')}
              title="Notifications"
              containerStyle={{ backgroundColor: 'black' }}
            />
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('My Profile')}
        >
          <View>
            {isLoading ? <ActivityIndicator/> : (
              <Avatar
                size={iconSize * 0.85}
                rounded
                source={profilePic}
                title="Profile Picture"
                containerStyle={{ backgroundColor: '#1c1c1c' }}
              />
            )}
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('Settings')}
        >
          <Image source={require('../assets/burger_purple.png')}
                 style={{ width: iconSize, height: iconSize }}
          />
        </TouchableHighlight>

      </View>
    </View>

  );
}

export default NavBar;
