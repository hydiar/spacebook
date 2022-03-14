'use strict';

export const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export function checkEmail(email) {
  if (email.includes('@') && email.length > 4 && email.length < 100) {
    return true;
  }
}

export function checkPassword(password) {
  if (password.length > 6 && password.length < 100) {
    return true;
  }
}

export function checkName(name) {
  if (name.length > 0 && name.length < 100) {
    return true;
  }
}
