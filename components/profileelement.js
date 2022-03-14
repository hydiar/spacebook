'use strict';

import * as React from 'react';
import {
  Dimensions,
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ProfilePic from './profilepic';

export function ProfileElement(props) {
  const windowWidth = Dimensions.get('window').width;
  const iconSize = windowWidth / 7;

  let description = '';

  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (props.time) {
    description = formatDate(props.time);
  } else if (props.desc) {
    description = props.desc;
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

      <View style={{ padding: 15, paddingLeft: 0 }}>
        <ProfilePic
          userID = {props.userID}
        />
      </View>

      <View>
        <Text style={{ paddingTop: iconSize / 3, color: 'white', fontSize: 20 }}
              onPress={() => {
                navigation.push('Profile', {
                  userID: props.userID,
                });
              }}
        >
          {props.name}
        </Text>
        <Text style={{ color: 'white', fontSize: 12 }}>
          {description}
        </Text>
      </View>
    </View>
  );
}

