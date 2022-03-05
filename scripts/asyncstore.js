import AsyncStorage from "@react-native-async-storage/async-storage";

export const getKey = async () => {
    try {
        const value = await AsyncStorage.getItem('@api_Key')
        if(value !== null) {
            return value
        }
    } catch(e) {
        console.log("Error retrieving API Key")
    }
}

export const getID = async () => {
    try {
        const value = await AsyncStorage.getItem('@ID')
        if(value !== null) {
            return value
        }
    } catch(e) {
        console.log("Error retrieving ID")
    }
}

export const storeKey = async (value) => {
    try {
        await AsyncStorage.setItem('@api_Key', value)
    } catch (e) {
        console.log("Error storing API Key")
    }
}

export const storeID = async (value) => {
    try {
        await AsyncStorage.setItem('@ID', value)
    } catch (e) {
        console.log("Error storing ID")
    }
}