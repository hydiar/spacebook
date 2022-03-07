import {Dimensions, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
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
    },
    edit: {
        color: "white",
        placeholderTextColor: "#bbb",
        borderColor: "transparent",
        borderBottomColor: "#aaa",
        height: windowHeight / 22,
        width: windowWidth * 0.5,
        borderWidth: 1
    },
    inputBox: {
        color: "white",
        backgroundColor: "#101010",
        fontSize: 16,
        placeholderTextColor: "#bbb",
        height: windowHeight /1.7,
        width: windowWidth-6,
        margin: 3,
        borderWidth: 1,
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
    navButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7
    },
    navBox: {
        //flex: 1,
        flexDirection: 'row',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        width: windowWidth
    },
    buttonText: {
        color: "#fff",
        fontSize: windowWidth / 25
    },
    editButtonText: {
        color: "#fff",
        fontSize: windowWidth / 30
    }
});
