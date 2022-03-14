import AsyncStorage from '@react-native-async-storage/async-storage';

export const getKey = async () => {
  try {
    const value = await AsyncStorage.getItem('@api_Key');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('Error retrieving API Key');
  }
};

export const getID = async () => {
  try {
    const value = await AsyncStorage.getItem('@ID');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('Error retrieving ID');
  }
};

export const getApiUrl = async () => {
  try {
    const value = await AsyncStorage.getItem('@api_url');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('Error retrieving api url');
  }
};

export const getPostDraft = async (id) => {
  try {
    const value = await AsyncStorage.getItem('@draft' + id);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('Error retrieving draft post contents');
  }
};

export const storeKey = async (value) => {
  try {
    await AsyncStorage.setItem('@api_Key', value);
  } catch (e) {
    console.log('Error storing API Key');
  }
};

export const storeID = async (value) => {
  try {
    await AsyncStorage.setItem('@ID', value);
  } catch (e) {
    console.log('Error storing ID');
  }
};

export const storeApiUrl = async (value) => {
  try {
    await AsyncStorage.setItem('@api_url', value);
  } catch (e) {
    console.log('Error storing api url');
  }
};

export const storePostDraft = async (id, value) => {
  try {
    await AsyncStorage.setItem('@draft' + id, value);
  } catch (e) {
    console.log('Error storing draft post contents');
  }
};
