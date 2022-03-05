import {getKey} from "./asyncstore";
import {useEffect, useState} from "react";
import { useNavigation } from '@react-navigation/native';
import {ActivityIndicator, Dimensions, Text, TouchableHighlight, View} from "react-native";
import {Avatar} from "react-native-elements";
import * as React from "react";

export function ProfileElement(props) {
    const windowWidth = Dimensions.get('window').width;

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

    let description = "";

    const formatDate = (dateString) => {
        const options = {hour: "numeric", minute: "numeric", year: "numeric", month: "long", day: "numeric"}
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    if (props.time) {
        description = formatDate(props.time)
    }
    else if (props.desc) {
        description = props.desc
    }


    let icon_size = windowWidth / 7

    return (
        <View style={{flexDirection: 'row', alignItems: "flex-start"}}>
            <TouchableHighlight style={{padding: 15, paddingLeft: 0}} onPress={() => navigation.navigate('Welcome')}>
                <View>
                    {isLoading ? <ActivityIndicator/> : (
                        <Avatar
                            size={icon_size * 0.85}
                            rounded
                            source={profilePic}
                            title="Profile Picture"
                            containerStyle={{ backgroundColor: 'white'  }}
                        />
                    )}
                </View>
            </TouchableHighlight>

            <View>
                <Text style={{paddingTop: icon_size/3, color: "white", fontSize: 20}}>
                    {props.name}
                </Text>
                <Text style={{color: "white", fontSize: 12}}>{description}</Text>
            </View>
        </View>
    );
}







