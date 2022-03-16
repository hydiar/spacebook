import { Dimensions, StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    background: {
        width: windowWidth,
        height: windowHeight,
      },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    leftMargin: {
        marginLeft: 15,
        marginTop: 7,
        alignItems: 'top',
      },
    navBox: {
        flexDirection: 'row',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        width: windowWidth,
      },
    loading: {
        height: windowHeight/1.3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navbarBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    logo: {
        marginLeft: 10,
        marginBottom: 2,
        width: (windowWidth / 2) - 10,
        height: ((windowWidth / 2) - 10) / 4,
      },
    image: {
        flex: 1,
        justifyContent: 'center',
      },
    input: {
        color: 'white',
        placeholderTextColor: '#bbb',
        borderColor: 'transparent',
        borderBottomColor: '#aaa',
        height: windowHeight / 22,
        width: windowWidth * 0.75,
        margin: 11,
        borderWidth: 1,
      },
    search: {
        color: 'white',
        placeholderTextColor: '#bbb',
        borderColor: 'transparent',
        borderBottomColor: '#aaa',
        height: windowHeight / 22,
        width: windowWidth * 0.72,
        borderWidth: 1,
    },
    edit: {
        color: 'white',
        placeholderTextColor: '#bbb',
        borderColor: 'transparent',
        borderBottomColor: '#aaa',
        height: windowHeight / 22,
        width: windowWidth * 0.5,
        borderWidth: 1,
      },
    inputBox: {
        color: 'white',
        backgroundColor: '#101010',
        fontSize: 16,
        placeholderTextColor: '#bbb',
        height: windowHeight / 1.7,
        width: windowWidth - 6,
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
        borderRadius: 4,
      },
    postButton: {
        flexDirection: 'row',
        height: windowHeight / 23,
        width: windowWidth / 2.2,
        backgroundColor: '#791AD9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: (windowWidth * 1 / 3) / 20,
        borderRadius: 4,
      },
    writePostButton: {
        position: 'absolute',
        top: windowHeight - (windowHeight / 10),
        left: windowWidth - (windowWidth / 4.5),
      },
    writePostText: {
        paddingTop: windowWidth / 21,
        paddingLeft: windowWidth  / 49,
        color: 'white',
        fontSize: windowWidth  / 14,
      },
    navButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
      },
    addButton: {
        height: windowWidth * 1 / 10,
        width: windowWidth * 1 / 8,
        backgroundColor: '#791AD9',
        text: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      },
    friendButton: {
        height: windowWidth * 1 / 10,
        width: windowWidth * 1 / 10,
        backgroundColor: '#791AD9',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      },
    acceptButtonBox: {
        position: 'absolute',
        top: windowWidth / 20,
        left: windowWidth - (windowWidth / 2.8),
        borderRadius: 4,
      },
    rejectButtonBox: {
        position: 'absolute',
        top: windowWidth / 20,
        left: windowWidth - (windowWidth / 4.3),
        borderRadius: 4,
      },
    addFriendButtonBox: {
        position: 'absolute',
        top: windowWidth / 20,
        left: windowWidth - (windowWidth / 3.2),
        borderRadius: 4,
      },
    editPostButton: {
        height: windowHeight / 30,
        width: windowHeight / 30,
        backgroundColor: '#791AD9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: 4,
        elevation: 10,
        borderRadius: 4,
      },
    editProfileButton: {
        height: windowWidth / 12,
        width: windowWidth / 13,
        backgroundColor: '#791AD9',
        text: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: (windowWidth * 1 / 3) / 8,
        elevation: 10,
        borderRadius: 4,
      },
    searchButton: {
        height: windowWidth / 12,
        width: windowWidth / 10,
        backgroundColor: '#791AD9',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 6,
        padding: 3,
        borderRadius: 4,
    },
    logoutButton: {
        position: 'absolute',
        top: windowHeight - (windowHeight / 10),
        left: windowWidth / 5,
      },
    uploadButton: {
        flexDirection: 'row',
        height: windowWidth * 0.12,
        width: windowWidth * 0.86,
        backgroundColor: '#E03E69',
        text: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginHorizontal: (windowWidth * 1 / 3) / 8,
        elevation: 10,
        borderRadius: 4,
      },
    nameText: {
        color: 'white',
        fontSize: 24,
        padding: 6,
        paddingTop: 15,
      },
    postText: {
        color: 'white',
        fontSize: 20,
        width: windowWidth * 0.9,
      },
    postSubText: {
        padding: windowWidth / 56,
        color: 'white',
        fontSize: 14,
      },
    buttonText: {
        color: '#fff',
        fontSize: windowWidth / 25,
      },
    editButtonText: {
        color: '#fff',
        fontSize: windowWidth / 30,
      },
    textHeading: {
        width: windowWidth,
        color: 'white',
        fontSize: 24,
        paddingLeft: 18,
        paddingTop: 12,
      },
    largeHeading: {
        paddingTop: windowWidth / 21,
        paddingLeft: windowWidth / 50,
        color: 'white',
        fontSize: windowWidth / 15,
      },
    subHeading: {
        color: 'white',
        fontSize: 16,
        paddingLeft: 27,
        paddingTop: 18,
      },
    noResultText: {
        color: 'white',
        fontSize: 18,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
  }
);
