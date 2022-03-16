'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';

//Get API key from asyncstorage
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

//Get user ID from asyncstorage
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

//Get API URL from asyncstorage
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

//Get post draft text from asyncstorage
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

//Store API key in asyncstorage
export const storeKey = async (value) => {
  try {
    await AsyncStorage.setItem('@api_Key', value);
  } catch (e) {
    console.log('Error storing API Key');
  }
};

//Store user ID in asyncstorage
export const storeID = async (value) => {
  try {
    await AsyncStorage.setItem('@ID', value);
  } catch (e) {
    console.log('Error storing ID');
  }
};

//Store API URL in asyncstorage
export const storeApiUrl = async (value) => {
  try {
    await AsyncStorage.setItem('@api_url', value);
  } catch (e) {
    console.log('Error storing api url');
  }
};

//Store post draft text in asyncstorage
export const storePostDraft = async (id, value) => {
  try {
    await AsyncStorage.setItem('@draft' + id, value);
  } catch (e) {
    console.log('Error storing draft post contents');
  }
};
