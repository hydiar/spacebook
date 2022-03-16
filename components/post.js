'use strict';

import * as React from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  Text,
  Share,
  TouchableOpacity
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { getKey, getApiUrl } from '../scripts/asyncstore';
import styles from '../styles';
import { ProfileElement } from './profileelement';

function Post(props) {
  const windowWidth = Dimensions.get('window').width;
  let iconSize = windowWidth / 7;

  const [likeNum, setLikeNum] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  const navigation = useNavigation();

  //Takes the ID of the post and the user and creates a JSON POST
  // request to the {post_id}/like endpoint
  async function likeAction(userID, postID) {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const url = apiURL + 'user/' + userID + '/post/' + postID + '/like';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Authorization': apiKey,
          Accept: '*/*',
        },
      });

      //If an OK is received from the API, the like was successful
      // and the like count is locally updated
      if (await response.ok) {
        console.log('Post ' + postID + ' successfully liked');
        setLikeNum(likeNum + 1);
      }

      //If an OK is not received, the API is either unavailable
      // or has already been liked.
      //A DELETE request is now attempted to the {post_id}/like
      // endpoint to 'un-like' the post.
      else {
        try {
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'X-Authorization': apiKey,
              Accept: '*/*',
            },
          });

          //If an OK is received, the like removal was successful and the like count
          // is locally updated
          //If an OK is not received, the like count remains unchanged.
          if (await response.ok) {
            console.log('Post ' + postID + ' like successfully removed');
            setLikeNum(likeNum - 1);
          } else {
            console.log('Like action ' + postID + ' unsuccessful');
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  //Gets the number of likes for a specific post from the post/{post_id} endpoint and
  // populates the returned integer in the likeNum object
  async function getNumLikes(userID, postID) {
    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const url = apiURL + 'user/' + userID + '/post/' + postID;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Authorization': apiKey,
        },
      });
      const jsonPost = await response.json();
      setLikeNum(jsonPost.numLikes);
    } catch (error) {
      console.error(error);
    }
  }

  //If the user is viewing their own post (e.g. from their 'My Profile' page),
  // set the isEditable boolean to true
  useEffect(() => {
    getNumLikes(props.userID, props.postID);
    if (props.iseditable == 'true') {
      setIsEditable(true);
    }
  }, []);

  //When called, a system share dialogue will be opened to share the text
  // contents of the post
  const sharePost = async () => {
    try {
      await Share.share({
        message:
        props.text,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  //Sends a DELETE request to the /post/{user_id} endpoint to delete the current post
  async function deletePost() {

    function Refresh() {
      navigation.reset({
        index: 0,
        routes: [{ name: 'My Profile' }],
      });
      navigation.navigate('My Profile');
    }

    const apiURL = await getApiUrl();
    const apiKey = await getKey();
    const url = apiURL + 'user/' + props.userID + '/post/' + props.postID;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-Authorization': apiKey,
          Accept: '*/*',
        },
      });

      //If an OK is received from the API, the post is deleted and the page refreshed
      if (await response.ok) {
        console.log('Post ' + props.postID + ' successfully deleted');
        Refresh();
      } else {
        console.log('Post ' + props.postID + ' not deleted successfully');
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* Displays the 'Post' component, which is used to display a Spacebook post.
  The 'Post' component renders the user's profile picture, their name, the time posted,
   the contents and the like count of the post.
  There are also three options (Like, Comment and Share), but Comment has not been implemented.
  If the user taps on the post text or the Comment button, it takes them to 'Specific Post' screen
  The 'Post' component is currently used by the 'Home', 'Profile' and 'My Profile' screens. */
  return (
    <View style={{ marginLeft: 15, marginRight: 10 }}>
      <View style={{ flexDirection: 'row' }}>

        <ProfileElement
          userID = {props.userID}
          time = {props.time}
          name = {props.fname + ' ' + props.lname}
        />

        <View style={{ paddingTop: iconSize / 6 }}>
          {isEditable ?
            <View style={{ flexDirection: 'row', paddingLeft: iconSize * 1.4 }}>

              <TouchableOpacity
                activeOpacity={0.95}
                style={styles.editPostButton}
                onPress={() => navigation.navigate('Edit Post', {
                  postID: props.postID,
                  userID: props.userID,
                  text: props.text,
                })}>
                <Image source={require('../assets/edit.png')}
                       style={{ width: iconSize / 3, height: iconSize / 3 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.95}
                style={[styles.editPostButton, { backgroundColor: '#D41455' }]}
                onPress={() => deletePost()}>
                <Image source={require('../assets/bin.png')}
                       style={{ width: iconSize / 3, height: iconSize / 3 }}
                />
              </TouchableOpacity>

            </View>
            : <View/>
          }
        </View>
      </View>


      <Text style={ styles.postText }
            onPress={() => navigation.navigate('Post', {
              postID: props.postID,
              postUserID: props.userID,
            })}
      >
        {props.text}
      </Text>

      <View style={{ flexDirection: 'row' }}>

        <TouchableHighlight style={{ paddingTop: 3 }}
                            onPress={() => navigation.navigate('Welcome')}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../assets/like_button.png')}
                   style={{ width: iconSize / 3, height: iconSize / 3 }}
            />
            <Text style={{ padding: iconSize / 12, color: 'white', fontSize: 11 }}
            >
              {likeNum}
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={{ position: 'absolute', right: 10 }}
                            onPress={() => navigation.navigate('Post', {
                              postID: props.postID,
                              postUserID: props.userID,
                            })}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ padding: iconSize / 15, color: 'white', fontSize: 11 }}>
              0
            </Text>
            <Image source={require('../assets/comment_button.png')}
                   style={{ width: iconSize / 3, height: iconSize / 3 }}
            />
          </View>
        </TouchableHighlight>

      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 6 }}>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => likeAction(props.userID, props.postID)}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../assets/like_button.png')}
                   style={{ width: iconSize / 2, height: iconSize / 2 }}
            />
            <Text style={ styles.postSubText }>
              Like
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => navigation.navigate('Post',
                              {
                                postID: props.postID,
                                postUserID: props.userID,
                              })}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../assets/comment_button.png')}
                   style={{ width: iconSize / 2, height: iconSize / 2 }}
            />
            <Text style={ styles.postSubText }>
              Comment
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.navButton}
                            onPress={() => sharePost()}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../assets/share_button.png')}
                   style={{ width: iconSize / 2, height: iconSize / 2 }}
            />
            <Text style={ styles.postSubText }>
              Share
            </Text>
          </View>
        </TouchableHighlight>

      </View>
    </View>
  );
}

export default Post;
