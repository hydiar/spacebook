'use strict';

//Given an amount of time, return a promise that resolves in that time
export const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

//Checks that a given email string has an @ character is longer than 4 characters and less than 100
export function checkEmail(email) {
  if (email.includes('@') && email.length > 5 && email.length < 100) {
    return true;
  }
}

//Checks that a given password string is longer than 6 characters and less than 100
export function checkPassword(password) {
  if (password.length > 6 && password.length < 100) {
    return true;
  }
}

//Checks that a given name string exists and is less than 100 characters
export function checkName(name) {
  if (name.length > 0 && name.length < 100) {
    return true;
  }
}

//Checks that a given search query exists and is less than 100 characters
export function checkSearch(query) {
  if (query.length >= 0 && query.length < 100) {
    return true;
  }
}
