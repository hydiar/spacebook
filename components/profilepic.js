'use strict';

import {
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  View
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { getApiUrl, getKey } from '../scripts/asyncstore';
import { Avatar } from 'react-native-elements';
import * as React from 'react';

function ProfilePic(props) {
  const windowWidth = Dimensions.get('window').width;
  const iconSize = windowWidth / 7;

  const [isLoading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState([]);

  const navigation = useNavigation();

  const getProfilePic = async () => {
    const apiURL = await getApiUrl();
    const url = apiURL + 'user/' + props.userID + '/photo';
    try {
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
    getProfilePic();
  }, []);

  let multi;
  if (props.multiplier) {
    multi = props.multiplier;
  } else {
    multi = 1;
  }

  return (
    <TouchableHighlight
      onPress={() => {
        navigation.push('Profile', {
          userID: props.userID,
        });
      }}
      >

      <View>
        {isLoading ? <ActivityIndicator/> : (
          <Avatar
            size={iconSize * 0.85 * multi}
            rounded
            source={profilePic}
            title="Profile Picture"
            containerStyle={{ backgroundColor: '#1c1c1c' }}
          />
        )}
      </View>
    </TouchableHighlight>
  );
}

export default ProfilePic;
