import {ActivityIndicator, Dimensions, TouchableHighlight, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {getKey} from "../scripts/asyncstore";
import {Avatar} from "react-native-elements";
import * as React from "react";

function ProfilePic(props) {
    const windowWidth = Dimensions.get('window').width;
    const icon_size = windowWidth / 7

    const navigation = useNavigation();

    const [isLoading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState([]);

    const getProfilePic = async () => {
        try {
            const response = await fetch("http://localhost:3333/api/1.0.0/user/" + props.userID + "/photo", {
                method: 'GET',
                headers: {
                    'X-Authorization': await getKey(),
                }
            });
            const blob = await response.blob();
            const pic = URL.createObjectURL(blob)
            setProfilePic(pic);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfilePic();
    }, []);

    let multi
    if (props.multiplier) {
        multi = props.multiplier
    }
    else {
        multi = 1
    }

    return(
        <TouchableHighlight style={{padding: 15, paddingLeft: 0}}
                            onPress={() => {
                                navigation.navigate('Profile', {
                                    userID: props.userID
                                });
                            }}
        >
            <View>
                {isLoading ? <ActivityIndicator/> : (
                    <Avatar
                        size={icon_size * 0.85 * multi}
                        rounded
                        source={profilePic}
                        title="Profile Picture"
                        containerStyle={{ backgroundColor: 'white'  }}
                    />
                )}
            </View>
        </TouchableHighlight>
    )
}

export default ProfilePic;