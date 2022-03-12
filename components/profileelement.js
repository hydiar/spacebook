import {getKey} from "../scripts/asyncstore";
import {useEffect, useState} from "react";
import { useNavigation } from '@react-navigation/native';
import {ActivityIndicator, Dimensions, Text, TouchableHighlight, View} from "react-native";
import {Avatar} from "react-native-elements";
import * as React from "react";

import ProfilePic from "./profilepic";


export function ProfileElement(props) {
    const windowWidth = Dimensions.get('window').width;
    const icon_size = windowWidth / 7

    const navigation = useNavigation();

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

    return (
        <View style={{flexDirection: 'row', alignItems: "flex-start"}}>

            <View style={{padding: 15, paddingLeft: 0}}>
                <ProfilePic
                    userID = {props.userID}
                />
            </View>

            <View>
                <Text style={{paddingTop: icon_size/3, color: "white", fontSize: 20}}>
                    {props.name}
                </Text>
                <Text style={{color: "white", fontSize: 12}}>{description}</Text>
            </View>
        </View>
    );
}







